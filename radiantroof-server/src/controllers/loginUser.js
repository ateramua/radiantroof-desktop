const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user in database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2️⃣ Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // store secret in .env
      { expiresIn: "1h" }
    );

    // 4️⃣ Return user (without password) + token
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      user: userWithoutPassword,
      accessToken,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  loginUser,
};