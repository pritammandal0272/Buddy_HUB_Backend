import Chat_dataModel from "../Chat_Model/Chat_data.model.js";
import FriendRequest_ReceverModel from "../Model/FriendRequest_Recever.model.js";
import Friend_Request_SenderModel from "../Model/FriendRequest_Sender.model.js";
import User_StoryModel from "../Model/User_Story.model.js";
import userFriendsModel from "../Model/userFriends.model.js";
import UserInformationModel from "../Model/UserInformation.model.js";
import UserPostModel from "../Model/UserPost.model.js";
import UserLoginDataModel from "../Model/UserLoginData.model.js";
import mongoose from "mongoose";
// ==================Find Data Part Start=================
const Find_User_Information = async (req, res) => {
  const Id = req.params.id;
  // console.log(Id);

  try {
    const Data = await UserInformationModel.findOne({ user_id: Id });
    res.send(Data);
  } catch (error) {
    console.log(error);
    res.send(null);
  }
};
const Find_User_Friends = async (req, res) => {
  const Id = req.params.id;
  // console.log(Id);

  try {
    const Data = await userFriendsModel.findOne({ user_id: Id });
    res.send(Data);
  } catch (error) {
    console.log(error);
    res.send(null);
  }
};
const Find_User_Posts = async (req, res) => {
  const Id = req.params.id;
  // console.log(Id);

  try {
    const Data = await UserPostModel.findOne({ user_id: Id });
    res.send(Data);
  } catch (error) {
    console.log(error);
    res.send(null);
  }
};
const Find_All_User = async (req, res) => {
  try {
    const All_Data = await UserInformationModel.find();
    res.send(All_Data);
  } catch (error) {
    console.log(error);
    res.send(null);
  }
};

// ==================Find Data Part End=================

// ==============User About Part Start==============

const setAboutUser = async (req, res) => {
  const { work, education, location, nickname, profession } = req.body;
  const UpdatedData = { work, education, location, nickname, profession };
  for (let key in UpdatedData) {
    if (
      UpdatedData[key] == "" ||
      UpdatedData[key] == null ||
      UpdatedData[key] == undefined
    ) {
      delete UpdatedData[key];
    }
  }
  try {
    const UpdateAbout = await UserInformationModel.updateOne(
      { user_id: req.params.id },
      {
        $set: {
          about: UpdatedData,
        },
      },
      { upsert: true, new: true }
    );
    res.send(UpdateAbout);
  } catch (err) {
    res.send(null);
    console.log(err);
  }
};

// ==============User About Part End==============

