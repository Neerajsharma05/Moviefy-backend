import { getDB } from "../config/db.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Register Controller


export const registerUser = async (req, res) => {
      const db = getDB();
  try {

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

    await db.execute(sql, [name, email, hashedPassword]);

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};

// Login Controller
export const loginUser = async (req, res) => {
      const db = getDB();
  try {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=?";

    const [result] = await db.execute(sql, [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      "secretKey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};