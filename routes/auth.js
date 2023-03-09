const express = require("express");
const router = express.Router();
// const { registerUser } = require("../controllers/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { forwardAuthenticated } = require("../config/auth");

//Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })(req, res, next);
});

router.get("/login", forwardAuthenticated, (req, res, next) =>
  res.send("User not Logged in")
);

//Register
// router.post("/register", registerUser);
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //checking required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill in all fields" });
  }

  //checking whether password matches with confirm password
  if (password != password2) {
    errors.push({ msg: "passwords do not match" });
  }

  const passwordRegex = /((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)\w.{6,18})/;
  if (!passwordRegex.test(password)) {
    errors.push({
      msg: "password should have one small case, a capital letter, a symbol and a number and also the length should be greater than 8 and less than 20",
    });
  }

  const mailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  if (!mailRegex.test(email)) {
    errors.push({ msg: "Enter a valid email address" });
  }

  //Checking whether the user exists
  const user = User.findOne({ email: email });
  if (user) {
    errors.push({ msg: "User exists already, email already registered" });
  }
  console.log(errors.length);
  console.log(errors.length > 0);
  //validation failed
  if (errors.length > 0) {
    console.log("Validation failes");
    res.send(errors);
  }
  //validation passed
  else {
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      isAdmin: false,
    });

    //hashing password
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        //setting hashed password
        newUser.password = hash;
        //saving the new user into the DB
        newUser
          .save()
          .then(() => console.log("User created"))
          .catch((err) => console.log(err));
      })
    );
    res.send("User created");
  }
});

//Log out handle
router.get("/logout", (req, res) => {
  req.logout();

  res.send("user has been logged out");
});
module.exports = router;
