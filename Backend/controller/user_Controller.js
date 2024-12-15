import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import usermodel from "../models/usermodel.js";

// Login User using phone number and password
const loginUser = async (req, res) => {
  const { user_Phone, user_Password } = req.body; // Using phone number and password for login
  try {
    // Check if user exists
    const user = await usermodel.findOne({ user_Phone });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(user_Password, user.user_Password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate token
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error occurred" });
  }
};

// Helper function to create a token
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" }); // Token valid for 1 day
};

// Fetch User Term Status (True or False)
const checkUserTerm = async (req, res) => {
  try {
    const { userId } = req.body; // Get user ID from request body
    const user = await usermodel.findById(userId); // Find user by ID
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check the user's term acceptance status as a boolean
    const userTermStatus = user.user_Term; // Directly return the boolean value
    return res.json({ success: true, userTermStatus, Id: userId });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching user term status" });
  }
};

// Update User Term Status
const updateUserTerm = async (req, res) => {
  const { userId, user_Term } = req.body;
  try {
    // Validate the user_Term field
    if (typeof user_Term !== "boolean") {
      return res.json({
        success: false,
        message: "user_Term should be a boolean value",
      });
    }

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Update the user's term acceptance status
    user.user_Term = user_Term ? "true" : "false"; // Save as 'true' or 'false'
    await user.save();

    res.json({ success: true, message: "Terms updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating terms" });
  }
};

// Register User
const registerUser = async (req, res) => {
  const { user_Name, user_Email, user_Phone, user_Password } = req.body; // Ensure proper destructuring
  try {
    // Check for missing fields
    if (!user_Name || !user_Email || !user_Phone || !user_Password) {
      return res.json({
        success: false,
        message: "All fields (name, email, phone, password) are required",
      });
    }

    // Check if user already exists
    const emailExists = await usermodel.findOne({ user_Email });
    const phoneExists = await usermodel.findOne({ user_Phone });
    if (emailExists || phoneExists) {
      return res.json({
        success: false,
        message: "Email or phone already in use",
      });
    }

    // Validate email and password
    if (!validator.isEmail(user_Email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (user_Password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_Password, salt);

    // Create user
    const newUser = new usermodel({
      user_Name,
      user_Email,
      user_Phone,
      user_Password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

export { checkUserTerm, loginUser, registerUser, updateUserTerm };
