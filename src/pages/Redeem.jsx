import React, { useState } from "react";

const origRewards = [
  // Transportation
  {
    name: "1 Month Gym Membership",
    description: "Enjoy unlimited gym access for a month.",
    points: 1000,
    icon: "🏋️",
    category: "health",
  },
  {
    name: "100 Ron Lidl Gift Card",
    description: "Perfect for your next grocery shopping trip.",
    points: 600,
    icon: "🛒",
    category: "giftcards",
  },
  {
    name: "Reusable Water Bottle",
    description: "Stay hydrated and reduce single-use plastic.",
    points: 350,
    icon: "🚰",
    category: "eco",
  },
  {
    name: "Plant a Tree Certificate",
    description: "We plant a tree in your name.",
    points: 500,
    icon: "🌳",
    category: "eco",
  },
  {
    name: "Energy Saving LED Bulb",
    description: "Brighten your home efficiently.",
    points: 200,
    icon: "💡",
    category: "gadgets",
  },
  {
    name: "Bus 1-Day Pass",
    description: "Enjoy unlimited local bus rides for 24 hours.",
    points: 150,
    icon: "🚌",
    category: "transportation",
  },
  // More added rewards:
  { name: "Organic Snack Pack", description: "Healthy treats for you.", points: 250, icon: "🥗", category: "food" },
  { name: "Eco Shopping Bag", description: "Reusable bag for all your needs.", points: 80, icon: "🛍️", category: "eco" },
  { name: "200 Ron eMag Gift Card", description: "Shop electronics, gadgets & more.", points: 1200, icon: "💳", category: "giftcards" },
  { name: "E-Book Voucher", description: "For digital learning resources.", points: 400, icon: "📚", category: "giftcards" },
  { name: "Pair of Socks", description: "Comfortable, eco cotton socks.", points: 70, icon: "🧦", category: "clothing" },
  { name: "Hand Sanitizer Gel", description: "Stay safe on the go.", points: 30, icon: "🧴", category: "health" },
  { name: "Local Coffee Giftcard", description: "Enjoy a coffee in the city.", points: 150, icon: "☕", category: "giftcards" },
  { name: "Bike Repair Kit", description: "Be ready for your next ride.", points: 350, icon: "🚴", category: "gadgets" },
  { name: "Bus 7-Day Pass", description: "A full week of unlimited rides.", points: 900, icon: "🚌", category: "transportation" },
];

const categoryLabels = {
  giftcards: "Giftcards",
  transportation: "Transportation",
  health: "Health",
  eco: "Eco",
  gadgets: "Gadgets",
  clothing: "Clothing",
  food: "Food",
};

const pageSize = 12;

export default function Redeem() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' or 'asc'
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering
  const filteredRewards =
    selectedCategory === "all"
      ? origRewards
      : origRewards.filter(r => r.category === selectedCategory);

  // Sorting
  const sortedRewards = [...filteredRewards].sort((a, b) =>
    sortOrder === "asc" ? a.points - b.points : b.points - a.points
  );

  // Pagination
  const totalPages = Math.ceil(sortedRewards.length / pageSize);
  const displayRewards = sortedRewards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Options for select
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
  ];

  return (
    <main
      className="p-6 min-h-screen"
      style={{ backgroundColor: "var(--color-fundal)" }}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4" style={{ color: "var(--color-darkgreen)" }}>
          Redeem Rewards <span className="text-xl">🎁</span>
        </h2>
        {/* Filter + Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-3">
          {/* Category */}
          <div className="w-full md:w-auto">
            <select
              className="bg-bigbox border border-smallbox rounded-lg px-4 py-2 text-darkgreen font-semibold"
              style={{
                backgroundColor: "var(--color-bigbox)",
                borderColor: "var(--color-smallbox)",
                color: "var(--color-darkgreen)",
              }}
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* Sort */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <label className="text-md font-semibold" style={{ color: "var(--color-darkgreen)" }}>Sort by points:</label>
            <button
              className="ml-1 px-4 py-2 rounded-lg border border-darkgreen bg-beige font-bold transition hover:bg-smallbox"
              style={{
                backgroundColor: "var(--color-beige)",
                borderColor: "var(--color-darkgreen)",
                color: "var(--color-darkgreen)",
              }}
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            >
              {sortOrder === "desc" ? "Highest → Lowest" : "Lowest → Highest"}
            </button>
          </div>
        </div>
        {/* The Cards Grid */}
        <section
          className="bg-bigbox rounded-2xl shadow-md p-6 border border-smallbox"
          style={{ backgroundColor: "var(--color-bigbox)", borderColor: "var(--color-smallbox)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRewards.map((reward, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between bg-earth border border-smallbox rounded-xl shadow-sm p-5 transition hover:scale-[1.025] hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-earth)",
                  borderColor: "var(--color-smallbox)",
                  color: "var(--color-darkgreen)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{reward.icon}</span>
                  <span className="text-lg font-semibold">{reward.name}</span>
                </div>
                <div className="text-sm mb-4" style={{ color: "var(--color-darkgreen)" }}>
                  {reward.description}
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-base font-bold" style={{ color: "var(--color-darkgreen)" }}>
                    {reward.points} points
                  </span>
                  <button
                    className="bg-darkgreen text-fundal px-4 py-2 rounded-lg font-semibold border border-darkgreen transition hover:opacity-90"
                    style={{
                      backgroundColor: "var(--color-darkgreen)",
                      borderColor: "var(--color-darkgreen)",
                      color: "var(--color-fundal)",
                    }}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-8 w-full">
    <button
      className="px-3 py-1 rounded border font-semibold"
      style={{ backgroundColor: "var(--color-beige)", borderColor: "var(--color-darkgreen)", color: "var(--color-darkgreen)" }}
      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
      disabled={currentPage === 1}
    >
      Prev
    </button>
    <div className="flex justify-center items-center gap-2">
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          className={`w-8 h-8 flex items-center justify-center rounded font-bold border ${currentPage === idx + 1 ? "bg-earth" : "bg-beige"} transition`}
          style={{
            backgroundColor: currentPage === idx + 1 ? "var(--color-earth)" : "var(--color-beige)",
            borderColor: "var(--color-darkgreen)",
            color: "var(--color-darkgreen)",
          }}
          onClick={() => setCurrentPage(idx + 1)}
        >
          {idx + 1}
        </button>
      ))}
    </div>
    <button
      className="px-3 py-1 rounded border font-semibold"
      style={{ backgroundColor: "var(--color-beige)", borderColor: "var(--color-darkgreen)", color: "var(--color-darkgreen)" }}
      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}

        </section>
      </div>
    </main>
  );
}
