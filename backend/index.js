import express from "express";
import login from "./routes/authRoutes/login.js";
import signup from './routes/authRoutes/signup.js'
import logout from "./routes/authRoutes/logout.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import home from "./routes/home.js";
import answer from './routes/question-answer/answer.js';
import leaderBoard from './routes/question-answer/leaderBoard.js';
import question from './routes/question-answer/question.js'
import questionRoutes from './routes/question/questionRoutes.js'
dotenv.config();

const app = express();

app.use(cors( {origin:[ 'http://localhost:5173'],
  credentials: true,}));
  
app.use(express.json());



// MongoDB connection
const mongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
};

mongoDb();

// Use routes
app.use((req, res, next) => {
  req.url = req.url.trim(); 
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth",login);
app.use("/api/auth",signup);
app.use("/api/auth",home);
app.use("/api/auth",logout);
app.use("/api", leaderBoard);
app.use("/api", answer)
app.use("/api" ,questionRoutes)


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
