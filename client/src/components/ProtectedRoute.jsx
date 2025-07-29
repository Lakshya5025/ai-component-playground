import React from "react";
import { Navigate } from "react-router-dom";
import useAppStore from "../store/store";

const ProtectedRoute = ({ children }) => {
  const user = useAppStore((state) => state.user);
  console.log("4. ProtectedRoute is rendering. User is:", user);

  if (!user) {
    // If no user is logged in, redirect to the /login page
    return <Navigate to="/login" />;
  }

  // If a user is logged in, show the page they originally requested
  return children;
};

export default ProtectedRoute;
