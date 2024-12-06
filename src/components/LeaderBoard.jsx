import { useEffect, useState } from 'react';
import api from '../../utills/axios';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    // Function to fetch leaderboard data from backend using axios
    const fetchLeaderboard = async () => {
        try {
            const response = await api.get('/leaderboard');  // Use the axios instance to send the GET request
            setLeaderboard(response.data.leaderboard);  // Update the state with the leaderboard data
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    useEffect(() => {
        fetchLeaderboard();  // Call the function to fetch leaderboard data when the component mounts
    }, []);

    return (
        <div>
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Total Score</th>
                        <th>Scores by Category</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.totalScore}</td>
                            <td>
                                {user.scoresByCategory.map((category) => (
                                    <div key={category.category}>
                                        {category.category}: {category.score} points, {category.totalAnswers} answers
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
