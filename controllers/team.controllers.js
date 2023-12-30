const Team = require("../models/team.model");
const User = require("../models/user.model");

exports.getTeamList = async (req, res) => {
  try {
    const teamList = await Team.find();
    res.json({message: "Team list retrieved successfully", teamList});
  } catch (err) {
    console.error(err);
  }
}

exports.registerTeam = async (req, res) => {
  try {
    const {teamId, teamName, id1, id2, id3} = req.body;

    const member1 = await User.findOne({id: id1});
    const member2 = await User.findOne({id: id2});
    const member3 = await User.findOne({id: id3});

    const team = new Team({
      id: teamId,
      name: teamName,
      coach: req.user._id,
      members: [member1._id, member2._id, member3._id]
    });
    await team.save();

    res.json({message: "Team registered successfully", team});
  } catch (err) {
    console.error(err);
  }
}

