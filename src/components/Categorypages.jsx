import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utills/axios";

function CategoryPage() {
  const { category } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [feedback, setFeedback] = useState({}); // State for feedback messages
  const [showAnswers, setShowAnswers] = useState({}); // State for showing correct answers

  // Function to fetch questions from the API
  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/questions/${category}`); // Fetch questions for the category
      if (response.data && response.data.questions) {
        setQuestions(response.data.questions); // Set questions if data exists
      } else {
        setQuestions([]); // No questions found
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions whenever the category changes
  useEffect(() => {
    fetchQuestions();
  }, [category]);

  // Handle submission of an answer
  const handleSubmit = (questionIndex, selectedOption) => {
    // Check if the question has already been submitted
    if (submittedAnswers[questionIndex]) {
      setFeedback((prevState) => ({
        ...prevState,
        [questionIndex]: "Second time not allowed",
      }));
      return;
    }

    // Check if the selected option is correct

    const isCorrect = questions[questionIndex].correctAnswer === selectedOption;
    // Update submittedAnswers and feedback
    setSubmittedAnswers((prevState) => ({
      ...prevState,
      [questionIndex]: selectedOption,
    }));

    setFeedback((prevState) => ({
      ...prevState,
      [questionIndex]: isCorrect ? "Successful" : "Unsuccessful",
    }));
  };

  // Handle showing or hiding the correct answer
  const handleShowAnswer = (questionIndex) => {
    setShowAnswers((prevState) => ({
      ...prevState,
      [questionIndex]: !prevState[questionIndex], // Toggle show/hide
    }));
  };

  // Render the component
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Questions for {category}
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500">Loading questions...</div>
      )}

      {/* Error State */}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Questions */}
      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Question Text */}
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {question.questionText}
              </h3>

              {/* Options in Two Columns */}
              <div className="grid grid-cols-2 gap-4">
                {question.options[0] &&
                  question.options[0].map((option, optionIndex) => {
                      const optionLabel = String.fromCharCode(65 + optionIndex); // Convert index to A, B, C, D
                      const isDisabled = submittedAnswers[index]; // Disable if already submitted
                    return (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="radio"
                          name={`question-${index}`} // Group radio buttons by question
                          id={`option-${index}-${optionIndex}`}
                          className="form-radio h-5 w-5 text-blue-600"
                          value={optionLabel} // Set value to A, B, C, D
                          disabled={isDisabled} // Disable if already submitted
                        />
                        <label
                          htmlFor={`option-${index}-${optionIndex}`}
                          className={`text-gray-700 ${
                            isDisabled ? "opacity-50" : ""
                          }`}
                        >
                          {optionLabel}. {option}
                        </label>
                      </div>
                    );
                  })}
              </div>

              {/* Submit Button */}
              <button
                onClick={() => {
                  const selectedOption = document.querySelector(
                    `input[name="question-${index}"]:checked`
                  )?.value;
                  if (selectedOption) {
                    handleSubmit(index, selectedOption); // Handle submission
                  } else {
                    alert("Please select an option before submitting!");
                  }
                }}
                className={`mt-4 px-4 py-2 text-white rounded ${
                  submittedAnswers[index]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={submittedAnswers[index]} // Disable button if already submitted
              >
                Submit
              </button>

              {/* Show/Hide Correct Answer Button */}
              <button
                onClick={() => handleShowAnswer(index)}
                className="ml-4 px-4 py-2 text-blue-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                {showAnswers[index] ? "Hide Answer" : "Show Answer"}
              </button>

              {/* Feedback Message */}
              {feedback[index] && (
                <div
                  className={`mt-2 font-semibold ${
                    feedback[index] === "Successful"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {feedback[index]}
                </div>
              )}

              {/* Correct Answer Display */}
              {showAnswers[index] && (
                <div className="mt-2 text-gray-700">
                  <strong>Correct Answer:</strong> {question.correctAnswer}.
                  {
                    question.options[0][
                      question.correctAnswer.charCodeAt(0) - 65
                    ]
                  }
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No questions available for this category.
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
