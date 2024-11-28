import { usertModel as User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userAttemptsModel } from "../models/user_attempts.js";
import { commons, signup_messages as msg } from "../static/message.js";

const signup = async (req, res, next) => {
  let token;
  let existingUser;
  let hashedPassword;

  const { username, email, password, pattern, sets } = req.body;

  console.log(req.body);

  // Validate request body
  if (!username || !email || !password || !pattern || !sets) {
    return res.status(406).json({
      message: commons.invalid_params,
      format: msg.format,
    });
  }

  try {
    // Check if the user already exists
    existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: msg.user_already_exist });
    }
  } catch (err) {
    console.error("Database error while finding user:", err);
    return res.status(500).json({ message: msg.db_user_failed });
  }

  try {
    // Hash the user's password
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.error("Error while hashing password:", err);
    return res.status(500).json({ message: msg.pass_hash_err });
  }

  // Create a new user instance
  const createdUser = new User({
    username: username.toLowerCase(),
    email,
    password: hashedPassword,
    sets,
    pattern,
    sequence: false,
  });

  // Create a new user attempts instance
  const attempts = new userAttemptsModel({
    username: username.toLowerCase(),
    email,
    attempts: 0,
  });

  try {
    // Save user to the database
    await createdUser.save();
  } catch (err) {
    console.error("Error while saving user:", err);
    return res.status(500).json({ message: msg.db_save_err });
  }

  try {
    // Save attempts to the database
    await attempts.save();
  } catch (err) {
    console.error("Error while saving attempts:", err);
    return res.status(500).json({ message: msg.db_save_err });
  }

  try {
    // Generate a token for the user
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "ankuragrwalsdfshfsdfsfsldfdsjflsjflsjfsfjlsadfjsdfjlsdflsjflsajdfflsjfljasdfsdf"
    );
  } catch (err) {
    console.error("Error while generating token:", err);
    return res.status(500).json({ message: commons.token_failed });
  }

  // Send success response
  return res.status(201).json({
    username: createdUser.username,
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
  });
};

export { signup as signupController };
