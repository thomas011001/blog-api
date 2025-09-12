import "dotenv/config";
import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.route.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.use(globalErrorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
