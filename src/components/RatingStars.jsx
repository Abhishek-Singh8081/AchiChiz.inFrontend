// src/components/RatingStars.jsx
import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({
  rating,
  maxRating = 5,
  size = 'md',
  showRating = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
      const filled = i <= Math.floor(rating);
      const halfFilled = !filled && i - 1 < rating && rating < i;

      stars.push(
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            filled
              ? 'fill-yellow-400 text-yellow-400'
              : halfFilled
              ? 'fill-yellow-400/50 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">{renderStars()}</div>
      {showRating && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
