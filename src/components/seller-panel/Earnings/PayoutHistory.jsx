import React from "react";

const PayoutHistory = () => {
  const payouts = [
    { id: 1, amount: 2500, date: "2025-06-25", status: "Completed" },
    { id: 2, amount: 1800, date: "2025-06-15", status: "Completed" },
    { id: 3, amount: 1280, date: "2025-06-05", status: "Pending" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Payout History</h1>

      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-b">
                <td className="p-4">{payout.id}</td>
                <td className="p-4">₹{payout.amount}</td>
                <td className="p-4">{payout.date}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      payout.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {payout.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutHistory;
