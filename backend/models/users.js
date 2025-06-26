const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  lastName: { type: String },
  firstName: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

module.exports = mongoose.model("User", userSchema);
