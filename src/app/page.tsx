"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api"
import "./globals.css"
export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isSignUp ? "/auth/signup" : "/auth/login";

    try {
      const response = await api.post(endpoint, { username, password });
      if (!isSignUp) {
        // Save JWT token for login
        localStorage.setItem("jwt", response.data.token);
        router.push("/todos");
      } else {
        alert("User registered! Please log in.");
        setIsSignUp(false);
      }
    } catch (error: any) {
      alert(error.response?.data || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">{isSignUp ? "Sign Up" : "Log In"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 mt-4"
        >
          {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}