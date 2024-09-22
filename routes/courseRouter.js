const express = require("express");
router = express.Router();
const courseController = require("../controllers/courseController");
const {
  authenticateToken,
  isAdmin,
  isUser,
} = require("../middlewares/authMiddleware");
router
  .route("/")
  .get(courseController.allCourses)
  .post(
    authenticateToken,
    isUser,
    courseController.uploadMedia,
    courseController.createCourse
  );
router
  .route("/:id")
  .get(courseController.getACourse)
  .patch(
    authenticateToken,
    isUser,
    courseController.uploadMedia,
    courseController.updateCourse
  )
  .delete(authenticateToken, isUser, courseController.deleteCourse);

module.exports = router;
