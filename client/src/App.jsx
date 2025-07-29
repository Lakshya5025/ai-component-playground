import React, { useEffect } from "react";
// Make sure useNavigate is imported
import { Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import useAppStore from "./store/store";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, setUser, clearState } = useAppStore();
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ uid: user.uid, email: user.email });
        // 👇 ADD THIS LINE to navigate to the dashboard after login
        navigate("/");
      } else {
        clearState();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
