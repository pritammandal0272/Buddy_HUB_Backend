import mongoose from "mongoose";
const UserLoginDataModel = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dob: String,
});
export default mongoose.model("User_Login_Data", UserLoginDataModel);
