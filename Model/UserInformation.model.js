import mongoose, { Types } from "mongoose";
const UserInformationModel = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "UserLoginData",
  },
  name: String,
  email: String,
  dob: String,
  bio: {
    type: String,
    default: "Buddy Hub is my new Hangout Space!",
  },
  about: {
    type: [
      {
        work: { type: String, default: "No Workplace to Show" },
        education: { type: String, default: "No Education to Show" },
        location: { type: String, default: "No location to Show" },
        nickname: { type: String, default: "No Nick Name added" },
        profession: { type: String, default: "No Profession to Show" },
      },
    ],
    default: [{}],
  },
  coverPhoto: String,
  profilePic: String,
  work: String,
  time: {
    type: Date,
    default: Date.now,
  },
  online: Number,
  education: String,
  location: String,
});
export default mongoose.model("User_Information_Data", UserInformationModel);
