import express, { Router } from "express"
import { Auth } from "../middlewares/auth.js"

const messageRouter = express.Router()

messageRouter.get("/send",Auth, (req,res)=>{
    res.send("Send message Endpoint");
})

export default messageRouter






