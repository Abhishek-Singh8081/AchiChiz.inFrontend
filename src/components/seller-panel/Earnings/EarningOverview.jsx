import React from "react";

const EarningsOverview = () => {
  const earnings = {
    totalEarnings: 7580,
    pendingPayout: 2000,
    lastPayoutDate: "June 28, 2025",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Earnings Overview</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl">Total Earnings</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹{earnings.totalEarnings}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl">Pending Payout</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            ₹{earnings.pendingPayout}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl">Last Payout Date</h2>
          <p className="text-xl mt-2">{earnings.lastPayoutDate}</p>
        </div>
      </div>
    </div>
  );
};

export default EarningsOverview;
