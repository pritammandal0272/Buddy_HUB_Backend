import { Strategy as OAuth2Strategy } from "passport-google-oauth20";
import passport from "passport";
import env from "dotenv";
env.config();
passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://buddy-hub-backend-85sk7kc4d-pritam-mandals-projects-73e03c4f.vercel.app/auth/google/callback",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
export default passport;
