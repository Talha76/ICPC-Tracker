const router = require("express").Router();
const {
  getTeamList,
  registerTeam,
  uploadTeamContent,
  deleteContent
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
router.post("/register-team", isAuthenticated, isFaculty, validateQueryParams, registerTeam);
router.post("/upload-team-content", isAuthenticated, isFaculty, content.array("contents"), uploadTeamContent);
router.post("/delete/:teamId", isAuthenticated, isFaculty, deleteContent);

module.exports = router;

