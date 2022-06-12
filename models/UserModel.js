import pkg from "mongoose";
const { Schema, model } = pkg;
const UserSchema = new Schema({
  login: { type: String, required: true, unique: true, index: true },
  password: String,
  createDate: Date,
  notes: Array
});

export default model("User", UserSchema, "Users");
