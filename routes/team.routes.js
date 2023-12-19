const router = require("express").Router();
const {
  getTeamList,
  registerTeam,
} = require("../controllers/team.controllers");

router.get("/get-team-list", getTeamList);
router.post("/register-team", registerTeam);

module.exports = router;

