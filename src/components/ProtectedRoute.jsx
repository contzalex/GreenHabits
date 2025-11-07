import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-darkgreen text-2xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center text-[#255938]">
        <h2 className="text-2xl font-bold mb-4">
          You must be logged in to view this page.
        </h2>
        <Login />
      </div>
    );
  }

  return children;
}