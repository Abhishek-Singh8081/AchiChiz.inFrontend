import React, { useEffect, useState } from 'react';
import RatingStars from './RatingStars';

const ReviewSummary = ({ averageRating, totalReviews, ratingDistribution }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100); // delay ensures transition
    return () => clearTimeout(timeout);
  }, []);

  const getPercentage = (count) =>
    totalReviews > 0 ? (count / totalReviews) * 100 : 0;

  return (
    <div className="bg-white shadow-sm  p-6 mb-6 hover: transition-transform duration-300">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center  md:items-start">
          <div className="text-4xl pl-6 font-bold text-black-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <RatingStars rating={averageRating} size="lg" />
          <div className="text-sm  text-gray-600 mt-2">
            Based on {totalReviews.toLocaleString()} reviews
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[5 - star] || 0;
              const percentage = getPercentage(count);

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {star}★
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-1000`}
                      style={{ width: animate ? `${percentage}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
