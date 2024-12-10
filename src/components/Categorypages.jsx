import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utills/axios";
import { useSelector } from "react-redux";

function CategoryPage() {
  const { token, user } = useSelector((state) => state.user);
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});
const [currentPage,setCurrentPage] = useState(1);
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

      const questionsResponse = await api.get(
        `/questions/${category}/${user.userId}`
        
      )
      console.log(questionsResponse.data); // Check the structure here

      if (questionsResponse.data && questionsResponse.data.questions) {
        // Handle the questions data here
        setQuestions(questionsResponse.data.questions);
        setPendingQuestions(questionsResponse.data.pendingAnswerCount);
      } else {
        setError("Failed to load questions.");
      }
      // Fetch user score and progress
      const scoreResponse = await api.get(
        `/user-score/${user.userId}/${category}`
      );
      console.log("Fetched score:", scoreResponse.data);
         console.log("Fetched score:", scoreResponse.data);

      if (scoreResponse.data.userScore) {
        const {
          score,
          correctAnswer,
          inCorrectAnswer,
          answeredQuestions,
          pendingAnswer,
          totalQuestions,
        } = scoreResponse.data.userScore;
       


        setScore(score || 0);
        setCorrectAnswers(correctAnswer || []);
        setIncorrectAnswers(inCorrectAnswer || []);
        setPendingQuestions(pendingAnswer.length || []);
        console.log("Updated Pending Questions in state:", pendingQuestions);
        setAnsweredQuestions(answeredQuestions || []);

        const feedbackMap = {};
        scoreResponse.data.userScore.answers.forEach((ans) => {
          feedbackMap[ans.questionId] = ans.isCorrect
            ? "Correct answer!"
            : "Incorrect answer.";
        });
        setFeedback(feedbackMap);
      }
    } catch (error) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const questionPage = 5;
   const indexOfLastQuestion = currentPage * questionPage;
   const indexOfFirstQuestion =  indexOfLastQuestion - questionPage;
  const currentQuestions =  questions.slice(indexOfFirstQuestion, indexOfLastQuestion); 
  
  const nextPage = ()=>{
    if(currentPage< Math.ceil(questions.length/questionPage))
    {
      setCurrentPage((prevPage)=>prevPage+1);
    }
  }

  const prevPage = ()=>{
    if (currentPage>1) {
      setCurrentPage((prevPage)=>prevPage-1)
      
    }
  }

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
      return;
    }

    try {
      const response = await api.post("/submit", {
        userId: user.userId,
        questionId,
        selectedOption,
      });

      const { isCorrect, updatedScore, feedbackMessage,  pendingQuestions,  pendingAnswerCount, totalQuestions} = response.data;
      console.log("Pending Questions:", pendingQuestions);
      console.log("Total Questions:", totalQuestions);

      setFeedback((prev) => ({
        ...prev,
        [questionId]: feedbackMessage,
      }));

      setSubmittedAnswers((prev) => ({
        ...prev,
        [questionId]: selectedOption,
      }));
      setScore(updatedScore);

      setCorrectAnswers((prev)=>isCorrect?[...prev,questionId]:prev)
      setIncorrectAnswers((prev) =>
        !isCorrect ? [...prev, questionId] : prev
      );

     setPendingQuestions(pendingQuestions)

      //update the question to mark its answerd
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q } : q))
      );
    } catch (error) {
      setFeedback((prev) => ({
        ...prev,
        [questionId]: "There was an error submitting your answer.",
      }));
    }
  };

  const handleShowAnswer = (questionIndex) => {
    setShowAnswers((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
  };

  return (
    <>
      <div className="p-6 min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Questions for {category}
        </h2>

        {loading && (
          <div className="text-center text-gray-500">Loading questions...</div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}

        <div className="space-y-6">
          {questions.length > 0 ? (
            currentQuestions.map((question, index) => {
              const isAnswered = answeredQuestions.includes(question._id);
              return(
              <div
                key={question._id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold mb-4">
                  {question.questionText}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {question.options[0].map((option, i) => {
                    const optionLabel = String.fromCharCode(65 + i); //generate A B C D

                    return (
                      <div key={i} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          id={`option-${index}-${i}`}
                          value={optionLabel}
                          disabled={isAnswered}
                          onChange={(e) => {
                            const selectedOption = e.target.value;
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [question._id]: selectedOption,
                            }));
                          }}
                          className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`option-${index}-${i}`}
                          className="ml-2"
                        >
                          {optionLabel}. {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    const selectedOption = selectedAnswers[question._id];
                    if (selectedOption) {
                      handleSubmit(index, selectedOption);
                    } else {
                      alert("please select a option before submit");
                    }
                  }}
                  className={`mt-4 px-4 py-2 rounded ${
                    question.isAnswered
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed" // Styled as disabled
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  disabled={isAnswered}
                >
                  Submit
                </button>

                <button
                  onClick={() => handleShowAnswer(index)}
                  className={`ml-4 px-4 py-2 rounded ${
                    isAnswered
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                  disabled={submittedAnswers[question._id]}
                >
                  {showAnswers[index] ? "Hide Answer" : "Show Answer"}
                </button>
                <span className="ml-4 text-blue-600 font-medium">
                  {feedback[question._id]}
                </span>

                {showAnswers[index] && (
                  <div className="mt-2">
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </div>
                )}
              </div>
              )
            })
          ) : (
            <div className="text-center text-gray-500">
              No questions available for this category.
            </div>
          )}
        </div>
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
          onClick={prevPage}
          disabled={currentPage===1}
          
          className="px-6 py-2 bg-gray-300 rounded disabled:opacity-50">

            prev...
          </button>
          <p>
          Page {currentPage} of {Math.ceil(questions.length / questionPage)}
          </p>
          <button
          onClick={nextPage}
          disabled={currentPage>= Math.ceil(questions.length/questionPage)}
          
          className="px-6 py-2 bg-gray-300 rounded disabled:opacity-50">

           next
          </button>

        </div>
        <div className="mt-12">
          <h3 className="text-lg font-bold">Your Score</h3>
          <p>Your score: {score}</p>
          <p>Correct answers: {correctAnswers.length}</p>
          <p>Incorrect answers: {incorrectAnswers.length}</p>
          <p>Pending questions: {pendingQuestions}</p>
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
