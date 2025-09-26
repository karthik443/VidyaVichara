// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("role", role); // store user role
    navigate("/questions"); // go to question board
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to VidyaVichara</h1>

      <div className="bg-white p-6 rounded-lg shadow w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Select Your Role</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="student">👨‍🎓 Student</option>
          <option value="teacher">👨‍🏫 Teacher</option>
        </select>

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
