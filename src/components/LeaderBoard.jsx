import { useEffect, useState } from "react";
import api from "../../utills/axios";
import { useSelector } from "react-redux";
const Leaderboard = () => {
    const { token, user } = useSelector((state) => state.user);
    
  const [leaderboard, setLeaderboard] = useState([]);

  // Function to fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const response = await api.get("/leaderboard",
       );
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Leaderboard
      </h2>
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Total Score</th>
            <th className="px-4 py-2">Correct Answers</th>
            <th className="px-4 py-2">Incorrect Answers</th>
            <th className="px-4 py-2">Pending Questions</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length > 0 ? (
            leaderboard.map((category) => (
              <tr key={category._id} className="border-t">
                <td className="px-4 py-2">{category._id}</td>
                <td className="px-4 py-2">{category.totalScore}</td>
                <td className="px-4 py-2">{category.correctAnswers}</td>
                <td className="px-4 py-2">{category.incorrectAnswers}</td>
                <td className="px-4 py-2">{category.pendingAnswers}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="px-4 py-2 text-center text-gray-500"
              >
                No leaderboard data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
