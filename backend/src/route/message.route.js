import express, { Router } from "express"

const messageRouter = express.Router()

messageRouter.get("/send", (req,res)=>{
    res.send("Send message Endpoint");
})

export default messageRouter






