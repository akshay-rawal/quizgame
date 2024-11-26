import express from "express";
import Score from "../../models/scoreSchema.js";

const router = express.Router();

router.get("/leaderboard", async (req, res) => {
    
     try {
           // Fetch all scores for all categories
           const scores = await Score.find()
               .sort({ score: -1 }) 
               .populate("userId", "username") 
               .select("userId score category answers"); 

               if(scores.length===0){
                res.status(404).json({message:"no scores found"})
               }

               //prepare leaderboard data
                    const leaderboard =  scores.map((score)=>({
                        userId:score.userId.username,
                        score:score.score,
                        category:score.category,
                        answers:score.answers.map((answer)=>({
                              questionId:answer.questionId,
                              selectionOptions:answer.selectionOptions,
                              isCorrect:answer.isCorrect,
                        }))      
                     }))

               //return the leaderboard with scores for all categories
                 res.status(200).json({leaderboard})
                      
     } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
     }
    
});

export default router