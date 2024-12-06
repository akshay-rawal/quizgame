  import express from "express";
  import login from "./routes/authRoutes/login.js";
  import signup from './routes/authRoutes/signup.js'
  import logout from "./routes/authRoutes/logout.js";
  import mongoose from "mongoose";
  import dotenv from "dotenv";
  import cors from "cors";
  import home from "./routes/home.js";
  import answer from './routes/question-answer/answer.js';
  import userScore from './routes/userScore.js'
  import questionRoutes from './routes/question/questionRoutes.js'
  import submitAnswerRoutes from './routes/submitAnswerRoutes.js'
  import sessionRoutes from './routes/authRoutes/sessionRoutes.js'
  import bodyParser from "body-parser";
  dotenv.config();

  const app = express();

  app.use(cors( {origin:[ 'http://localhost:5173'],
    credentials: true,}));
    
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true })); 


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
  app.use('/api',sessionRoutes)
  app.use("/api/auth",logout);
  app.use("/api", answer)
  app.use("/api" ,questionRoutes)
  app.use('/api',userScore)
  app.use('/api',submitAnswerRoutes)

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
