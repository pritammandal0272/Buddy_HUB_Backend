import UserLoginDataModel from "../Model/UserLoginData.model.js";
import nodemailer from "nodemailer";
import validator from "email-validator";
import { Random_OTP } from "./RandomOTP.js";
import { Strategy as OAuth2Strategy } from "passport-google-oauth20";
import passport from "passport";
import env from "dotenv";
import UserInformationModel from "../Model/UserInformation.model.js";
import UserPostModel from "../Model/UserPost.model.js";
import userFriendsModel from "../Model/userFriends.model.js";
env.config();
let Res_Google_UserData = { name: "", email: "" };
// ===========Google Athontigation Start============
passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      Res_Google_UserData = {
        name: profile.displayName,
        email: profile.emails[0].value,
      };
      return done(null, profile);
    }
  )
);

// ===========Google Athontigation End============

const NewsAPI = async (req, res) => {
  try {
    const DataFetch = await fetch(
      "https://newsapi.org/v2/everything?q=tesla&from=2025-09-21&sortBy=publishedAt&apiKey=3059aa1fbccb42eeba75a3889d061185"
    );
    const Response = await DataFetch.json();
    res.send(Response);
  } catch (err) {
    console.log(err);
    res.send({ status: "Data Not Found" });
  }
};

// ===========================Importent First When Login all Collection Create Start==============

const UserLogin = async (req, res) => {
  const Data = req.body;
  try {
    const InsertData = await UserLoginDataModel.insertOne(Data);
    await InsertData.save();
    const Insert_UserInfomation_model = await UserInformationModel.updateOne(
      { user_id: InsertData._id },
      {
        $set: {
          name: InsertData.name,
          email: InsertData.email,
          dob: InsertData.dob,
          coverPhoto: "",
          profilePic: "",
          work: "",
          education: "",
          location: "",
        },
      },
      { upsert: true, new: true }
    );
    const Insert_User_Post_Model = await UserPostModel.updateOne(
      { user_id: InsertData._id },
      {
        $set: {
          user_name: InsertData.name,
          profilePic: "",
          posts: [],
        },
      },
      { upsert: true, new: true }
    );
    const Insert_User_Friends_Model = await userFriendsModel.updateOne(
      { user_id: InsertData._id },
      {
        user_name: InsertData.name,
        friends: [],
      },
      { upsert: true, new: true }
    );
    res.send(InsertData);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};

// ===========================Importent First When Login all Collection Create End==============

const FindLoginUser = async (req, res) => {
  const email = req.params.id;
  try {
    const FindEmail = await UserLoginDataModel.findOne({ email: email });
    if (FindEmail == null) {
      res.send({ status: null });
    } else {
      res.send({
        email: FindEmail.email,
        password: FindEmail.password,
        id: FindEmail._id,
      });
    }
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};
const FindLoginUserUsingId = async (req, res) => {
  const Id = req.params.id;
  try {
    const Data = await UserLoginDataModel.findOne({ _id: Id });

    res.send({
      name: Data.name,
      email: Data.email,
      dob: Data.dob,
    });
  } catch (err) {
    res.send(null);
    console.log(err);
  }
};
const OTP_Varify = async (req, res) => {
  const Email = req.params.id;
  const OTP = Random_OTP();
  if (validator.validate(Email)) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: false,
        auth: {
          user: "mandal4142@gmail.com",
          pass: "exxddazllzoribjb", // replace with app password if using 2FA
        },
      });

      const info = await transporter.sendMail({
        from: '"Pritam Mandal" <mandal4142@gmail.com>',
        to: Email,
        subject: "Your OTP",
        html: `<h1>Your OTP: ${OTP}</h1>`,
      });

      res.send({
        OTP: OTP,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: false,
        content: "Error sending email",
      });
    }
  } else {
    res.send({
      status: false,
      content: "Email is Not Valid",
    });
  }
};

const GoogleLoginInsertData_DB = async (req, res) => {
  const FindEmailOnDB = await UserLoginDataModel.findOne({
    email: Res_Google_UserData.email,
  });
  if (Res_Google_UserData.email == "") {
    res.send({ google_insert: false, email: "not", name: "" });
  } else if (FindEmailOnDB != null) {
    res.send({ google_insert: false, email: "", name: "" });
  } else {
    res.send({
      google_insert: true,
      email: Res_Google_UserData.email,
      name: Res_Google_UserData.name,
    });
  }
  Res_Google_UserData = { name: "", email: "" };
};

const Update_google_blank_password = async (req, res) => {
  const Email = req.body.email;
  // console.log(Email);

  const Password = req.body.password;
  const UpdatePassword = await UserLoginDataModel.updateOne(
    { email: Email },
    { $set: { password: Password } }
  );
  res.send(UpdatePassword);
};
export {
  NewsAPI,
  UserLogin,
  OTP_Varify,
  FindLoginUser,
  GoogleLoginInsertData_DB,
  Update_google_blank_password,
  passport,
  FindLoginUserUsingId,
};
