import React from "react";
import AuthForm from "../components/AuthForm";
import "./AuthPage.css"; // We'll create this new CSS file

const LoginPage = () => {
  return (
    <div>
      <h1>Welcome to the AI Playground 🎨</h1>
      <AuthForm />
    </div>
  );
};

export default LoginPage;
