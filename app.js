const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const app = express();

// passport config
require("./config/passport")(passport);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//DB connection
const DB_URI = process.env.MONGO_URI;
mongoose
  .connect(DB_URI)
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.log(err));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