// ================Image Upload Cloudnary Part Start===============
const ImageUploadInCloudnary = async (req, res) => {
  // console.log("HI");
  // console.log("Type of req.files:", typeof req.files);
  // console.log("req.files:", JSON.stringify(req.files, null, 2));
  try {
    // console.log(req.files);

    res.send(req.files);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};

const UpdateProfilePhoto = async (req, res) => {
  const Id = req.params.id;
  // console.log(req.body.type);

  const Image = req.body.image;
  // console.log(Image);

  try {
    if (req.body.type == "profile") {
      const UpdateData = await UserInformationModel.findOneAndUpdate(
        { user_id: Id },
        {
          $set: {
            profilePic: Image,
          },
        },
        { upsert: true, new: true }
      );
      // ===========Update On Userpost Collection=============
      await UserPostModel.findOneAndUpdate(
        { user_id: Id },
        {
          $set: {
            profilePic: Image,
          },
        },
        { upsert: true, new: true }
      );
      res.send(UpdateData);
    } else {
      const UpdateData = await UserInformationModel.findOneAndUpdate(
        { user_id: Id },
        {
          $set: {
            coverPhoto: Image,
          },
        },
        { upsert: true, new: true }
      );
      res.send(UpdateData);
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const deleteProfile_Cover_Image = async (req, res) => {
  const { type } = req.body;
  const Id = req.params.id;
  console.log(Id);

  try {
    if (type == "profile") {
      const UpdateData = await UserInformationModel.findOneAndUpdate(
        { user_id: Id },
        {
          $set: {
            profilePic: "",
          },
        },
        { upsert: true, new: true }
      );
      // ===========Update On Userpost Collection=============
      await UserPostModel.findOneAndUpdate(
        { user_id: Id },
        {
          $set: {
            profilePic: "",
          },
        },
        { upsert: true, new: true }
      );
      res.send(UpdateData);
    } else {
      const UpdateData = await UserInformationModel.findOneAndUpdate(
        { user_id: Id },
        {
          $set: {
            coverPhoto: "",
          },
        },
        { upsert: true, new: true }
      );
      res.send(UpdateData);
    }
  } catch (err) {
    console.log(err);
  }
};

// ================Image Upload Cloudnary Part End===============
// =======================Friend Request Part Start==================
const Friend_Request_Send = async (req, res) => {
  const { sender_id, recever_id, status } = req.body;
  try {
    const SenderData = await Friend_Request_SenderModel.updateOne(
      { sender_id: sender_id },
      {
        $push: {
          recever_id: {
            id: recever_id,
            status: status,
          },
        },
      },
      { upsert: true, new: true }
    );
    const ReceverData = await FriendRequest_ReceverModel.updateOne(
      { recever_id: recever_id },
      {
        $push: {
          sender_id: {
            id: sender_id,
          },
        },
      },
      { upsert: true, new: true }
    );
    res.send(SenderData);
  } catch (err) {
    res.send(null);
    console.log(err);
  }
};
const Cancle_Friend_Request = async (req, res) => {
  const { sender_id, recever_id } = req.body;
  try {
    const DeleteSenderArrayElement = await Friend_Request_SenderModel.updateOne(
      { sender_id: sender_id },
      {
        $pull: {
          recever_id: {
            id: recever_id,
          },
        },
      }
    );
    const DeleteReceverArrayElement =
      await FriendRequest_ReceverModel.updateOne(
        { recever_id: recever_id },
        {
          $pull: {
            sender_id: {
              id: sender_id,
            },
          },
        }
      );
    res.send(DeleteSenderArrayElement);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};
const Find_Requested_Data = async (req, res) => {
  const Id = req.params.id;
  try {
    const Data = await Friend_Request_SenderModel.find({ sender_id: Id });
    res.send(Data);
  } catch (err) {
    res.send(null);
    console.log(err);
  }
};

const Find_Recever_Data = async (req, res) => {
  const Id = req.params.id;
  try {
    const Data = await FriendRequest_ReceverModel.find({ recever_id: Id });
    res.send(Data);
  } catch (err) {
    res.send(null);
    console.log(err);
  }
};
const Find_Recever_Data_in_Information_Model = async (req, res) => {
  try {
    const Data = await UserInformationModel.find({
      user_id: { $in: req.body },
    });
    res.send(Data);
  } catch (err) {
    res.send(null);
    console.log(err);
  }
};

const AcceptFriend_Request = async (req, res) => {
  const { sender_id, recever_id } = req.body;
  try {
    const DeleteSenderArrayElement = await Friend_Request_SenderModel.updateOne(
      { sender_id: sender_id },
      {
        $pull: {
          recever_id: {
            id: recever_id,
          },
        },
      }
    );
    const DeleteReceverArrayElement =
      await FriendRequest_ReceverModel.updateOne(
        { recever_id: recever_id },
        {
          $pull: {
            sender_id: {
              id: sender_id,
            },
          },
        }
      );
    const UpdateFriendData_On_User_Friend_Model_Sender =
      await userFriendsModel.updateOne(
        { user_id: sender_id },
        {
          $push: {
            friends: {
              id: recever_id,
            },
          },
        }
      );
    const UpdateFriendData_On_User_Friend_Model_Recever =
      await userFriendsModel.updateOne(
        { user_id: recever_id },
        {
          $push: {
            friends: {
              id: sender_id,
            },
          },
        }
      );
    res.send(DeleteSenderArrayElement);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};
const UnFriend = async (req, res) => {
  const { user1, user2 } = req.body;
  try {
    // ==========User1 Document Update===========
    await userFriendsModel.updateOne(
      { user_id: user1 },
      {
        $pull: {
          friends: {
            id: user2,
          },
        },
      },
      { upsert: true, new: true }
    );
    // ==========User2 Document Update===========
    await userFriendsModel.updateOne(
      { user_id: user2 },
      {
        $pull: {
          friends: {
            id: user1,
          },
        },
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.log(err);
  }
};
// =======================Friend Request Part End==================
// ==================User Post Part Start=======================

const CreatePost_and_IndsertDB = async (req, res) => {
  const Id = req.params.id;
  const { content, image, likes, comments } = req.body;
  try {
    const Insert_Data = await UserPostModel.findOneAndUpdate(
      { user_id: Id },
      {
        $push: {
          posts: {
            content: content,
            image: image,
          },
        },
      },
      { upsert: true, new: true }
    );
    res.send(Insert_Data);
  } catch (error) {
    console.log(error);
    res.send(null);
  }
};
const CreatePost_Insert_DB = async (req, res) => {
  const { user_id, content, ImageArray, catagory, bg_color } = req.body;
  try {
    if (catagory == "image") {
      const Insert_Data = await UserPostModel.findOneAndUpdate(
        { user_id: user_id },
        {
          $push: {
            posts: {
              //Insert Post at First Position
              $each: [
                {
                  content: content,
                  image: ImageArray,
                  catagory: catagory,
                },
              ],
              $position: 0,
            },
          },
        },
        { upsert: true, new: true }
      );
      res.send(Insert_Data);
    } else {
      const Insert_Data = await UserPostModel.findOneAndUpdate(
        { user_id: user_id },
        {
          $push: {
            posts: {
              //Insert Post at First Position
              $each: [
                {
                  content: content,
                  bg_color: bg_color,
                  catagory: catagory,
                },
              ],
              $position: 0,
            },
          },
        },
        { upsert: true, new: true }
      );
      res.send(Insert_Data);
    }
  } catch (err) {
    console.log(err);
  }
};
const DeletePost = async (req, res) => {
  const { user_id, post_id } = req.body;
  try {
    await UserPostModel.updateOne(
      { user_id: user_id },
      {
        $pull: {
          posts: {
            _id: post_id,
          },
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
// ==================User Post Part End=======================
// ====================Search Bar Start====================

const Connection_Part_SearchBox = async (req, res) => {
  const name = req.body.name;
  // console.log(name);

  try {
    const Data = await UserInformationModel.find({
      name: { $regex: "^" + name, $options: "i" }, // Regex for to find this name have on db
      // or oprions "i" means upercase and lowercase  all are same
    });
    res.send(Data);
    // console.log(Data);
  } catch (error) {
    console.log(error);
    res.send(null);
  }
};

// ====================Search Bar End====================
// ===========================Messanger all Controllers Start================

const Chat_Data = async (req, res) => {
  const Room_Id = req.params.id;
  // console.log(Room_Id);

  try {
    const Data = await Chat_dataModel.findOne({ room_id: Room_Id });
    res.send(Data.messages);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};
// ====================Chat Notification Count Start============

const ChatNotification = async (req, res) => {
  const Id = req.params;
  try {
    const Data = await Chat_dataModel.findOne({ room_id: Id.id });
    res.send(Data?.messages);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};

// ====================Chat Notification Count End============

// ===========================Messanger all Controllers End================
// ===========================Story Part all Controllers Start================

const Story_Insert_DB = async (req, res) => {
  const { user_id, story } = req.body;
  try {
    const Insert = await User_StoryModel.insertOne({
      user_id: user_id,
      story: story,
    });
    Insert.save();
    res.send(Insert);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};

const Find_Story = async (req, res) => {
  const user_id = req.params.id;
  try {
    const Find = await User_StoryModel.find({ user_id: user_id });
    res.send(Find);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};
const Find_Story_Using_Array = async (req, res) => {
  const Array_user_id = req.body;
  try {
    const Find = await User_StoryModel.find({
      user_id: { $in: Array_user_id },
    });
    res.send(Find);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};
// ===================Home Random Post Start=======================

const Feed_Random_Post = async (req, res) => {
  try {
    const AllPost = await UserPostModel.aggregate([
      { $unwind: "$posts" }, // Array Name
      {
        $project: {
          // Kon kon gulo ooi document takhe nibo
          user_id: "$user_id",
          type: "post",
          array_emenent_id: "$posts._id",
          catagory: "$posts.catagory",
          bg_color: "$posts.bg_color",
          name: "$user_name",
          profilePic: "$profilePic",
          content: "$posts.content",
          image: "$posts.image",
          likes: "$posts.likes",
          comments: "$posts.comments",
          time: "$posts.time",
        },
      },
      { $sample: { size: 5 } }, // Random Kotoh ta post Nibo
    ]);
    res.send(AllPost);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};
// ===================Home Random Post End=======================
// ===========================Story Part all Controllers End================
const PostLike_and_Comment = async (req, res) => {
  const sender_id = req.params;
  const {
    type,
    recever_id,
    name,
    profilePic,
    comment_content,
    array_emenent_id,
  } = req.body;
  // console.log(req.body);

  try {
    if (type == "like") {
      const Data = await UserPostModel.updateOne(
        { user_id: recever_id, "posts._id": array_emenent_id },
        {
          $push: {
            "posts.$.likes": {
              user_id: sender_id.id,
              name: name,
              profilePic: profilePic,
            },
          },
        }
      );
    } else {
      await UserPostModel.findByIdAndUpdate(
        { user_id: recever_id },
        {
          $push: {
            comments: {
              user_id: sender_id,
              name: name,
              content: comment_content,
              profilePic: profilePic,
            },
          },
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};
const FindLoginData = async (req, res) => {
  const user_id = req.params.id;
  try {
    const UpdatedData = await UserLoginDataModel.find({ _id: user_id });
    res.send(UpdatedData[0]);
  } catch (err) {
    console.log(err);
  }
};
const UpdateEmail = async (req, res) => {
  const user_id = req.params.id;
  const { email } = req.body.email;
  try {
    await UserInformationModel.updateOne(
      { user_id: user_id },
      { $set: { email: email } }
    );
    await UserLoginDataModel.updateOne(
      { _id: user_id },
      { $set: { email: email } }
    );
    const UpdatedData = await UserLoginDataModel.find({ _id: user_id });
    res.send(UpdatedData);
  } catch (err) {
    console.log(err);
  }
};
const ChangePassword = async (req, res) => {
  const user_id = req.params.id;
  const { password } = req.body;
  try {
    await UserLoginDataModel.updateOne(
      { _id: user_id },
      {
        $set: {
          password: password,
        },
      }
    );
    const UpdatedData = await UserLoginDataModel.find({ _id: user_id });
    res.send(UpdatedData[0]);
  } catch (err) {
    console.log(err);
  }
};
const Suggestions_Friend_On_Feed = async (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);

  try {
    const User_Friends = await userFriendsModel.findOne({ user_id: user_id });
    let UserFriends = [];
    for (let i = 0; i < User_Friends.friends.length; i++) {
      UserFriends.push(User_Friends.friends[i].id);
    }
    const ObjectUser_Friends = UserFriends.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    ObjectUser_Friends.push(new mongoose.Types.ObjectId(user_id));
    const RandomFriendSuggestions = await UserInformationModel.aggregate([
      {
        $match: {
          user_id: {
            $nin: ObjectUser_Friends,
          },
        },
      },
      { $sample: { size: 5 } },
    ]);
    res.send(RandomFriendSuggestions);
  } catch (err) {
    console.log(err);
  }
};
export {
  Find_User_Information,
  Find_User_Friends,
  Find_User_Posts,
  CreatePost_and_IndsertDB,
  ImageUploadInCloudnary,
  UpdateProfilePhoto,
  Find_All_User,
  Friend_Request_Send,
  Find_Requested_Data,
  Cancle_Friend_Request,
  Find_Recever_Data,
  Find_Recever_Data_in_Information_Model,
  AcceptFriend_Request,
  CreatePost_Insert_DB,
  Connection_Part_SearchBox,
  Chat_Data,
  ChatNotification,
  Story_Insert_DB,
  Find_Story,
  Find_Story_Using_Array,
  Feed_Random_Post,
  PostLike_and_Comment,
  deleteProfile_Cover_Image,
  UnFriend,
  DeletePost,
  setAboutUser,
  UpdateEmail,
  FindLoginData,
  ChangePassword,
  Suggestions_Friend_On_Feed,
};
