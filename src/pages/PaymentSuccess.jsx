import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffaf6] text-center px-4">
      <FiCheckCircle className="text-green-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
      <p className="text-gray-700 text-lg mb-4">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <p className="text-sm text-gray-500">
        Redirecting to homepage in 5 seconds...
      </p>
    </div>
  );
};

export default PaymentSuccessPage;
