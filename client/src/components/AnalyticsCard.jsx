import React, { useMemo } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

/**
 * AnalyticsCard
 * Props:
 *  - expenses: array of { _id, title, amount, category, date }
 */
const AnalyticsCard = ({ expenses = [] }) => {
  // days labels for weekly chart
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // memoized calculations so charts only recompute when expenses change
  const { weekTotals, categoryTotals, topExpenses } = useMemo(() => {
    const week = Array(7).fill(0);
    const categories = {};
    const top = [...expenses];

    for (const e of expenses) {
      const amount = Number(e.amount) || 0;
      const date = e.date ? new Date(e.date) : new Date();
      const day = date.getDay();
      week[day] += amount;

      const cat = e.category || "Other";
      categories[cat] = (categories[cat] || 0) + amount;
    }

    top.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));

    return {
      weekTotals: week,
      categoryTotals: categories,
      topExpenses: top.slice(0, 5),
    };
  }, [expenses]);

  // Line chart data & options
  const lineData = {
    labels: days,
    datasets: [
      {
        label: "Weekly spending",
        data: weekTotals,
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        // subtle palette that works in light & dark (chromatic CSS will override if needed)
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.12)",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  // Doughnut chart data (category breakdown)
  const doughnutData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#6366f1",
          "#06b6d4",
        ].slice(0, Math.max(1, Object.keys(categoryTotals).length)),
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-6 transition-colors">
      <h2 className="text-lg font-semibold dark:text-gray-100">Analytics</h2>

      {/* Weekly Trend */}
      <div>
        <p className="text-sm mb-2 text-gray-600 dark:text-gray-300">Weekly trend</p>
        <div className="h-40">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <p className="text-sm mb-2 text-gray-600 dark:text-gray-300">Category breakdown</p>
        <div className="h-40">
          {/* show a placeholder message if no categories */}
          {Object.keys(categoryTotals).length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-gray-400">
              No category data yet
            </div>
          ) : (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          )}
        </div>
      </div>

      {/* Top 5 Expenses */}
      <div>
        <p className="text-sm mb-2 text-gray-600 dark:text-gray-300">Top 5 expenses</p>
        <div className="space-y-2">
          {topExpenses.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">No expenses yet</div>
          ) : (
            topExpenses.map((e) => (
              <div
                key={e._id}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg"
              >
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{e.title}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">₹{Number(e.amount) || 0}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
