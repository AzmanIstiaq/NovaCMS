import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Manual payload validation
  if (typeof name !== "string" || name.length < 2) {
    return res.status(400).json({ message: "Invalid name: must be at least 2 characters" });
  }
  
  if (typeof name !== "string" || name.length > 50) {
    return res.status(400).json({ message: "Invalid name: must be less than 50 characters" });
  }
  
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email: must be a valid email address" });
  }
  
  if (typeof email !== "string" || email.length > 100) {
    return res.status(400).json({ message: "Invalid email: must be less than 100 characters" });
  }
  
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "Invalid password: must be at least 6 characters" });
  }
  
  if (typeof password !== "string" || password.length > 100) {
    return res.status(400).json({ message: "Invalid password: must be less than 100 characters" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = new User({
    name,
    email,
    passwordHash,
  });

  // Save user to database
  await newUser.save();

  // Respond with success message
  res.status(201).json({ message: "User registered successfully" });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Manual payload validation
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email: must be a valid email address" });
  }
  
  if (typeof email !== "string" || email.length > 100) {
    return res.status(400).json({ message: "Invalid email: must be less than 100 characters" });
  }
  
  if (typeof password !== "string" || password.length < 1) {
    return res.status(400).json({ message: "Invalid password: password is required" });
  }
  
  if (typeof password !== "string" || password.length > 100) {
    return res.status(400).json({ message: "Invalid password: must be less than 100 characters" });
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check if user is banned
  if (user.status === "banned") {
    return res.status(403).json({ message: "User is banned" });
  }

  // Create JWT payload
  const payload = {
    userId: user._id,
    role: user.role,
  };

  // Sign token
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  // Respond with token
  res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
