import Question from "../models/questionSchema.js";
import Score from "../models/scoreSchema.js";
import express from "express";

const router = express.Router();

export const submitAnswerRoutes = async (req, res) => {
  try {
    const { userId, questionId, selectedOption } = req.body;

    // Check if the required fields are provided
    if (!userId || !questionId || !selectedOption) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch the question from the database
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    console.log("Category from request body:", question.category);

    // Check if the answer is correct
    const isCorrect = question.correctAnswer === selectedOption;

    // Fetch or create the user's score record
    console.log("Searching for userScore with userId:", userId, "and category:", question.category);

    let userScore = await Score.findOne({ userId, category: question.category });

    if (!userScore) {
      // If no userScore exists, initialize it
      console.log("userScore is null or undefined. Proceeding to fetch questions...");

      const questions = await Question.find({ category: question.category });
      console.log("Questions fetched:", questions);
      const questionIds = questions.map((q) => q._id);

      if (questionIds.length === 0) {
        console.log("No questions found for this category.");
        return res.status(404).json({ message: "No questions found for this category." });
      }

      // Initialize userScore with all the questions in the category
      userScore = new Score({
        userId,
        category: question.category,
        score: 0,
        correctAnswer: [],
        inCorrectAnswer: [],
        pendingAnswer: questionIds, // Initialize pendingAnswer with all questions
        answeredQuestions: [],
        answers: [],
      });
      console.log("PendingAnswer Initialized:", userScore.pendingAnswer);
      await userScore.save();
    } else if (userScore.pendingAnswer.length === 0) {
      // Re-populate pendingAnswer if it is empty
      const questions = await Question.find({ category: question.category });
      const questionIds = questions.map((q) => q._id);
    
      console.log("Re-populating pendingAnswer with questions:", questionIds);
      userScore.pendingAnswer = questionIds; // Re-assign the new question IDs to pendingAnswer
      await userScore.save();
    }

    // Ensure fields are initialized if missing
    userScore.correctAnswer = userScore.correctAnswer || [];
    userScore.inCorrectAnswer = userScore.inCorrectAnswer || [];
    userScore.pendingAnswer = userScore.pendingAnswer || [];
    userScore.answeredQuestions = userScore.answeredQuestions || [];
    userScore.answers = userScore.answers || [];

    console.log("PendingAnswer Before:", userScore.pendingAnswer);

    // Filter out the answered question from pendingAnswer
    if (userScore.pendingAnswer.includes(questionId)) {
      userScore.pendingAnswer = userScore.pendingAnswer.filter(
        (id) => id.toString() !== questionId.toString()
      );
      await userScore.save();
      console.log("UserScore saved with updated pendingAnswer:", userScore.pendingAnswer);
    }

    console.log("PendingAnswer After Filter:", userScore.pendingAnswer);

    // Update the score and track the question as answered
    if (isCorrect) {
      userScore.score += 2;
      userScore.correctAnswer.push(questionId);
    } else {
      userScore.inCorrectAnswer.push(questionId);
    }

    userScore.answeredQuestions.push(questionId); // Mark as answered
    userScore.answers.push({
      questionId,
      selectedOption,
      isCorrect,
      category: question.category,
    });

    // Save the updated user score
    await userScore.save();

    return res.status(200).json({
      message: "Answer submitted successfully.",
      isCorrect,
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return res.status(500).json({ message: "Error submitting answer." });
  }
};

router.post("/submit", submitAnswerRoutes);

export default router;
