import express from "express"
const authRouter = express.Router()
import { signup, verify, login, logout} from "../controller/auth.controller.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

authRouter.post("/signup",signup)
authRouter.post("/verify", verify)
authRouter.post("/login", login)
authRouter.get("/logout", logout)
export default authRouter