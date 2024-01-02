const Team = require("../models/team.model");
const User = require("../models/user.model");
const fs = require("fs");
const exp = require("constants");

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

    const [member1, member2, member3] = await Promise.all([
      User.findOne({id: id1}),
      User.findOne({id: id2}),
      User.findOne({id: id3})
    ]);

    const team = new Team({
      id: teamId,
      name: teamName,
      coach: req.user._id,
      members: [member1._id, member2._id, member3._id]
    });
    await team.save();

    req.flash("success", "Team registered successfully");
    res.redirect("/register-team");
  } catch (err) {
    console.error(err);
  }
}

exports.uploadTeamContent = async (req, res) => {
  try {
    const {teamId} = req.body;
    const files = req.files;

    const team = await Team.findOne({id: teamId});
    if (!team) {
      req.flash("error", "Team not found");
      return res.redirect("/upload-team-content");
    }
    if (team.coach.toString() !== req.user._id.toString()) {
      req.flash("error", "You are not the coach of this team");
      return res.redirect("/upload-team-content");
    }

    for (const file of files) {
      if (file.mimetype.includes("image")) {
        team.photos.push(file.filename);
      } else if (file.mimetype.includes("audio")) {
        team.audios.push(file.filename);
      } else if (file.mimetype.includes("video")) {
        team.videos.push(file.filename);
      } else {
        req.flash("error", "Invalid file type");
        return res.redirect("/upload-team-content");
      }
    }

    await team.save();

    req.flash("success", "Team content uploaded successfully");
    res.redirect("/upload-team-content");
  } catch (err) {
    console.error(err);
  }
}

exports.deleteContent = async (req, res) => {
  try {
    const {filename} = req.query;
    const {teamId} = req.params;

    const team = await Team.findOne({id: teamId});
    if (!team) return res.status(404).json({message: "Team not found"});

    const file = fs.readdirSync("./uploads").find(file => file === filename);
    if (!file) return res.status(404).json({message: "File not found"});

    team.photos = team.photos.filter(photo => photo !== filename);
    team.audios = team.audios.filter(audio => audio !== filename);
    team.videos = team.videos.filter(video => video !== filename);
    await team.save();

    fs.unlink(`./uploads/${filename}`, (err) => console.error(err));

    res.json({message: "Team content deleted successfully", team});
  } catch (err) {
    console.error(err);
  }
}

exports.getMyTeams = async (req, res) => {
  try {
    const teamList = await Team.find({coach: req.user._id});

    res.render("my-teams", {
      teamList,
      success: req.flash("success"),
      error: req.flash("error")
    });
  } catch (err) {
    console.error(err);
  }
}

exports.getMyTeam = async (req, res) => {
  try {
    const teamList = await Team.find();
    const team = teamList.find(team => team.members.includes(req.user._id));
    res.redirect(`/team/${team.id}`);
  } catch (err) {
    console.error(err);
  }
}

exports.getTeam = async (req, res) => {
  try {
    const {teamId} = req.params;
    const team = await Team.findOne({id: teamId});

    if (!team) {
      req.flash("error", "Team not found");
      return res.redirect("/profile");
    }

    const coach = await User.findById(team.coach);

    const members = [];
    for (const _id of team.members) {
      const user = await User.findById(_id);
      members.push({
        id: user.id,
        name: user.name
      });
    }

    res.render("team", {
      team,
      coach,
      members,
      success: req.flash("success"),
      error: req.flash("error")
    });
  } catch (err) {
    console.error(err);
    req.flash("error", err.message);
    res.redirect("/profile");
  }
}
