import mongoose from "mongoose";
const Friend_Request_Recever = new mongoose.Schema({
  recever_id: String,
  sender_id: [
    {
      id: String,
    },
  ],
});
export default mongoose.model("Friend_Request_Recever", Friend_Request_Recever);
