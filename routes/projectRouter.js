const express = require("express");
const {
  authenticateToken,
  isAdmin,
  isUser,
} = require("../middlewares/authMiddleware");
const router = express.Router();
const projectController = require("../controllers/projectController");
router
  .route("/")
  .get(projectController.allProjects)
  .post(
    authenticateToken,
    isUser,
    projectController.uploadMedia,
    projectController.createProject
  );

router
  .route("/:id")
  .get(projectController.getAProject)
  .patch(
    authenticateToken,
    isUser,
    projectController.uploadMedia,
    projectController.updateProject
  )
  .delete(authenticateToken, isUser, projectController.deleteProject);

module.exports = router;
