import React, { useState, useRef } from "react";
import { ChevronDown, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";


/**
 * @param {Object} props
 * @param {number} props.rating - Average rating value (e.g., 4.3)
 * @param {number} props.reviewCount - Total number of reviews
 * @param {Array<{ stars: number, percentage: number }>} props.ratingData - Array of rating breakdown
 * @param {string} props.productId - ID of the current product (used for routing)
 */
const HoverReview = ({
  rating = 0,
  reviewCount = 0,
  ratingData = [],
  productId = "",
}) => {
  const [showCard, setShowCard] = useState(false);
  const timer = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timer.current);
    setShowCard(true);
  };

  const handleMouseLeave = () => {
    timer.current = setTimeout(() => {
      setShowCard(false);
    }, 150);
  };
const  {id}=useParams()
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div
      className="relative inline-block text-sm"
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex items-center space-x-1 text-gray-800 cursor-pointer group"
        onMouseEnter={handleMouseEnter}
      >
        <span className="text-base font-semibold">{rating.toFixed(1)}</span>
        <div className="flex text-orange-500">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-orange-500" />
          ))}
          {hasHalfStar && (
            <Star className="w-4 h-4 fill-white stroke-orange-500" />
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-black" />
        <span className="text-blue-600">({reviewCount})</span>
      </div>

      {showCard && (
        <div
          className="absolute z-50 w-80 bg-white shadow-xl border border-gray-200 p-4 rounded-lg top-9 left-0 transition-all"
          onMouseEnter={handleMouseEnter}
        >
          {/* Summary section */}
          <div className="flex items-center mb-2">
            <div className="flex text-orange-500">
              {[...Array(fullStars)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-orange-500" />
              ))}
              {hasHalfStar && (
                <Star className="w-4 h-4 fill-white stroke-orange-500" />
              )}
            </div>
            <span className="ml-2 font-bold text-gray-800 text-base">
              {rating.toFixed(1)} out of 5
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            {reviewCount} global ratings
          </p>

          {/* Rating Breakdown Bars */}
          {Array.isArray(ratingData) && ratingData.length > 0 ? (
            ratingData.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 mb-1">
                <span className="text-blue-700 w-10">{item.stars} star</span>
                <div className="flex-1 bg-gray-200 h-3 rounded overflow-hidden">
                  <div
                    className="bg-orange-500 h-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-800 text-sm">
                  {item.percentage}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm mt-2">
              No rating breakdown available.
            </p>
          )}

          {/* View All Reviews Link */}
          <div className="mt-3 text-right">
            <Link
              to={`/reviews/${id}`}
              className="text-blue-600 hover:underline text-sm"
             >
              See customer reviews
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverReview;
