const express = require("express");
const routers = require("./routers.js");

const app = express();

// Connect flash
require("./config/flash.config")(app);

// Morgan
require("./config/morgan.config")(app);

// Bodyparser middleware
require("./config/body-parser.config")(app);

// Express session
require("./config/session.config")(app);

// Passport middleware
require("./config/passport.config")(app);

// MongoDB
require("./config/mongoose.config");

// Ejs template engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.use(routers);

// Static files
app.use(express.static("./uploads"));

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));

