import React from "react";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();

  // Dummy data – fetch from API in real app
  const order = {
    id: orderId,
    customer: "Amit Kumar",
    items: [
      { name: "Pottery Vase", qty: 1, price: 499 },
      { name: "Woolen Scarf", qty: 2, price: 550 },
    ],
    total: 1598,
    status: "Pending",
    address: "123 MG Road, Delhi",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-semibold mb-2">Customer: {order.customer}</h2>
        <p className="text-gray-600 mb-2">Shipping Address: {order.address}</p>
        <p className="text-gray-600 mb-4">Status: {order.status}</p>

        <h3 className="font-semibold mb-2">Items:</h3>
        <ul className="list-disc list-inside space-y-1">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.name} x{item.qty} – ₹{item.price}
            </li>
          ))}
        </ul>

        <p className="mt-4 font-bold text-lg">Total: ₹{order.total}</p>

        <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Mark as Shipped
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
