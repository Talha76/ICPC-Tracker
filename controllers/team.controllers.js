exports.getTeamList = (req, res) => {
  res.json({message: "Team list retrieved successfully"});
}

exports.registerTeam = (req, res) => {
  const {teamId, teamName, id1, id2, id3} = req.body;
  res.json({message: "Team registered successfully"});
}

