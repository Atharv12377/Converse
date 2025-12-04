import express from "express"
const authRouter = express.Router()
import { signup } from "../controller/auth.controller.js";

authRouter.post("/signup", signup)

export default authRouter