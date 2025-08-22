import React from "react";
import { Link } from "react-router-dom";

const OrderList = () => {
  const orders = [
    {
      id: 101,
      customer: "Amit Kumar",
      total: 1598,
      status: "Pending",
    },
    {
      id: 102,
      customer: "Sneha Singh",
      total: 999,
      status: "Shipped",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4">#{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">₹{order.total}</td>
                <td className="p-4">{order.status}</td>
                <td className="p-4">
                  <Link
                    to={`/seller/orders/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
