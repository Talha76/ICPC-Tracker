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
  getIndex,
  getLogin
} = require("../controllers/user.controllers");
const {
  isAuthenticated,
  isNotAuthenticated,
  passportMiddleware,
} = require("../middlewares/auth.middlewares");
const {validateEmail} = require("../middlewares/validators/user");

router.get("/", getIndex);
router.get("/get-user-list", getUserList);
router.get("/get-user/:id", getUser);
router.post("/register-user", isNotAuthenticated, registerUser);
router.get("/login", isNotAuthenticated, getLogin);
router.post("/login", isNotAuthenticated, passportMiddleware, login);
router.get("/logout", isAuthenticated, logout);
router.get("/fill-info", isAuthenticated, getFillInfo);
router.post("/fill-info", isAuthenticated, avatar.single("image"), fillInfo);
router.get("/profile", isAuthenticated, getProfile);
router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/auth/google/callback", passport.authenticate("google", {failureRedirect: "/auth/google"}), login);
router.post("/change-pass", isAuthenticated, changePassword);
router.get("/forgot-pass", isNotAuthenticated, (req, res) => res.render("forgot-pass", {
  success: req.flash("success"),
  error: req.flash("error"),
}));
router.post("/forgot-pass", isNotAuthenticated, validateEmail, forgotPassword);
router.get("/reset-pass", isNotAuthenticated, (req, res) => res.render("reset-pass", {
  success: req.flash("success"),
  error: req.flash("error"),
}));
router.post("/reset-pass", isNotAuthenticated, resetPassword);
router.get("/update-info", isAuthenticated, (req, res) => res.render("update-info", {
  user: req.user,
  success: req.flash("success"),
}));
router.post("/update-info", isAuthenticated, avatar.single("image"), updateInfo);
router.get("/download/:filename", isAuthenticated, (req, res) => {
  const {filename} = req.params;
  res.download(`uploads/${filename}`);
});

module.exports = router;

