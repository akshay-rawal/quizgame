import { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
function Home() {
  const [categories] = useState([
    "Cinema",
    "General Knowledge",
    "History",
    "Politics",
  ]);
  const navigate = useNavigate();
const {isDark} = useTheme();  
  const handleCategorySelect = (category) => {
    navigate(`/questions/${category}`); // Navigate to the category's questions
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <Navbar />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 "
            onClick={() => handleCategorySelect(category)}
          >
            <h2 className="text-xl font-bold mb-4 text-center dark:text-blue-400 text-blue-600">
              {category}
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Click to explore questions
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
