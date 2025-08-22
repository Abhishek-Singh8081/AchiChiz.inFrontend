import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";

const PaymentFailPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffaf6] text-center px-4">
      <FiXCircle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
      <p className="text-gray-700 text-lg mb-4">
        Oops! Something went wrong. Please try again or contact support.
      </p>
      <p className="text-sm text-gray-500">
        Redirecting to homepage in 5 seconds...
      </p>
    </div>
  );
};

export default PaymentFailPage;
