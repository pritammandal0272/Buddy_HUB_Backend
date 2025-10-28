import { Server } from "socket.io";
import Chat_Data_Model from "../Chat_Model/Chat_data.model.js";
import UserInformationModel from "../Model/UserInformation.model.js";
import UserPostModel from "../Model/UserPost.model.js";
import { connect } from "mongoose";
const Soket_io_Function = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      // origin: "https://buddy-hub-frontend.onrender.com",
      methods: ["GET", "POST"],
    },
  });
  let allOnlineUser = [];
  let RoomJoinRecever = [];
  io.on("connection", async (socket) => {
    const User_Id = socket.handshake.auth;
    allOnlineUser.push(User_Id.user_id);
    try {
      // ==================This is for if the recever_id id is online then update all deleverd message true==================
      const updateDB = await Chat_Data_Model.updateMany(
        {
          "messages.sender_id": User_Id.user_id,
          "messages.deleverd": false,
        },
        {
          $set: {
            "messages.$[msg].deleverd": true,
          },
        },
        {
          arrayFilters: [
            {
              "msg.sender_id": { $ne: User_Id.user_id }, // ==============$ne means oposite of sender id===================
              "msg.deleverd": false,
            },
          ],
          multi: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
    // =============This is for User Online Status & Update DB Start==================
    io.emit("user_online", allOnlineUser);
    socket.on("get_online_users", () => {
      socket.emit("user_online", allOnlineUser);
    });
    try {
      await UserInformationModel.updateOne(
        { user_id: User_Id.user_id },
        {
          $set: {
            online: 1,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
    console.log("New User Connected");
    // console.log(allOnlineUser);
    // =============This is for User Online Status & Update DB End==================

    // =============This is for User Chating Room Create Start==================
    socket.on("select_user_join_room", ({ RoomId, user_id }) => {
      socket.join(RoomId);
      RoomJoinRecever.push({ user_id, RoomId });
      io.emit("home_notification_messenger", user_id);
      console.log("Join: ", RoomJoinRecever);
    });

    socket.on("leave_room", (leave_user) => {
      RoomJoinRecever = RoomJoinRecever.filter((u) => u.user_id !== leave_user);
      console.log("Leave: ", RoomJoinRecever);
    });

    // =============This is for User Chating Room Create End==================

    // ===============Message Seen Part Start==============
    socket.on("seen_message", async ({ RoomId, recever_id }) => {
      const UpdateSeenDataOn_DB = await Chat_Data_Model.updateMany(
        { room_id: RoomId },
        {
          $set: {
            "messages.$[element].seen": true, // at a time array all element Update. Element means Filter Element KEY
          },
        },
        { arrayFilters: [{ "element.sender_id": { $ne: recever_id } }] } // Filter Sender id On db
      );
      io.to(RoomId).emit("message_seen", {
        room_id: RoomId,
        user_id: recever_id,
      });

      // console.log(UpdateSeenDataOn_DB);
    });
    // ===============Message Seen Part End==============

    // =============This is for User Chat sms Send & Update DB Start==================
    socket.on("send_message", async (Data) => {
      const { room_id, sender_id, recever_id, message, time } = Data;
      let SeenSms = false;
      let DeleverdSms = false;
      if (
        RoomJoinRecever.some(
          (u) => u.user_id === recever_id && u.RoomId === room_id
        )
      ) {
        SeenSms = true;
      }

      if (allOnlineUser.includes(recever_id)) {
        DeleverdSms = true;
      }
      try {
        const Insert_Chat_On_DB = await Chat_Data_Model.findOneAndUpdate(
          { room_id: room_id },
          {
            $push: {
              messages: {
                sender_id: sender_id,
                chat: message,
                seen: SeenSms,
                deleverd: DeleverdSms,
                time: time,
              },
            },
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.log(err);
      }
      // console.log(Data.room_id, Data.message);
      io.to(room_id).emit("receved_message", {
        sender_id: Data.sender_id,
        message: Data.message,
        time: Data.time,
        deleverd: DeleverdSms,
        seen: SeenSms,
        room_id: room_id,
      });
      io.emit("receved_notification", {
        recever_id: recever_id,
      });
    });
    // =============This is for User Chat sms Send & Update DB Start==================

    // =============This is for User Send Accept & Cancle Friend Request Start==================
    socket.on("user_friend_request", (data) => {
      console.log(data);
      
      if (allOnlineUser.includes(data.recever_id))
        io.emit("user_friend_request_frontend", data);
    });
    // =============This is for User Accept & Cancle Friend Request End==================

    // =============Like & Comment Update Start==============

    socket.on("like_listen", async (Data) => {
      const {
        type,
        recever_id,
        sender_id,
        name,
        content,
        profilePic,
        comment_content,
        array_emenent_id,
      } = Data;
      try {
        if (type == "like") {
          io.emit("like_update", Data);
          await UserPostModel.updateOne(
            { user_id: recever_id, "posts._id": array_emenent_id },
            {
              $push: {
                "posts.$.likes": {
                  user_id: sender_id,
                  name: name,
                  profilePic: profilePic,
                },
              },
            }
          );
        } else if (type == "dislike") {
          io.emit("like_update", Data);
          const UpdateData = await UserPostModel.updateOne(
            { user_id: recever_id, "posts._id": array_emenent_id },
            {
              $pull: {
                "posts.$.likes": {
                  user_id: sender_id,
                },
              },
            }
          );
          console.log(UpdateData);
        } else if (type == "comment") {
          io.emit("like_update", Data);
          await UserPostModel.updateOne(
            { user_id: recever_id, "posts._id": array_emenent_id },
            {
              $push: {
                "posts.$.comments": {
                  user_id: sender_id,
                  name: name,
                  content: content,
                  profilePic: profilePic,
                },
              },
            }
          );
        }
      } catch (err) {
        console.log(err);
      }
    });

    // =============Like & Comment Update End==============

    // =============This is for User Disconnected & Update DB Start==================
    socket.on("disconnect", async (socket) => {
      console.log("User Dis-Connected");
      // console.log(allOnlineUser);

      try {
        const Data = await UserInformationModel.updateOne(
          { user_id: User_Id.user_id },
          {
            $set: {
              online: 0,
            },
          }
        );
        allOnlineUser = allOnlineUser.filter(
          (items) => items != User_Id.user_id
        );
        io.emit("user_online", allOnlineUser);
        // console.log(allOnlineUser);
      } catch (err) {
        console.log(err);
      }
    });
    // =============This is for User Disconnected & Update DB End==================
  });
};
export default Soket_io_Function;
