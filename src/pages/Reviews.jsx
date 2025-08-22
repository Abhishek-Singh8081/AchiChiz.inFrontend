import React, { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ReviewSummary from '../components/ReviewSummary';
import ReviewCard from '../components/ReviewCard';
import { Input } from '../components/ui/input';
import { AuthContext } from "../context/AuthContext";
import { product } from '../data/allapi';
import toast from 'react-hot-toast';

const Reviews = () => {
  const { id } = useParams();
  const { userdata, usertoken } = useContext(AuthContext);

  if (!id) return <Navigate to="/reviews" replace />;

  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);
  const [averageRating, setAverageRating] = useState(0);
  const [sortBy, setSortBy] = useState('most-recent');
  const [filterRating, setFilterRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ author: '', title: '', content: '', rating: '' });
  const [showForm, setShowForm] = useState(false);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${product.GET_ALL_REVIEWS}/${id}`);
        const data = await res.json();
        if (data.success) {
          const revs = data.reviews.map((r) => ({
            id: r._id,
            author: r.user?.name || 'Anonymous',
            title: '',
            content: r.review,
            rating: r.rating,
            date: r.createdAt,
            helpful: r.helpful || 0,
            notHelpful: r.notHelpful || 0,
            verified: true,
            images: []
          }));

          setReviews(revs);
          setTotalReviews(data.totalReviews || revs.length);

          const dist = [5, 4, 3, 2, 1].map((star) =>
            revs.filter((r) => r.rating === star).length
          );
          setRatingDistribution(dist);

          const avg =
            revs.reduce((sum, r) => sum + r.rating, 0) / (revs.length || 1);
          setAverageRating(parseFloat(avg.toFixed(1)));
        }
      } catch (err) {
        console.error('Fetch reviews failed', err);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (!userdata || !userdata.orders) return;

    const hasOrdered = userdata.orders.some(order =>
      order.orderStatus === "Delivered" &&
      order.orderItems.some(item =>
        item.product === id || item.product?._id === id
      )
    );

    setCanReview(hasOrdered);
  }, [userdata, id]);

  const handleDeleteReview = (deletedId) => {
    setReviews(prev => prev.filter(review => review.id !== deletedId));
    setTotalReviews(prev => prev - 1);

    const deletedReview = reviews.find(r => r.id === deletedId);
    if (deletedReview) {
      const newDist = [...ratingDistribution];
      const idx = 5 - deletedReview.rating;
      newDist[idx] -= 1;
      setRatingDistribution(newDist);

      const remaining = reviews.filter(r => r.id !== deletedId);
      const newAvg =
        remaining.reduce((sum, r) => sum + r.rating, 0) /
        (remaining.length || 1);
      setAverageRating(parseFloat(newAvg.toFixed(1)));
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.author || !form.title || !form.content || !form.rating) return;

    try {
      const res = await fetch(`${product.CREATEING_REVIEWS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken}`
        },
        body: JSON.stringify({
          product: id,
          rating: parseInt(form.rating),
          review: form.content
        })
      });

      const data = await res.json();
      if (data.success) {
        const newReview = {
          id: data.review._id,
          author: userdata.name,
          title: form.title,
          content: form.content,
          rating: parseInt(form.rating),
          date: new Date().toISOString(),
          verified: true,
          helpful: 0,
          notHelpful: 0,
          images: []
        };

        const newList = [newReview, ...reviews];
        setReviews(newList);
        setTotalReviews(prev => prev + 1);

        const idx = 5 - newReview.rating;
        const newDist = [...ratingDistribution];
        newDist[idx] += 1;
        setRatingDistribution(newDist);

        const sumRatings = newList.reduce((sum, r) => sum + r.rating, 0);
        const avg = sumRatings / newList.length;
        setAverageRating(parseFloat(avg.toFixed(1)));

        setForm({ author: '', title: '', content: '', rating: '' });
        setShowForm(false);
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Submit review error:", error);
      toast.error("Something went wrong");
    }
  };

  const filtered = reviews.filter(review => {
    const matchesSearch = [review.title, review.content, review.author]
      .some(str => str.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'most-recent': return new Date(b.date) - new Date(a.date);
      case 'oldest': return new Date(a.date) - new Date(b.date);
      case 'highest-rating': return b.rating - a.rating;
      case 'lowest-rating': return a.rating - b.rating;
      case 'most-helpful': return b.helpful - a.helpful;
      default: return 0;
    }
  });

  return (
    <div className="max-w-6xl mx-auto mt-20 px-6 py-10">
      <h2 className="text-3xl font-bold mb-2">Customer Reviews</h2>
      <p className="text-gray-600 mb-4">Read what customers said about <strong>Product {id}</strong></p>

      {canReview && (
        <div className="mb-6">
          <button
            onClick={() => setShowForm(prev => !prev)}
            className="bg-gradient-to-r from-red-500 to-orange-700 relative group overflow-hidden px-5 py-2 text-white font-medium shadow hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out z-0 "></span>
            <span className="relative z-10">{showForm ? 'Cancel' : 'Write a Review'}</span>
          </button>
        </div>
      )}

      {canReview && showForm && (
        <div className="bg-white border shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Leave a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="author" value={form.author} onChange={handleChange} placeholder="Your Name" required className="border px-4 py-2" />
              <select name="rating" value={form.rating} onChange={handleChange} required className="border px-4 py-2">
                <option value="">Rating</option>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star</option>)}
              </select>
            </div>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Review Title" required className="border px-4 py-2 w-full" />
            <textarea name="content" value={form.content} onChange={handleChange} placeholder="Your review..." rows={4} required className="border px-4 py-2 w-full" />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 shadow">Submit Review</button>
          </form>
        </div>
      )}

      <ReviewSummary averageRating={averageRating} totalReviews={totalReviews} ratingDistribution={ratingDistribution} />

      <div className="flex flex-col sm:flex-row items-center gap-4 my-6">
        <Input type="text" placeholder="Search reviews..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="sm:w-1/2" />
        <select value={filterRating} onChange={e => setFilterRating(e.target.value)} className="border p-2">
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2">
          <option value="most-recent">Most Recent</option>
          <option value="oldest">Oldest</option>
          <option value="highest-rating">Highest Rating</option>
          <option value="lowest-rating">Lowest Rating</option>
          <option value="most-helpful">Most Helpful</option>
        </select>
      </div>

      <div className="space-y-6">
        {sorted.length > 0 ? (
          sorted.map(review => (
            <ReviewCard
              key={review.id}
              {...review}
              onDelete={handleDeleteReview}
            />
          ))
        ) : (
          <div className="text-center py-16 text-gray-500">No reviews match your filters.</div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
