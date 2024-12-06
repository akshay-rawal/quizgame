import express from 'express';
import { insertQuestions } from './insertQuestions.js';
import Question from '../../models/questionSchema.js'; // Assuming the Question model is here
import Score from '../../models/scoreSchema.js';
import authenticate from '../../middleware/authenticate.js';
const router = express.Router();

// Route to trigger the insertion of a question (for testing purposes)
router.get('/insert-questions', async (req, res) => {
  try {
    await insertQuestions(); // Insert predefined question
    res.status(200).send('Question inserted successfully!');
  } catch (error) {
    res.status(500).send('Failed to insert question: ' + error.message);
  }
});


// Route to get questions by category (e.g., 'Cinema')
router.get("/questions/:category/:userId",authenticate, async (req, res) => {
  const { category,userId} = req.params;
  console.log("User ID from token:", req.userId);
  console.log("Requested User ID:", userId);
  console.log("Category requested:", category);
  

  if (req.userId !== userId) {
    return res.status(403).json({ message: "You are not authorized to access these questions." });
  }

  console.log("Category requested:", category, "UserId:", userId);

  

  try {
    const questions = await Question.find({ category });
    console.log("Questions found:", questions);
    const userScore = await Score.findOne({ category, userId });

    const answeredQuestionIds = userScore
      ? userScore.answers.map((answer) => answer.questionId.toString())
      : [];

    const unansweredQuestions = questions.filter(
      (q) => !answeredQuestionIds.includes(q._id.toString())
    );

    return res.status(200).json({ questions: unansweredQuestions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Error fetching questions from the database." });
  }
}); 

export default router;