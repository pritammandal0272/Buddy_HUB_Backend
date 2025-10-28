import mongoose from "mongoose";
const UserFriendsModel = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "UserLoginData",
    required: true,
  },
  user_name: String,
  friends: [
    {
      id: String,
    },
  ],
});
export default mongoose.model("User_Friend_Data", UserFriendsModel);
