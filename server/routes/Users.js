const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const PASSWORD = process.env.PASSWORD;
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("../JWT");

// router.get("/:password", async (req, res) => {
//   const { password } = req.params;
//   if (password !== PASSWORD) {
//     return res.status(401).json({
//       message: "Unauthirzed",
//     });
//   }
//   const listOfUsers = await Users.findAll();
//   res.json(listOfUsers);
// });

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await Users.findOne({ where: { email: email } });
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      Users.create({
        name: name,
        email: email,
        password: hash,
      });
      res.json("User Registered Successfully !");
    })
    .catch((err) => {
      if (err) {
        res.status(400).json({ error: err.message });
      }
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email: email } });

  if (!user) {
    res.status(400).json({ error: "User is not Found !" });
  } else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.status(400).json({ error: "Wrong Email And Password Combination" });
      } else {
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
        });
        res.json({ message: "Logged In Successfully", token: accessToken });
      }
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json({ auth: true });
});

router.get("/logout", (req, res) => {
  res.clearCookie("access-token");
  res.json({ message: "Logged Out" });
});

module.exports = router;
