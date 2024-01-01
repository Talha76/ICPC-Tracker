const router = require("express").Router();
const passport = require("passport");
const {avatar} = require("../middlewares/multer.middleware");
const {
  getUserList,
  getUser,
  registerUser,
  login,
  logout,
  fillInfo,
  getProfile,
  getFillInfo,
  changePassword,
  forgotPassword,
  resetPassword,
  updateInfo,
  uploadAvatar
} = require("../controllers/user.controllers");
const {
  isAuthenticated,
  isNotAuthenticated,
  passportMiddleware
} = require("../middlewares/auth.middlewares");

router.get("/get-user-list", getUserList);
router.get("/get-user/:id", getUser);
router.post("/register-user", isNotAuthenticated, registerUser);
router.post("/login", isNotAuthenticated, passportMiddleware, login);
router.get("/logout", isAuthenticated, logout);
router.get("/fill-info", isAuthenticated, getFillInfo);
router.post("/fill-info", isAuthenticated, avatar.single("image"), fillInfo);
router.get("/profile", isAuthenticated, getProfile);
router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/auth/google/callback", passport.authenticate("google", {failureRedirect: "/auth/google"}), login);
router.post("/change-pass", isAuthenticated, changePassword);
router.post("/forgot-pass", isNotAuthenticated, forgotPassword);
router.post("/reset-pass", isNotAuthenticated, resetPassword);
router.post("/update-info", isAuthenticated, updateInfo);
router.post("/upload-avatar", isAuthenticated, avatar.single("image"), uploadAvatar);

module.exports = router;

