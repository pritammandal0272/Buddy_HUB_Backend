import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 } from "cloudinary";
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_SECRET_KEY,
  secure: true,
});
const storage = new CloudinaryStorage({
  cloudinary: v2,
  params: {
    folder: "Social_Media_Web_Data",
    public_id: (req, file) => Date.now() + "_" + file.originalname,
  },
});

const upload = multer({ storage: storage });

export default upload;
