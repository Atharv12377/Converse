import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();
import authRouter from "./route/auth.route.js";
import messageRouter from "./route/message.route.js";

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

//this is the main file, we are also serving the frontend thru the backend while deploying, because we cannot deploy fronted and backend twice, we serve frontend thru backend and also serve backend. So we have only the backend to deploy

//Here we make it ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); //this here means that  when we are ready for deployment we use the dist folder that is the bundled frontend folder as static assets.
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
app.listen(PORT, () => {
  console.log("The server is running on port " + PORT);
});
