// src/components/Header.jsx
export default function Header({ isLoggedIn, handleLogout, toggleLoginState }) {
  return (
    <header className="bg-[#2d5016] text-white p-6 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">GreenHabits 🌱</h1>
          <p className="mt-1 text-[#b8cec1]">Track your eco-friendly habits daily!</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleLoginState}
            className="bg-[#d4927e] text-[#2d5016] px-4 py-2 rounded hover:opacity-90 transition font-bold"
          >
            TEST: {isLoggedIn ? 'Logged In ✓' : 'Logged Out ✗'}
          </button>
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="bg-[#d4927e] text-[#2d5016] px-4 py-2 rounded hover:opacity-90 transition font-bold"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
