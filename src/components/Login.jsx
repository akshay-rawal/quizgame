import { useState } from "react";
import { useDispatch } from "react-redux";
import {login} from '../store/store.js'
import { useNavigate } from "react-router-dom";
import api from "../../utills/axios.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    event.preventDefault(); 
    try {
      
      const response = await api.post("/auth/login",
        {
          password,
          email,
        }
      );
      if (response.data.user && response.data.token)

      dispatch(login({ user: response.data.user, token: response.data.token }));
      navigate("/home");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className='space-y-4' autoComplete="off">
        <input
          type="email"
          placeholder="email.."
          className="w-full p-2 border
       border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{""}
          <a href="/signup" className="text-blue-500 hover:underline">
            Signup
          </a>
        </p>
        </form>
      </div>
    </div>
  );
}
export default Login;