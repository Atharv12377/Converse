import express, { Router } from "express"
import { Auth } from "../middlewares/auth.js"
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
import { getAllChats, SearchPeople, createConversation } from "../controller/message.controller.js";
const messageRouter = express.Router()

messageRouter.get("/chats",Auth,getAllChats);
messageRouter.get("/search",Auth, SearchPeople);
messageRouter.post("/createConversation",Auth, createConversation)
// messageRouter.get("/messages/:conversationId", getMessageByUserId)
// messageRouter.post("/send/:conversationId", sendMessage)

export default messageRouter






