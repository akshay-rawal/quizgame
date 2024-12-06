import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utills/axios";
import { useSelector } from "react-redux";

function CategoryPage() {
  const { token, user } = useSelector((state) => state.user);
  const { category } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  // Function moved above useEffect for better readability
  const fetchData = async () => {
    console.log("fetchData called");

    try {
      setLoading(true);
      console.log("Fetching questions...");


      // Fetch unanswered questions
      console.log("Token in use:", token);


      console.log("API Request URL:", `/questions/${category}/${user.userId}`);



     const questionsResponse = await api.get(`/questions/${category}/${user.userId}`, 
     
);
setQuestions(questionsResponse.data);

      console.log("Fetched questions:", questionsResponse.data);

      // Fetch user score and progress
      const scoreResponse = await api.get(`/user-score/${user.userId}/${category}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched score:", scoreResponse.data);
      const categoryQuestions = questionsResponse.data.questions || [];

      setQuestions(categoryQuestions);
      if (scoreResponse.data.userScore) {
        const {
          score,
          correctAnswer,
          inCorrectAnswer,
          answeredQuestions,
          pendingAnswer,
        } = scoreResponse.data.userScore;

        setScore(score || 0);
        setCorrectAnswers(correctAnswer || []);
        setIncorrectAnswers(inCorrectAnswer || []);
        setPendingQuestions(pendingAnswer || []);
        setAnsweredQuestions(answeredQuestions || []);
      }
    } catch (error) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      console.log("token is missing");
      navigate("/"); // Redirect if not authenticated
    } else {
      fetchData();
    }
  }, [category, user, token, navigate]);

  const handleSubmit = async (questionIndex, selectedOption) => {
    const questionId = questions[questionIndex]._id;
    if (submittedAnswers[questionId]) {
      setFeedback((prev) => ({
        ...prev,
        [questionId]: "You have already submitted an answer for this question.",
      }));
      return;
    }

    try {
      const response = await api.post("/submit", {
        userId: user.userId,
        questionId,
        selectedOption,
      });

      const { isCorrect } = response.data;
      setFeedback((prev) => ({
        ...prev,
        [questionId]: isCorrect ? "Correct answer!" : "Incorrect answer.",
      }));

      setSubmittedAnswers((prev) => ({
        ...prev,
        [questionId]: selectedOption,
      }));

      // Refresh data to update score and answered status
      fetchData();
    } catch (error) {
      setFeedback((prev) => ({
        ...prev,
        [questionId]: "Failed to submit answer.",
      }));
      console.error("Error submitting answer:", error);
    }
  };

  const handleShowAnswer = (questionIndex) => {
    setShowAnswers((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Questions for {category}
      </h2>

      {loading && <div className="text-center text-gray-500">Loading questions...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div key={question._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">{question.questionText}</h3>
              <div className="grid grid-cols-2 gap-4">
                {(question.options || []).map((option, i) => {
                  const optionLabel = String.fromCharCode(65 + i);
                  return (
                    <div key={i} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        id={`option-${index}-${i}`}
                        value={optionLabel}
                        onChange={(e) => handleSubmit(question._id, e.target.value)}
                        disabled={answeredQuestions.includes(question._id)}
                      />
                      <label htmlFor={`option-${index}-${i}`} className="ml-2">
                        {optionLabel}. {option}
                      </label>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  const selectedOption = document.querySelector(
                    `input[name="question-${index}"]:checked`
                  )?.value;
                  if (selectedOption) {
                    handleSubmit(index, selectedOption);
                  } else {
                    alert("Please select an option before submitting.");
                  }
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={answeredQuestions.includes(question._id)}
              >
                Submit
              </button>

              <button
                onClick={() => handleShowAnswer(index)}
                className="ml-4 px-4 py-2 bg-gray-200 rounded"
              >
                {showAnswers[index] ? "Hide Answer" : "Show Answer"}
              </button>

              {showAnswers[index] && (
                <div className="mt-2">
                  <strong>Correct Answer:</strong> {question.correctAnswer}
                </div>
              )}

              {feedback[question._id] && (
                <div className="mt-2 text-green-600">{feedback[question._id]}</div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No questions available for this category.
          </div>
        )}
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-bold">Your Score</h3>
        <p>Your score: {score}</p>
        <p>Correct answers: {correctAnswers.length}</p>
        <p>Incorrect answers: {incorrectAnswers.length}</p>
        <p>Pending questions: {pendingQuestions.length}</p>
      </div>
    </div>
  );
}

export default CategoryPage;
