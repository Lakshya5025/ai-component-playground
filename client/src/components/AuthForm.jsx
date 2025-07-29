import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase"; // <-- ADD THIS: Import the initialized auth object

const AuthForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("1. Attempting to sign in..."); // <-- ADD THIS

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("2. Sign-in with Firebase was successful."); // <-- ADD THIS

        // Login successful, we will handle redirect in the next step
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("2. Sign-up with Firebase was successful."); // <-- ADD THIS

        // Signup successful, we will handle redirect in the next step
      }
    } catch (err) {
      setError(err.message); // Set error from Firebase
      console.error("Firebase Auth Error:", err.message); // <-- ADD THIS
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : isLoginMode ? "Login" : "Sign Up"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={() => setIsLoginMode(!isLoginMode)}>
        Switch to {isLoginMode ? "Sign Up" : "Login"}
      </button>
    </div>
  );
};

export default AuthForm;
