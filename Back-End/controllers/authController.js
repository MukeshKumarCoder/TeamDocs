const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup
exports.register = async (req, res) => {
  try {
    // get data from req body
    const { name, email, password } = req.body;

    // validate the data
    if (!name || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check user already exist or not
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //return res
    return res.status(200).json({
      success: true,
      message: "User Is Registered Successfully",
      user,
    });
  } catch (error) {
    console.log("Error register", error);
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;

    // validate data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //user check exist or not
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered please signup first",
      });
    }

    // check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // create token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: false,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error login", error);
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};

// forget password
exports.forgotPassword = async (req, res) => {
  try {
    // get the data from req body
    const { email } = req.body;

    // validate
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // save the user
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail(email, "Reset Password", `Reset here: ${resetUrl}`);

    return res.status(200).json({
      success: true,
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.log("Error password forget", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while forgetting password",
      error: error.message,
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    // get data from body
    const token = req.params.token;
    const { password } = req.body;

    // check user
    const user = await User.findOne({
      token: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.token = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error password reset", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
