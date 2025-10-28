import mongoose from "mongoose";
const Chat_Data_Model = mongoose.Schema({
  room_id: {
    type: String,
    required: true,
  },
  messages: [
    {
      sender_id: String,
      chat: String,
      time: String,
      deleverd: {
        type: Boolean,
        default: false,
      },
      seen: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
export default mongoose.model("chat_data", Chat_Data_Model);
