const Course = require("../modules/course");
const multer = require("multer");
const logActivity = require("../middlewares/activityLogger");
const fs = require("fs");
const path = require("path");
//file handle

const fileError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

// Multer storage configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory for images
    if (file.mimetype.startsWith("image")) {
      cb(null, "public/img"); // For images
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },
  filename: (req, file, cb) => {
    // Get the current timestamp
    const timestamp = Date.now();

    // Generate a random number between 1000 and 9999
    const randomNum = Math.floor(Math.random() * 9000) + 1000;

    // Extract the original file extension
    const originalExt = file.originalname.split(".").pop();

    // Create a new filename with timestamp and random number
    const newFilename = `${timestamp}-${randomNum}.${originalExt}`;

    cb(null, newFilename);
  },
});

// Multer file filter configuration
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(fileError("Invalid file type. Only images are allowed."), false);
  }
};

// Multer configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Export the multer upload middleware for one photo
const uploadMedia = upload.single("photo"); // Only allow one photo
//end file upload

// Get all courses
const allCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      numOfCourses: courses.length,
      courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// Create a new course
const createCourse = async (req, res) => {
  try {
    const courseData = { ...req.body };

    // Check if there's a file uploaded
    if (req.file) {
      courseData.photo = req.file.filename; // Store the filename in projectData
    }

    const newCourse = await Course.create(courseData);
    // log the activity
    const headlineObject = Object.fromEntries(newCourse.headline);
    await logActivity(
      req.user._id,
      "CREATE",
      newCourse._id,
      JSON.stringify(headlineObject),
      "course"
    );
    res
      .status(201)
      .json({ message: "item Created succesfully", course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get a specific course by ID
const getACourse = async (req, res) => {
  try {
    const courseId = req.params.id; // Get the course ID from the request parameters
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id; // Get the project ID from the request parameters
    const updateData = { ...req.body }; // Get the data to update

    // Find the existing project
    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return res.status(404).json({ message: "Project not found" });
    }
    // If a new file is uploaded, handle the photo field
    if (req.file) {
      // Remove the old image if it exists
      const oldImagePath = path.join(
        __dirname,
        "..",
        "public",
        "img",
        existingCourse.photo
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
        console.log(`Deleted old image: ${oldImagePath}`);
      }

      updateData.photo = req.file.filename; // Update the photo field
    }
    // Update the project
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update
    });
    // Convert Map to an object
    const headlineObject = Object.fromEntries(updatedCourse.headline);
    // Log the activity

    await logActivity(
      req.user._id,
      "UPDATE",
      courseId,
      JSON.stringify(headlineObject),
      "course"
    );
    res.status(200).json({ course: updatedCourse });
  } catch (error) {
    res.status(400).json({ message: error.message }); // Use 400 for client errors
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id; // Get the project ID from the request parameters

    // Find the project by ID
    const deletedCourse = await Course.findById(courseId);

    // If the project is not found, return a 404 error
    if (!deletedCourse) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Construct the path to the image file
    const imagePath = path.join(
      __dirname,
      "..",
      "public",
      "img",
      deletedCourse.photo
    );
    console.log(imagePath);

    // Remove the image file if it exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the old image
      console.log(`Deleted image: ${imagePath}`);
    }

    // Now delete the project
    await Course.findByIdAndDelete(courseId);

    // Log the activity
    const headlineObject = Object.fromEntries(deletedCourse.headline);
    await logActivity(
      req.user._id,
      "DELETE",
      deletedCourse._id,
      JSON.stringify(headlineObject),
      "project"
    );

    // Return a success message
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error
    res.status(400).json({ message: error.message }); // Use 400 for client errors
  }
};

module.exports = {
  allCourses,
  createCourse,
  getACourse,
  updateCourse,
  uploadMedia,
  deleteCourse,
};
