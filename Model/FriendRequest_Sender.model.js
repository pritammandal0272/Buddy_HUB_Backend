import mongoose from "mongoose";
const Friend_Request_Sender = new mongoose.Schema({
  sender_id: String,
  recever_id: [
    {
      id: String,
      status: String,
    },
  ],
});
export default mongoose.model("Friend_Request_Sender", Friend_Request_Sender);
