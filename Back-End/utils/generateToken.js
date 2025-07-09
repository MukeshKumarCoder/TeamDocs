const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await user.comparePassword(password)))
//     return res.status(400).json({ message: "Invalid credentials" });

//   const token = generateToken(user._id);
//   res.json({ token, user: { id: user._id, name: user.name, email } });
// };


