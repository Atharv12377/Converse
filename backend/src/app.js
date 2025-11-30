import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app  = express()
const PORT = process.env.PORT
import authRouter from "./route/auth.route.js"
import messageRouter from "./route/message.route.js"

app.use("/api/auth", authRouter)
app.use("/api/messages", messageRouter)





app.listen(PORT, ()=>{
    console.log("The server is running on port "+ PORT)
})
  