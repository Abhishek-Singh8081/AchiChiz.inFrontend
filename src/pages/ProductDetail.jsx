import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // adjust path if needed
import { product } from '../data/allapi';

const ProductDetail = () => {
  const { id } = useParams();
  const { usertoken } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // useEffect(() => {
  //   console.log("ProductDetail mounted");
  //   console.log("User token:", usertoken);
  //   console.log("API Endpoint:", product.ADD_TO_CART, "Product ID:", id);
  // }, [usertoken, id]);

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${product.ADD_TO_CART}${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${usertoken}`
        }
      });
      // console.log(response)

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || 'Failed to add to cart');
      }

      setSuccess('✅ Product added to cart successfully!');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[300px] max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Product Detail Page</h1>
      <p className="text-lg mb-6">
        You are viewing product with ID: <span className="font-semibold">{id}</span>
      </p>

      <button
        onClick={handleAddToCart}
        disabled={!usertoken || loading}
        className={`mt-4 px-4 py-2 rounded text-white ${
          !usertoken || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
};

export default ProductDetail;
