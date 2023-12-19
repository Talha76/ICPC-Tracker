const router = require("express").Router();

router.use(require("./routes/team.routes"));
router.use(require("./routes/user.routes"));

module.exports = router;

