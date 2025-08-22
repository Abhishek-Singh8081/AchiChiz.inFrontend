import React from "react";
import { FaCheckCircle, FaTruck, FaBoxOpen, FaShippingFast, FaHome } from "react-icons/fa";

const TrackOrderPage = () => {
  // Sample dummy data
  const order = {
    orderId: "ACH123456789",
    orderDate: "2025-07-01",
    customerName: "Pravesh Singh",
    shippingAddress: "123 Handicraft Lane, Jaipur, Rajasthan, 302001",
    paymentMethod: "Cash on Delivery",
    totalAmount: "₹1,499.00",
    courierPartner: "BlueDart",
    estimatedDelivery: "2025-07-05",
    trackingLink: "https://bluedart.com/track",
    products: [
      {
        name: "Handmade Brass Vase",
        quantity: 1,
        price: "₹1,499.00",
        image: "https://via.placeholder.com/100x100",
      },
    ],
    statusTimeline: [
      { label: "Order Placed", date: "2025-07-01", icon: <FaCheckCircle /> },
      { label: "Order Confirmed", date: "2025-07-01", icon: <FaCheckCircle /> },
      { label: "Order Packed", date: "2025-07-02", icon: <FaBoxOpen /> },
      { label: "Shipped", date: "2025-07-03", icon: <FaShippingFast /> },
      { label: "Out for Delivery", date: "", icon: <FaTruck /> },
      { label: "Delivered", date: "", icon: <FaHome /> },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Track Your Order</h1>

      {/* Order Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Information</h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Order Date:</strong> {order.orderDate}</p>
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Total Amount:</strong> {order.totalAmount}</p>
        </div>
      </div>

      {/* Shipment Tracking */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping & Tracking</h2>
        <p className="text-gray-700 mb-2">
          <strong>Courier Partner:</strong> {order.courierPartner}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Estimated Delivery:</strong> {order.estimatedDelivery}
        </p>
        <a
          href={order.trackingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Track on {order.courierPartner}
        </a>
      </div>

      {/* Status Timeline */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {order.statusTimeline.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className={`text-3xl mb-1 ${step.date ? "text-green-600" : "text-gray-400"}`}>
                {step.icon}
              </div>
              <p className={`text-sm ${step.date ? "text-black" : "text-gray-400"}`}>
                {step.label}
              </p>
              <p className="text-xs text-gray-500">{step.date}</p>
              {index < order.statusTimeline.length - 1 && (
                <div className="hidden md:block h-1 w-10 bg-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Product Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Product Summary</h2>
        {order.products.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 mb-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
            <div>
              <p className="font-medium">{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Download Invoice
        </button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Contact Support
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Cancel Order
        </button>
      </div>
    </div>
  );
};

export default TrackOrderPage;
