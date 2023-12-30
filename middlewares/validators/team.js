const Team = require("../../models/team.model");
const User = require("../../models/user.model");

exports.validateQueryParams = async (req, res, next) => {
  try {
    const {teamId, teamName, id1, id2, id3} = req.body;

    if (!teamId || !teamName || !id1 || !id2 || !id3)
      return res.status(400).json({
        message: "Missing required parameters.\n"+
        "Required params: teamId, teamName, coachId, id1, id2, id3"
      });

    const team = await Team.findOne({id: teamId});
    if (team) return res.status(400).json({message: "Team already exists."});

    const userId = req.user.id;
    const coach = await User.findOne({id: userId});
    if (coach.role === "student") return res.status(400).json({message: "Student cannot be a coach."});
    if (!coach) return res.status(400).json({message: "Coach does not exist."});

    const members = [id1, id2, id3];
    for (const id of members) {
      const user = await User.findOne({id});
      if (parseInt(id) === userId) return res.status(400).json({message: "Coach cannot be a member of the same team."});
      if (!user) return res.status(400).json({message: `User does not exist with id ${id}.`});
    }
    next();
  } catch (err) {
    console.error(err);
  }
}

