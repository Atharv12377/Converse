import express, { Router } from "express"
import { Auth } from "../middlewares/auth.js"
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const messageRouter = express.Router()

messageRouter.get("/send",arcjetProtection, (req,res)=>{
    res.send("Send message Endpoint");
})

export default messageRouter






