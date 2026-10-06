const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user.model");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos"
      });
    }

    const passwordValid = bcrypt.compareSync(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.status(200).json({
      message: "Login exitoso",
      token
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error en el login",
      error: error.message
    });
  }
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      message: "Usuario autenticado correctamente",
      user: req.user
    });
  }
);

module.exports = router;
