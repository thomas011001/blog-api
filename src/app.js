import "dotenv/config";
import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.route.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.use(globalErrorHandler);

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`)
);
