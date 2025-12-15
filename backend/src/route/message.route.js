import express, { Router } from "express"
import { Auth } from "../middlewares/auth.js"
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
import { getAllChats, SearchPeople, createConversation, getMessages } from "../controller/message.controller.js";
import { upload } from "../middlewares/multer.js";
const messageRouter = express.Router()

messageRouter.get("/chats",Auth,getAllChats);
messageRouter.get("/search",Auth, SearchPeople);
messageRouter.post("/createConversation",Auth, createConversation)
messageRouter.get("/getMessages/:conversationId",Auth, getMessages)
messageRouter.post("/send/:conversationId",Auth,upload.single("image"), sendMessage)

export default messageRouter






