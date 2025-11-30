import express from "express"
const authRouter = express.Router()


authRouter.get("/login",(req,res)=>{
    res.send("This is the login route");
})

export default authRouter