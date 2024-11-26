import express from 'express';
import { insertQuestion } from './insertQuestions.js';
import Question from '../../models/questionSchema.js'; // Assuming the Question model is here
const router = express.Router();

// Route to trigger the insertion of a question (for testing purposes)
router.get('/insert-question', async (req, res) => {
  try {
    await insertQuestion(); // Insert predefined question
    res.status(200).send('Question inserted successfully!');
  } catch (error) {
    res.status(500).send('Failed to insert question: ' + error.message);
  }
});

// Route to get questions by category (e.g., 'Cinema')
router.get("/questions/:category", async (req, res) => {
  const { category } = req.params;

  console.log("Category requested:", category);

  if (!["Cinema", "General Knowledge", "History", "Politics"].includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    const questions = await Question.find({ category });

    if (questions.length > 0) {
      console.log("Questions found:", questions);
      return res.status(200).json({ questions });
    }

    console.log("No questions found for category:", category);
    return res.status(404).json({ message: "No questions found for this category." });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Error fetching questions from the database." });
  }
});



export default router;
