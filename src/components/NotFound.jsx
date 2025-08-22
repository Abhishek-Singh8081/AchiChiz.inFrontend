// src/pages/NotFound.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Ghost, Ban, Clock, FileWarning, Cat } from "lucide-react";

const reasons = [
  {
    icon: <Ban size={28} className="text-red-500" />,
    text: "The page has been moved or deleted.",
  },
  {
    icon: <Clock size={28} className="text-yellow-500" />,
    text: "The link you followed may be expired.",
  },
  {
    icon: <FileWarning size={28} className="text-orange-500" />,
    text: "You might have mistyped the URL.",
  },
  {
    icon: <Ghost size={28} className="text-indigo-500" />,
    text: "This page never existed in the first place!",
  },
  {
    icon: <Cat size={28} className="text-pink-500" />,
    text: "A cat walked over our keyboard. Sorry!",
  },
];

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-5 bg-white px-6 py-12 text-center font-sans">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl font-semibold text-gray-800 mb-6">Oops! Page Not Found</p>

      <div className="space-y-4 max-w-xl w-full text-left">
        {reasons.map((reason, i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-100 rounded-lg px-4 py-3 shadow-sm">
            {reason.icon}
            <span className="text-gray-700">{reason.text}</span>
          </div>
        ))}
      </div>

      <Link
        to="/"
        className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
