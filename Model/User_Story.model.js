import mongoose, { Mongoose } from "mongoose";
const User_Story_Model = new mongoose.Schema({
  user_id: String,
  story: {
    catagory: String,
    content: String,
    bgcolor: {
      type: String,
      default: "tomato",
    },
  },
  // Auto delete on 24Hours
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24,
  },
});
export default mongoose.model("user_story", User_Story_Model);
