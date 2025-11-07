import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";

const ecoFactors = {
  "Riding a bike 🚲": 2.5,
  "Donating clothes 👕": 3.0,
  "Recycling plastic ♻️": 0.8,
  "Planting a tree 🌳": 20.0 / 12,
  "Using public transport 🚌": 1.5,
  "Composting food waste 🍂": 0.6,
};
const ecoActionsList = Object.keys(ecoFactors);

function genActionsForPastMonth(daysArr) {
  const allTypes = ecoActionsList;
  const maxN = daysArr.length >= 30 ? 25 : daysArr.length;
  const minN = daysArr.length >= 30 ? 20 : Math.max(10, Math.floor(daysArr.length * 0.7));
  const actionsN = minN + Math.floor(Math.random() * (maxN - minN + 1));
  const daysPool = [...daysArr];
  let usedDays = [];
  while (usedDays.length < actionsN && daysPool.length > 0) {
    const idx = Math.floor(Math.random() * daysPool.length);
    usedDays.push(daysPool[idx]);
    daysPool.splice(idx, 1);
    if (daysPool.length === 0 && usedDays.length < actionsN) {
      daysPool.push(...daysArr);
    }
  }
  let groupedActions = {};
  usedDays.forEach((day, i) => {
    const type = allTypes[Math.floor(Math.random() * allTypes.length)];
    const key = `${day}|${type}`;
    if (!groupedActions[key])
      groupedActions[key] = { day, name: type, count: 0 };
    groupedActions[key].count += 1;
  });
  const actions = Object.values(groupedActions).sort((a, b) => a.day - b.day);
  const tabObj = {};
  actions.forEach(({ name, count }) => {
    if (!tabObj[name]) tabObj[name] = 0;
    tabObj[name] += count;
  });
  const tab = Object.entries(tabObj).map(([name, count]) => ({ name, count }));
  return { actions, tab };
}

function getMaxConsecutiveStreak(days) {
  if (!days.length) return 0;
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  let maxStreak = 1, streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i-1] + 1) {
      streak += 1;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 1;
    }
  }
  return maxStreak;
}

