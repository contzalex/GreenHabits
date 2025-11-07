import React, { useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({
  name: "Jane Doe",
  username: "ecoJane",
  email: "jane@example.com",
  totalHabits: 42,
  ecoPoints: 850, // 🔹 punctele eco adăugate aici
  profilePicture: "", // inițial fără poză
});

  
  const firstName = user?.name?.split(" ")[0] || "Profile";
  const [newUsername, setNewUsername] = useState(user.username);
  const [newProfilePic, setNewProfilePic] = useState("");

  const handleSaveUsername = () => {
    setUser({ ...user, username: newUsername });
  };

  const handleUploadProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePicture: imageUrl });
    }
  };

  return (
    <main className="p-10 max-w-5xl mx-auto space-y-10">
       {/* 🔹 Text principal */}
<div className="text-center max-w-4xl mx-auto mt-16 mb-16">
  <h1 className="text-3xl md:text-5xl font-bold text-darkgreen mb-6 leading-tight">
    Congratulations! You currently have <span className="font-bold">{user?.ecoPoints || 0}</span> Eco Points 🌿
  </h1>
  
  
</div>
      {/* Card principal */}
      <section className="bg-[#DDE6D6] p-12 rounded-3xl shadow-xl border border-[#C9D7C3] h-[500px] flex">
        {/* Informații utilizator */}
        <div className="flex-1 flex flex-col justify-center space-y-4 text-lg">
          <h2 className="text-4xl font-semibold mb-4 text-[#2E4D32]">Profile</h2>
          <p className="text-[#2E4D32]">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-[#2E4D32]">
            <strong>Username:</strong> {user.username}
          </p>
          <p className="text-[#2E4D32]">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-[#2E4D32]">
            <strong>Total Habits Completed:</strong> {user.totalHabits}
          </p>
        
        </div>

        {/* Poză de profil centrată vertical */}
        <div className="flex-1 flex items-center justify-center">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-64 h-64 object-cover rounded-full shadow-lg opacity-90"
            />
          ) : (
            <div className="w-64 h-64 rounded-full bg-[#9BB597] flex items-center justify-center text-[#2E4D32] font-semibold opacity-50">
              No Image
            </div>
          )}
        </div>
      </section>

      {/* Card editare username + poză */}
      <section className="bg-[#DDE6D6] p-10 rounded-3xl shadow-lg border border-[#E2D9C9] space-y-6">
        <h3 className="text-2xl font-semibold text-[#2E4D32]">Edit Username</h3>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full sm:w-2/3 border border-[#9BB597] rounded-xl px-4 py-2 text-[#2E4D32] bg-white focus:outline-none focus:ring-2 focus:ring-[#B6CEB4]"
          />
          <button
            onClick={handleSaveUsername}
            className="bg-[#B6CEB4] hover:bg-[#A5C1A2] text-[#2E4D32] font-semibold px-6 py-2 rounded-xl shadow-md transition"
          >
            Save
          </button>
        </div>

        {/* Upload poză de profil */}
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-semibold text-[#2E4D32]">Edit Profile Picture</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadProfilePic}
            className="w-full sm:w-2/3 border border-[#9BB597] rounded-xl px-4 py-2 bg-white text-[#2E4D32] focus:outline-none focus:ring-2 focus:ring-[#B6CEB4]"
          />
        </div>
      </section>
    </main>
  );
}
