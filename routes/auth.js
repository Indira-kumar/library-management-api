const express = require("express");
const router = express.Router();
// const { registerUser } = require("../controllers/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//Login
router.get("/login", (req, res) => {
  res.send("login");
});

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

  //validation passed
  if (errors.length == 0) {
    res.send("pass");
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "User exists already, email already registered" });
        res.send(errors);
      }

      const newUser = new User({
        name: name,
        email: email,
        password: password,
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
    });
  }
  //validation failed
  else {
    res.send(errors);
  }
});

module.exports = router;
