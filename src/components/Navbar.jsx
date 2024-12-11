import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/store.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';

function Navbar() {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav
            className={`p-4 flex justify-between items-center ${
                isDark ? 'bg-gray-900 text-white' : 'bg-blue-500 text-black'
            }`}
        >
            <div>
                <Link to="/leaderboard" className="mr-4 hover:underline">
                    Leaderboard
                </Link>

                {user && (
                    <button
                        onClick={handleLogout}
                        className="hover:underline"
                    >
                        Logout
                    </button>
                )}
            </div>
            <div className="flex items-center">
                <span className="mr-4">{user?.username}</span>
                <button
                    onClick={toggleTheme}
                    className="py-2 px-4 rounded-md focus:outline-none bg-white text-black dark:bg-gray-800 dark:text-white"

                >
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
