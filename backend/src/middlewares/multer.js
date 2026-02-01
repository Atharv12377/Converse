import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_images",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    
  }, //This storage is the multer configuration
});
export const upload = multer({ storage,
  limits: {fileSize: 5 * 1024 * 1024}
 }); //We pass it here. and then use this upload as a middleware in routes.

//FIle upload flow - configure cloudinary, then configure multer-storage-cloudinary. Then export this middleware and use it in the route. DONE.
