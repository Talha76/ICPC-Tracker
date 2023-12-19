const router = require("express").Router();
const passport = require("passport");
const upload = require("../middlewares/multer.middleware");
const {
  getUserList,
  getUser,
  registerUser,
  login,
  logout,
  fillInfo,
  getProfile,
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
router.post("/fill-info", isAuthenticated, upload.single("image"), fillInfo);
router.get("/profile", isAuthenticated, getProfile);

module.exports = router;

