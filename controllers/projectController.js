const Project = require("../modules/project");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const apiFeatures = require("../utils/apiFeatures");
const logActivity = require("../middlewares/activityLogger");

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

const allProjects = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const features = new apiFeatures(Project.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const projects = await features.query;

    res.status(200).json({
      numOfProject: projects.length,
      totalProjects,
      projects,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };

    // Check if there's a file uploaded
    if (req.file) {
      projectData.photo = req.file.filename; // Store the filename in projectData
    }

    // Create a new project
    const newProject = await Project.create(projectData);
    //log the activity
    await logActivity(
      req.user._id,
      "CREATE",
      newProject._id,
      `${newProject.headline}`,
      "project"
    );
    // Send a successful response
    res
      .status(201)
      .json({ message: "item Created succesfully", project: newProject });
  } catch (error) {
    res.status(400).json({ message: error.message }); // Use status 400 for bad requests
  }
};

const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id; // Get the project ID from the request parameters
    const updateData = { ...req.body }; // Get the data to update

    // Find the existing project
    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
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
        existingProject.photo
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
        console.log(`Deleted old image: ${oldImagePath}`);
      }

      updateData.photo = req.file.filename; // Update the photo field
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the update
      }
    );
    // Convert Map to an object
 
    // Log the activity

    await logActivity(
      req.user._id,
      "UPDATE",
      projectId,
      updatedProject.headline,
      "project"
    );

    res.status(200).json({ project: updatedProject });
  } catch (error) {
    console.error(error); // Log the error
    res.status(400).json({ message: error.message }); // Use 400 for client errors
  }
};
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id; // Get the project ID from the request parameters

    // Find the project by ID
    const deletedProject = await Project.findById(projectId);

    // If the project is not found, return a 404 error
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Construct the path to the image file
    const imagePath = path.join(
      __dirname,
      "..",
      "public",
      "img",
      deletedProject.photo
    );
    console.log(imagePath);

    // Remove the image file if it exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the old image
      console.log(`Deleted image: ${imagePath}`);
    }

    // Now delete the project
    await Project.findByIdAndDelete(projectId);

    // Log the activity
    await logActivity(
      req.user._id,
      "DELETE",
      deletedProject._id,
      `${deletedProject.headline}`,
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
  getAProject,
  allProjects,
  createProject,
  updateProject,
  uploadMedia,
  deleteProject,
};
