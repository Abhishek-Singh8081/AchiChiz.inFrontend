import React, { useContext, useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2, Star, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Quickviews from "../pages/Quickviews";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { product } from "../data/allapi";

const FavoriteItems = () => {
  const { userdata, usertoken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState(userdata?.addtowishlist || []);

  useEffect(() => {
    setWishlist(userdata?.addtowishlist || []);
  }, [userdata]);

  const handleAddToCart = async (id) => {
    if (!usertoken) {
      toast.error("Please login to add products to cart.");
      return;
    }

    try {
      const response = await fetch(`${product.ADD_TO_CART}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || "Failed to add to cart");
      }

      toast.success("Item added to cart successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleRemove = async (id) => {
    if (!usertoken) {
      toast.error("Please login to remove items from wishlist.");
      return;
    }

    try {
      const response = await fetch(`${product.REMOVE_FROM_WISHLIST}/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || "Failed to remove item");
      }

      toast.success("Removed from favorites");

      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item._id !== id)
      );
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for (let i = 0; i < full; i++)
      stars.push(
        <Star
          key={`f${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    if (half)
      stars.push(
        <Star
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50"
        />
      );
    for (let i = 0; i < 5 - Math.ceil(rating); i++)
      stars.push(<Star key={`e${i}`} className="h-4 w-4 text-gray-300" />);
    return stars;
  };

  return (
    <div className="space-y-6 m-10 ml-5">
      <div className="flex justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Favorite</h2>
        <div className="ml-7 text-sm text-gray-600">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto lg:grid lg:grid-cols-3 lg:gap-6 scrollbar-hide pb-2">
          {wishlist.map((item) => (
            <motion.div
              key={item._id}
              className="w-[260px] sm:w-[580px] lg:w-full bg-white shadow-lg p-4 flex-shrink-0 group transition-transform duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative">
                <div className="w-full h-[300px] bg-gray-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.images?.[0].url}
                    alt={item.title}
                    className="object-cover h-80 w-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {item.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium">
                    -{item.discount}%
                  </div>
                )}

                {!item.inStock && (
                  <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 text-xs font-medium">
                    Out of Stock
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => {
                      setSelectedProduct(item);
                      setShowQuickView(true);
                    }}
                    className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow hover:bg-red-500 text-gray-600 hover:text-white transition"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <h3 className="font-semibold text-gray-800 text-base line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(item.ratings || 0)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({item.reviews?.length || 0})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-800">
                    ₹{item.price}
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{item.originalPrice}
                    </span>
                  )}
                </div>

                <motion.button
                  onClick={() => handleAddToCart(item._id)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium shadow-md hover:shadow-lg transition"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.2 }}
            transition={{ duration: 0.6, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full shadow-inner bg-white flex items-center justify-center border border-gray-200"
          >
            <Heart className="h-12 w-12 text-pink-400 animate-pulse" />
          </motion.div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Uh-oh... it's a love desert here 💔
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Looks like you haven't fallen for anything yet. We won’t judge — but your heart (and cart) might! 😄
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full shadow hover:from-pink-600 hover:to-yellow-600 transition-all duration-300"
          >
            Go Find Something You Love ❤️
          </button>
        </div>
      )}

      {showQuickView && selectedProduct && (
        <Quickviews
          product={selectedProduct}
          onClose={() => {
            setShowQuickView(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default FavoriteItems;