import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../data/allapi";

const CustomerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/getAllReviewsByuser`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setReviews(data.data);
        } else {
          console.warn("No reviews received from API");
        }
      } catch (error) {
        console.error("Failed to fetch customer reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Auto switch review every 6 seconds
  useEffect(() => {
    if (reviews.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [reviews]);

  // Fallback images
  const fallbackImage = "https://via.placeholder.com/600x400?text=No+Image";
  const fallbackAvatar = "https://randomuser.me/api/portraits/women/44.jpg";

  // Get current review
  const currentReview = reviews[current];

  // Get product image from review
  const productImage =
    currentReview?.product?.images?.[0]?.url || fallbackImage;

  return (
    <section className="bg-white px-4 md:px-20">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-wide">
          CUSTOMER REVIEWS
        </h2>
        <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
          Handmade items are created with heart and soul. Here’s what our happy
          customers have to say.
        </p>
      </div>

      {/* Review container */}
      <div className="relative min-h-[470px] md:min-h-[420px]">
        <AnimatePresence mode="wait">
          {currentReview && (
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex flex-col md:flex-row absolute inset-0"
            >
              {/* Product Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto">
                <img
                  src={productImage}
                  alt={currentReview?.product?.title || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Review Details */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                <div className="flex flex-row md:flex-col items-start gap-4">
                  {/* Avatar */}
                  <img
                    src={fallbackAvatar}
                    alt={currentReview?.user?.name || "User"}
                    className="w-14 h-14 rounded-full border-4 border-white shadow-md"
                  />

                  {/* Review Text */}
                  <div className="flex-1">
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
                      {currentReview?.review || "No review available"}
                    </p>
                    <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                      {currentReview?.user?.name || "Anonymous"}
                    </h4>
                    {currentReview?.product?.title && (
                      <p className="text-xs text-gray-500 mt-1">
                        Product: {currentReview.product.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CustomerReview;
