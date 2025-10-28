import express, { json } from "express";
import env from "dotenv";
import cors from "cors";
import http from "http";
import {
  FindLoginUser,
  FindLoginUserUsingId,
  GoogleLoginInsertData_DB,
  NewsAPI,
  OTP_Varify,
  Update_google_blank_password,
  UserLogin,
  passport,
} from "./Login_Controller/controller.js";
import {
  AcceptFriend_Request,
  Cancle_Friend_Request,
  ChangePassword,
  Chat_Data,
  ChatNotification,
  Connection_Part_SearchBox,
  CreatePost_and_IndsertDB,
  CreatePost_Insert_DB,
  DeletePost,
  deleteProfile_Cover_Image,
  Feed_Random_Post,
  Find_All_User,
  Find_Recever_Data,
  Find_Recever_Data_in_Information_Model,
  Find_Requested_Data,
  Find_Story,
  Find_Story_Using_Array,
  Find_User_Friends,
  Find_User_Information,
  Find_User_Posts,
  FindLoginData,
  Friend_Request_Send,
  ImageUploadInCloudnary,
  PostLike_and_Comment,
  setAboutUser,
  Story_Insert_DB,
  Suggestions_Friend_On_Feed,
  UnFriend,
  UpdateEmail,
  UpdateProfilePhoto,
} from "./Home_Controller/home_controller.js";
import mongoose from "mongoose";
import upload from "./Cloudnary/cloudnary.js";
import Soket_io_Function from "./Soket_io/Soket_Io_Funcanlityes.js";
const app = express();

env.config();
app.use(express.json());
app.use(
  cors({
    // origin:["https://buddy-hub-frontend.onrender.com"],
    origin:
      "https://buddy-hub-backend-85sk7kc4d-pritam-mandals-projects-73e03c4f.vercel.app",
    methods: ["GET", "POST"],
  })
);
app.use(passport.initialize());

// ===================Soket io Part Start===============

const server = http.createServer(app);
Soket_io_Function(server);
// ===================Soket io Part End===============

// ==================LogIn Page Part Start=========================
app.get("/news", NewsAPI);
app.post("/login", UserLogin);
app.get("/find/loginuser:id", FindLoginUser);
app.get("/find/FindLoginUserUsingId:id", FindLoginUserUsingId);
app.get("/verify-otp:id", OTP_Varify);

// ============google Passport Start==========
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    res.redirect(
      "https://buddy-hub-frontend-19edrwrjb-pritam-mandals-projects-73e03c4f.vercel.app"
    );
  }
);
// ============google Passport End==========

app.get("/google-data", GoogleLoginInsertData_DB);
app.post("/update-google-blank-password", Update_google_blank_password);

// ==================LogIn Page Part End=========================

// =+++++++++++++++++++++++++++++= Home Page Route Start =++++++++++++++++++++++++=

app.get("/home/find-user-information:id", Find_User_Information);
app.post("/home/about_update:id", setAboutUser);
app.post("/home/update-email:id", UpdateEmail);
app.get("/home/find-logindata:id", FindLoginData);
app.post("/home/change-password:id", ChangePassword);
app.get("/home/find-user-friends:id", Find_User_Friends);
app.get("/home/find-user-posts:id", Find_User_Posts);
app.post("/home/create-and-insert-post:id", CreatePost_and_IndsertDB);
app.post("/home/upload", upload.array("image", 10), ImageUploadInCloudnary);
app.post("/home/update-profile-photo:id", UpdateProfilePhoto);
app.post("/home/delete-profile-photo:id", deleteProfile_Cover_Image);
app.get("/home/find-all-user", Find_All_User);
app.post("/home/friend-request-send", Friend_Request_Send);
app.post("/home/cancle-friend-request", Cancle_Friend_Request);
app.get("/home/friend-requested-data:id", Find_Requested_Data);
app.get("/home/friend-recever-data:id", Find_Recever_Data);
app.post("/home/unfriend", UnFriend);
app.post(
  "/home/friend-recever-data-information-model",
  Find_Recever_Data_in_Information_Model
);
app.post("/home/friend-request-accept", AcceptFriend_Request);
app.post("/home/create-post-inser-db", CreatePost_Insert_DB);

// ===============Search Box Route Start==============
app.post("/home/connection-part-searchbox", Connection_Part_SearchBox);
// ===============Search Box Route End==============
// =+++++++++++++++++++++++++++++= Home Page Route End =++++++++++++++++++++++++=

// ===========================Messanger all Routes Start================

app.get("/messenger/find-chat:id", Chat_Data);
app.get("/messenger/chat-notification:id", ChatNotification);

// ===========================Messanger all Routes End================

// ===========================Story Part all Routes Start================
app.post("/home/story/insert-story", Story_Insert_DB);
app.get("/home/story/find-story:id", Find_Story);
app.post("/home/story/find-story-array", Find_Story_Using_Array);
// ===========================Story Part all Routes End================

// ======================Home Random Post Route Start================

app.get("/home/feed/all-posts", Feed_Random_Post);
app.post("/home/feed/delete-post", DeletePost);
app.post("/home/feed/like-comments:id", PostLike_and_Comment);

// =====================Suggestions Friends On Feed Start==============
app.get("/home/suggestions-friends:id", Suggestions_Friend_On_Feed);
// =====================Suggestions Friends On Feed End==============

// ======================Home Random Post Route End================
mongoose.connect(process.env.MONGO_URL).then(() => {
  try {
    console.log("Mongoose Connected SucessFully");
  } catch (err) {
    console.log(err);
  }
});

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server is Running in PORT: ${process.env.PORT}`);
});
