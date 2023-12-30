const router = require("express").Router();
const {
  getTeamList,
  registerTeam,
} = require("../controllers/team.controllers");
const {
  validateQueryParams
} = require("../middlewares/validators/team");
const {
  isAuthenticated,
  isFaculty
} = require("../middlewares/auth.middlewares");

router.get("/get-team-list", getTeamList);
router.post("/register-team", isAuthenticated, isFaculty, validateQueryParams, registerTeam);

module.exports = router;

