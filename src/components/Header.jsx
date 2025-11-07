import React, { useState } from "react";
import logo from "../assets/logo-green-habits.png";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../pages/authService";
import logoutIcon from "../assets/logout-icon.png";

export default function Header() {
  const { user } = useAuth() || {};
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLoginState = () => setIsLoggedIn((prev) => !prev);
  const handleLogout = () => {
    if (user) logoutUser();
    else setIsLoggedIn(false);
  };

  const fallbackUser = {
    name: "Larisa-Diana",
    email: "larisa@example.com",
  };

  const effectiveUser = user || (isLoggedIn ? fallbackUser : null);
  const loggedIn = !!effectiveUser;
  const firstName = effectiveUser?.name?.split(" ")[0] || "Profile";

  return (
    <header className="bg-[#255938] text-[#F5EFE6] py-2 px-4 shadow-md relative">
      <div className="grid grid-cols-3 items-center w-full">
        {/* Logo stânga */}
        <div className="justify-self-start">
          <img
            src={logo}
            alt="Green Habits Logo"
            style={{ width: "400px", height: "auto" }}
          />
        </div>

        {/* Mesaj central */}
        <div className="justify-self-center">
          <span
            className="text-2xl font-bold tracking-wide text-center"
            style={{
              color: "beige",
              fontFamily: "Arial Black, Arial, Impact, sans-serif",
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            Track your eco-friendly habits daily!
          </span>
        </div>

        {/* Butoane dreapta */}
        <div className="flex gap-3 justify-self-end">
          {/* Container TEST */}
          {!user && (
            <div className="bg-[#F5EFE6] rounded px-2 py-1">
              <button
                onClick={toggleLoginState}
                className="bg-transparent text-[#2d5016] font-bold text-sm hover:opacity-90 transition"
              >
                TEST: {isLoggedIn ? "Logged In" : "Logged Out"}
              </button>
            </div>
          )}

          {/* Container Prenume */}
          {loggedIn && (
            <div className="bg-[#F5EFE6] rounded px-2 py-1">
              <button
                onClick={() => window.location.href = "/profile"}
                className="bg-transparent text-[#2d5016] font-bold text-sm hover:opacity-90 transition"
              >
                {firstName}
              </button>
            </div>
          )}

          {/* Container Logout */}
          {loggedIn && (
            <div className="bg-[#F5EFE6] rounded px-2 py-1 flex items-center justify-center">
              <button
  onClick={handleLogout}
  className="bg-transparent p-0 hover:bg-opacity-50 transition"
>
  <img
    src={logoutIcon}
    alt="Logout"
    className="w-6 h-6"
  />
</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