export default function Stats() {
  const now = new Date();
  const todayNum = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  const [displayedMonth, setDisplayedMonth] = useState(
    new Date(todayYear, todayMonth, 1)
  );

  function syncActionsAndEcoDays(year, month) {
    const monthStart = new Date(year, month, 1);
    const monthEnd = endOfMonth(monthStart);
    const monthDaysArr = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const daysInMonth = monthDaysArr.map(d => d.getDate());
    let ecoDays = [];
    let actions = [];
    let tab = [];
    if (year === 2025 && month === 10) {
      ecoDays = [2, 4, 5, 6, 7];
      actions = ecoDays.map((d, i) => ({
        day: d,
        name: ecoActionsList[i % ecoActionsList.length],
        count: 1,
        impact: parseFloat(ecoFactors[ecoActionsList[i % ecoActionsList.length]].toFixed(2)),
      }));
      tab = ecoActionsList.slice(0, actions.length).map((name, i) => ({
        name,
        count: 1,
        impact: parseFloat(ecoFactors[name].toFixed(2)),
      }));
    } else {
      const { actions: acts, tab: tabL } = genActionsForPastMonth(daysInMonth);
      ecoDays = acts.map(a => a.day);
      actions = acts.map(a => ({
        ...a,
        impact: parseFloat(ecoFactors[a.name] * a.count).toFixed(2),
      }));
      tab = tabL.map(a => ({
        ...a,
        impact: parseFloat(ecoFactors[a.name] * a.count).toFixed(2),
      }));
    }
    return { ecoDays, actions, tab, monthDays: daysInMonth };
  }

  const { ecoDays, actions, tab, monthDays } = useMemo(
    () =>
      syncActionsAndEcoDays(
        displayedMonth.getFullYear(),
        displayedMonth.getMonth()
      ),
    [displayedMonth]
  );

  const totalLunarImpact = tab.reduce((sum, act) => sum + Number(act.impact), 0).toFixed(2);
  const currentStreak = getMaxConsecutiveStreak(ecoDays);

  function computeWeeklyStreaksForDisplayedMonth() {
    const startIndex = getDay(startOfMonth(displayedMonth));
    const offset = startIndex === 0 ? 7 : startIndex;
    const weeklyCounts = [0, 0, 0, 0, 0];
    for (const d of ecoDays) {
      if (!d || d < 1) continue;
      const weekIndex = Math.ceil((d + (offset - 1)) / 7);
      if (weekIndex >= 1 && weekIndex <= weeklyCounts.length) {
        weeklyCounts[weekIndex - 1] += 1;
      }
    }
    for (let i = 0; i < weeklyCounts.length; i++) {
      weeklyCounts[i] = Math.min(7, weeklyCounts[i]);
    }
    return weeklyCounts.map((count, idx) => ({
      week: `Week ${idx + 1}`,
      actions: count,
    }));
  }
  const weeklyData = computeWeeklyStreaksForDisplayedMonth();

  function prevMonth() {
    setDisplayedMonth(
      new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1)
    );
  }
  function nextMonth() {
    const next = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + 1,
      1
    );
    if (
      next.getFullYear() > now.getFullYear() ||
      (next.getFullYear() === now.getFullYear() &&
        next.getMonth() > now.getMonth())
    ) {
      return;
    }
    setDisplayedMonth(next);
  }
  const navBtnClass =
    "px-3 py-1 rounded-md font-semibold shadow-sm border transition disabled:opacity-50";
  const singleLeafIcon = (
    <span
      className="text-2xl leading-none drop-shadow-sm"
      style={{ color: "var(--color-darkgreen)" }}
      aria-hidden
    >
      🍃
    </span>
  );
  const streakDays = new Set(ecoDays);

  return (
    <main
      className="p-6 bg-fundal min-h-screen"
      style={{ backgroundColor: "var(--color-fundal)" }}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <section
          className="bg-bigbox rounded-2xl shadow-md p-4 sm:p-6 border border-smallbox"
          style={{
            backgroundColor: "var(--color-bigbox)",
            borderColor: "var(--color-smallbox)",
          }}
        >
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={prevMonth}
                  className={navBtnClass}
                  style={{
                    background: "var(--color-darkgreen)",
                    borderColor: "var(--color-darkgreen)",
                    color: "var(--color-fundal)",
                  }}
                  aria-label="Previous month"
                >
                  ◀
                </button>
                <h3
                  className="text-xl sm:text-2xl font-extrabold text-center"
                  style={{
                    color: "var(--color-darkgreen)",
                    minWidth: "10rem",
                  }}
                >
                  {format(displayedMonth, "MMMM yyyy")}
                </h3>
                <button
                  onClick={nextMonth}
                  className={navBtnClass}
                  style={{
                    background: "var(--color-darkgreen)",
                    borderColor: "var(--color-darkgreen)",
                    color: "var(--color-fundal)",
                  }}
                  aria-label="Next month"
                  disabled={
                    displayedMonth.getFullYear() === now.getFullYear() &&
                    displayedMonth.getMonth() === now.getMonth()
                  }
                >
                  ▶
                </button>
              </div>
              <div
                className="flex items-center gap-3 rounded-lg px-3 py-2 shadow-sm"
                style={{
                  backgroundColor: "var(--color-bigbox)",
                  border: "1px solid var(--color-smallbox)",
                  width: "13rem",
                  flexShrink: 0,
                }}
              >
                <div className="flex items-center">
                  <div className="text-lg mr-2" style={{ color: "var(--color-darkgreen)" }}>
                    {singleLeafIcon}
                  </div>
                  <div className="text-sm text-left" style={{ color: "var(--color-darkgreen)" }}>
                    <div className="font-semibold">
                      Current Streak {currentStreak} {currentStreak === 1 ? "day" : "days"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-7 text-center font-bold mb-2 text-darkgreen text-xs sm:text-sm" style={{ color: "var(--color-darkgreen)" }}>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((d, idx) => {
                const isEcoDay = ecoDays.includes(d);
                const isInStreak = streakDays.has(d);
                const baseClasses =
                  "w-full aspect-square flex items-center justify-center rounded-lg text-xs sm:text-sm transition-all";
                const ecoStyle = isEcoDay
                  ? {
                      backgroundColor: "var(--color-earth)",
                      color: "var(--color-darkgreen)",
                      fontWeight: 700,
                      boxShadow: "0 6px 10px rgba(0,0,0,0.06)",
                    }
                  : {
                      backgroundColor: "var(--color-smallbox)",
                      color: "var(--color-darkgreen)",
                    };
                const streakStyle = isInStreak
                  ? {
                      boxShadow: "0 0 0 3px var(--color-darkgreen)",
                      transform: "scale(1.03)",
                    }
                  : undefined;
                return (
                  <div
                    key={d + '-' + idx}
                    className={baseClasses}
                    style={{
                      gridColumnStart: idx === 0 ? getDay(startOfMonth(displayedMonth)) || 7 : undefined,
                      ...(ecoStyle || {}),
                      ...(streakStyle || {}),
                    }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span className="z-10" style={{ color: "var(--color-darkgreen)" }}>
                        {d}
                      </span>
                      {isEcoDay && (
                        <span
                          className="absolute right-1 bottom-1 z-20"
                          style={{
                            fontSize: isInStreak ? "1.05rem" : "0.85rem",
                            color: "var(--color-darkgreen)",
                          }}
                          aria-hidden
                        >
                          🍃
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Impact & Sustainable actions */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 mt-10">
          <div className="flex-1 bg-bigbox rounded-2xl shadow-md py-4 px-6 border border-smallbox"
               style={{background: "var(--color-bigbox)", color: "var(--color-darkgreen)", borderColor: "var(--color-smallbox)"}}>
            <h3 className="text-lg font-bold mb-3">Sustainable actions this month</h3>
            <ul className="space-y-2">
              {tab.map(act => (
                <li key={act.name}
                    className="flex justify-between items-center rounded-lg bg-earth px-3 py-2"
                    style={{background: "var(--color-earth)", color: "var(--color-darkgreen)"}}>
                  <span>
                    {act.name} {act.count > 1 ? `x${act.count}` : ""}
                  </span>
                  <span className="text-sm font-semibold" style={{minWidth: '60px', textAlign: 'right'}}>
                    {act.impact} kg CO₂
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Right: monthly eco impact */}
          <div className="flex-1 flex flex-col items-center justify-center rounded-2xl shadow-md p-7 border border-smallbox shadow-lg relative overflow-hidden"
               style={{
                 background: "var(--color-earth)",
                 color: "var(--color-darkgreen)",
                 borderColor: "var(--color-smallbox)",
                 minHeight: 260,
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center'
               }}>
            <img
              src="https://user-gen-media-assets.s3.amazonaws.com/gemini_images/fcc94e40-fdab-4e36-88fc-fa8eee56d902.png"
              alt="CO2 eco leaf"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.21,
                zIndex: 1,
                pointerEvents: "none",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.09))"
              }}
            />
            <span className="text-xl font-bold mb-3 z-10" style={{letterSpacing:"0.01em"}}>Your Ecological Impact This Month</span>
            <span className="text-5xl font-extrabold mb-3 z-10 flex gap-2 items-center" style={{color: "var(--color-darkgreen)"}}>
              {totalLunarImpact} kg CO₂
              <span className="text-3xl" aria-label="Earth">🌍</span>
            </span>
            <span className="text-lg font-semibold text-center mt-1 z-10" style={{color: "var(--color-darkgreen)", lineHeight: 1.35}}>
              You have saved <b>{totalLunarImpact} kg CO₂</b> through your sustainable actions this month!
            </span>
            <span className="uppercase tracking-wide mt-4 text-[1.1rem] font-medium z-10"
                  style={{color:'#357d55',letterSpacing:'0.05em'}}>
            </span>
          </div>
        </div>
      </div>
      {/* Weekly eco streak chart */}
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 mt-6">
        <section
          className="bg-bigbox rounded-2xl shadow-md p-4 sm:p-6 border-t border-smallbox"
          style={{
            backgroundColor: "var(--color-bigbox)",
            borderColor: "var(--color-smallbox)",
          }}
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-xl sm:text-2xl font-bold text-darkgreen"
                style={{ color: "var(--color-darkgreen)" }}
              >
                Weekly Eco Actions
              </h3>
              <div
                className="text-sm"
                style={{ color: "var(--color-darkgreen)" }}
              >
                {displayedMonth.getMonth() === now.getMonth() &&
                  displayedMonth.getFullYear() === now.getFullYear()
                  ? "Showing until current week"
                  : "Sample data"}
              </div>
            </div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 12, right: 8, left: 8, bottom: 6 }}
                  barGap={8}
                  barCategoryGap="30%"
                >
                  <CartesianGrid
                    stroke="var(--color-beige)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "var(--color-darkgreen)", fontWeight: 700 }}
                  />
                  <YAxis
                    tick={{ fill: "var(--color-darkgreen)", fontWeight: 700 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                    contentStyle={{
                      backgroundColor: "var(--color-bigbox)",
                      borderRadius: "8px",
                      border: "1px solid var(--color-smallbox)",
                      color: "var(--color-darkgreen)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="actions"
                    name="Streak days"
                    fill="var(--color-earth)"
                    stroke="var(--color-darkgreen)"
                    strokeWidth={2}
                    radius={[10, 10, 6, 6]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
