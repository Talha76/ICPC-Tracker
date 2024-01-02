const Team = require("../../models/team.model");
const User = require("../../models/user.model");

exports.validateQueryParams = async (req, res, next) => {
  try {
    const {teamId, teamName, id1, id2, id3} = req.body;

    if (!teamId || !teamName || !id1 || !id2 || !id3) {
      req.flash("error", "Missing required parameters.")
      return res.redirect("/register-team");
    }

    const team = await Team.findOne({id: teamId});
    if (team) {
      req.flash("error", "Team already exists.")
      return res.redirect("/register-team");
    }

    const userId = req.user.id;
    const coach = await User.findOne({id: userId});
    if (coach.role === "student") {
      req.flash("error", "Only faculty can register a team.")
      return res.redirect("/register-team");
    }
    if (!coach) {
      req.flash("error", "Coach does not exist.")
      return res.redirect("/register-team");
    }

    const teamList = await Team.find();
    const members = new Set([parseInt(id1), parseInt(id2), parseInt(id3)]);
    console.trace(members);
    console.trace(members.size);
    if (members.size !== 3) {
      req.flash("error", "Duplicate members not allowed.");
      return res.redirect("/register-team");
    }

    for (const id of members) {
      if (id === userId) {
        req.flash("error", `Coach can't be member of same team.`);
        return res.redirect("/register-team");
      }
      const user = await User.findOne({id});
      if (!user) {
        req.flash("error", `User with id ${id} does not exist.`);
        return res.redirect("/register-team");
      }
      if (teamList.some(team => team.members.includes(user._id))) {
        req.flash("error", `User with id ${id} is already a member of another team.`);
        return res.redirect("/register-team");
      }
    }
    next();
  } catch (err) {
    console.error(err);
  }
}

