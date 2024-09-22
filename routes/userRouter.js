const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateToken,
  isAdmin,
  isUser,
} = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");
router.route("/login").post(authController.login);

router
  .route("/profile")
  .get(authenticateToken, isAdmin, userController.userProfile);
router
  .route("/")
  .get(authenticateToken, isAdmin, userController.allUsers)
  .post(authenticateToken, isAdmin, userController.createUser);

router
  .route("/:id")
  .get(authenticateToken, isAdmin, userController.getAUser)
  .delete(authenticateToken, isAdmin, userController.deleteUser);
module.exports = router;
