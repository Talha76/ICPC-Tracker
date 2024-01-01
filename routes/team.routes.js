const router = require("express").Router();
const {
  getTeamList,
  registerTeam,
  uploadTeamContent
} = require("../controllers/team.controllers");
const {
  validateQueryParams
} = require("../middlewares/validators/team");
const {
  isAuthenticated,
  isFaculty
} = require("../middlewares/auth.middlewares");
const upload = require("../middlewares/multer.middleware");

router.get("/get-team-list", getTeamList);
router.post("/register-team", isAuthenticated, isFaculty, validateQueryParams, registerTeam);
router.post("/upload-team-content", isAuthenticated, isFaculty, upload.array("contents"), uploadTeamContent);

module.exports = router;

