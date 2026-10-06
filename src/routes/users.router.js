const express = require("express");
const User = require("../models/user.model");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "El email ya está registrado"
      });
    }

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password,
      cart,
      role
    });

    newUser.password = newUser.hashPassword();

    const userCreated = await newUser.save();

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: userCreated
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message
    });
  }
});

module.exports = router;
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      users
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los usuarios",
      error: error.message
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      user
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, age, password, cart, role } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (email !== undefined) user.email = email;
    if (age !== undefined) user.age = age;
    if (cart !== undefined) user.cart = cart;
    if (role !== undefined) user.role = role;

    if (password !== undefined) {
      user.password = password;
      user.password = user.hashPassword();
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      message: "Usuario eliminado correctamente",
      user: deletedUser
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message
    });
  }
});
module.exports = router;
