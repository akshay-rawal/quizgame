import express from "express";
import Score from "../../models/scoreSchema.js";
const router = express.Router()
import authenticate from "../../middleware/authenticate.js";

      export const getLeaderboard = async (req, res) => {
            try {
                if (!req.user || !req.user.userId) {
                    return res.status(401).json({ message: "User not authenticated." });
                }
        
                const authenticatedUserId = req.user.userId;
        
                const userScores = await Score.aggregate([
                    { $match: { userId: authenticatedUserId } },
                    {
                        $group: {
                            _id: "$userId",
                            totalScore: { $sum: "$score" },
                            scoresByCategory: {
                                $push: {
                                    category: "$category",
                                    score: "$score",
                                    totalAnswers: { $size: "$answeredQuestions" },
                                },
                            },
                        },
                    },
                    { $sort: { totalScore: -1 } },
                ]);
        
                if (!userScores.length) {
                    return res.status(404).json({ message: "No scores found for this user." });
                }
        
                return res.status(200).json({ leaderboard: userScores });
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                return res.status(500).json({ message: "Error fetching leaderboard." });
            }
        };

router.get("/leaderboard", authenticate, getLeaderboard);
