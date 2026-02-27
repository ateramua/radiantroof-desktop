const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/userControllers");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");

// User CRUD
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


// Authentication
router.post("/login", loginUser);

module.exports = router;