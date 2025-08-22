import React, { useState, useRef, useEffect, useContext } from 'react';
import { ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react';
import RatingStars from './RatingStars';
import toast from 'react-hot-toast';
import { product } from '../data/allapi';
import { AuthContext } from '../context/AuthContext';

const ReviewCard = ({
  id,
  author,
  rating,
  date,
  title,
  content,
  verified,
  helpful,
  notHelpful,
  images = [],
  
  onDelete // Callback to trigger deletion from parent
}) => {
  const [helpfulVotes, setHelpfulVotes] = useState(helpful);
  const [notHelpfulVotes, setNotHelpfulVotes] = useState(notHelpful);
  const [userVote, setUserVote] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const {usertoken}=useContext(AuthContext)

  const handleVote = (type) => {
    if (userVote === type) return;
    if (userVote === 'helpful' && type === 'not-helpful') {
      setHelpfulVotes((prev) => prev - 1);
      setNotHelpfulVotes((prev) => prev + 1);
    } else if (userVote === 'not-helpful' && type === 'helpful') {
      setNotHelpfulVotes((prev) => prev - 1);
      setHelpfulVotes((prev) => prev + 1);
    } else if (!userVote) {
      if (type === 'helpful') setHelpfulVotes((prev) => prev + 1);
      else setNotHelpfulVotes((prev) => prev + 1);
    }
    setUserVote(type);
  };

  const shouldTruncate = content.length > 300;
  const displayContent = shouldTruncate && !expanded
    ? content.slice(0, 300) + '...'
    : content;

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 const deleteReview = async () => {
  const loadingId = toast.loading('Deleting review...');

  try {
    const res = await fetch(`${product.DELETE_REVIEW}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${usertoken}`,
      }
    });

    const data = await res.json();
    if (res.ok && data.success) {
      toast.success('Review deleted', { id: loadingId });
      onDelete?.(id);
    } else {
      toast.error('Failed to delete review', { id: loadingId });
    }
  } catch (err) {
    toast.error('Error deleting review', { id: loadingId });
  }
};


  const handleDeleteToast = () => {
    setMenuOpen(false);

    toast((t) => (
      <div className="text-sm">
        <p className="font-medium mb-2">Confirm deletion?</p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteReview(); // Call API
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-600 text-xs px-3 py-1 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  return (
    <div className="bg-white shadow-sm p-6 transition-shadow relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{author}</span>
              {verified && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={rating} size="sm" />
              <span className="text-sm text-gray-500">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-gray-500 hover:text-gray-800"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white border shadow-lg z-20 rounded">
              <button
                onClick={handleDeleteToast}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>

      <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line break-words">
        {displayContent}
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>

      {images.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border hover:scale-105 transition-transform"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleVote('helpful')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              userVote === 'helpful'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            Helpful ({helpfulVotes})
          </button>
          <button
            onClick={() => handleVote('not-helpful')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              userVote === 'not-helpful'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            Not helpful ({notHelpfulVotes})
          </button>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Report
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
