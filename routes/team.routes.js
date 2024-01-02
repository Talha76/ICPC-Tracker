const router = require("express").Router();
const {
  getTeamList,
  registerTeam,
  uploadTeamContent,
  deleteContent,
  getMyTeams,
  getMyTeam,
  getTeam
} = require("../controllers/team.controllers");
const {
  validateQueryParams
} = require("../middlewares/validators/team");
const {
  isAuthenticated,
  isFaculty
} = require("../middlewares/auth.middlewares");
const {content} = require("../middlewares/multer.middleware");

router.get("/get-team-list", getTeamList);
router.get("/get-my-teams", isAuthenticated, isFaculty, getMyTeams);
router.get("/get-my-team", isAuthenticated, getMyTeam);
router.get("/team/:teamId", getTeam);
router.get("/register-team", isAuthenticated, isFaculty, (req, res) => res.render("register-team", {
  success: req.flash("success"),
  error: req.flash("error")
}));
router.post("/register-team", isAuthenticated, isFaculty, validateQueryParams, registerTeam);
router.get("/upload-team-content", isAuthenticated, isFaculty, (req, res) => res.render("upload-team-content.ejs", {
  success: req.flash("success"),
  error: req.flash("error")
}));
router.post("/upload-team-content", isAuthenticated, isFaculty, content.array("contents"), uploadTeamContent);
router.post("/delete/:teamId", isAuthenticated, isFaculty, deleteContent);

module.exports = router;

