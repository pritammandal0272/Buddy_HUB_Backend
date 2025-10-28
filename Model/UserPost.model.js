import mongoose from "mongoose";
const UserPostModel = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "UserLoginData",
    required: true,
  },
  user_name: String,
  profilePic: String,
  posts: [
    {
      catagory: String,
      bg_color: String,
      content: String,
      image: Array,
      likes: [
        {
          user_id: String,
          name: String,
          profilePic: String,
        },
      ],
      comments: [
        {
          user_id: String,
          name: String,
          content: String,
          time: {
            type: Date,
            default: Date.now,
          },
          profilePic: String,
        },
      ],
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
export default mongoose.model("user_post_data", UserPostModel);
