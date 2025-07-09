const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);

// localhost:5173/reset-password/e812a126143fc8064ccd0287dd1937d244ea75e300ef9a53de0e71c93091193d