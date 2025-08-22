import React, { useState, useContext, useEffect } from "react";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoriteContext";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import AuthPage from "../Auth/AuthPage";
import Quickviews from "../../pages/Quickviews";
import { product as pro } from "../../data/allapi";

const AllProducts = ({ products }) => {
  // console.log(products)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartIds, setCartIds] = useState([]);

  const { userdata, usertoken } = useContext(AuthContext);
  const isLoggedIn = !!usertoken;

  const cartContext = useCart();
  const favoritesContext = useFavorites();
  const { addToCart } = cartContext || {};
  const { addToFavorites, removeFromFavorites } = favoritesContext || {};

  useEffect(() => {
    // console.log(products)
    setWishlistIds(userdata?.addtowishlist?.map(p => p._id) || []);
    setCartIds(userdata?.addtocart?.map(p => p._id) || []);
  }, [userdata]);

  const toggleWishlist = async (product) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    const id = product._id;
    const inWishlist = wishlistIds.includes(id);
    try {
      await fetch(
        inWishlist
          ? `${pro.REMOVE_FROM_WISHLIST}/${id}`
          : `${pro.ADD_TO_WISHLIST}/${id}`,
        {
          method: inWishlist ? "PATCH" : "POST",
          headers: { Authorization: `Bearer ${usertoken}` },
          ...(inWishlist ? {} : { "Content-Type":"application/json", body: JSON.stringify({ productId: id }) })
        }
      );
      setWishlistIds(prev => inWishlist ? prev.filter(w => w !== id) : [...prev, id]);
      if (inWishlist) removeFromFavorites?.(id);
      else addToFavorites?.(product);
      toast.success(inWishlist ? "Removed from Wishlist" : "Added to Wishlist");
    } catch {
      toast.error("Wishlist action failed");
    }
  };

  const toggleCart = async (product) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    const id = product._id;
    const inCart = cartIds.includes(id);
    try {
      await fetch(
        inCart
          ? `${pro.REMOVE_FROM_CART}/${id}`
          : `${pro.ADD_TO_CART}/${id}`,
        {
          method: inCart ? "PATCH" : "POST",
          headers: { Authorization: `Bearer ${usertoken}` },
          ...(inCart ? {} : { "Content-Type":"application/json", body: JSON.stringify({ productId: id }) })
        }
      );
      setCartIds(prev => inCart ? prev.filter(c => c !== id) : [...prev, id]);
      if (!inCart) addToCart?.(product);
      toast.success(inCart ? "Removed from Cart" : "Added to Cart");
    } catch {
      toast.error("Cart action failed");
    }
  };

  return (
    <div className="max-w-8xl mx-5 px-4 py-5 font-sans bg-white min-h-screen">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => {
          const isWishlisted = wishlistIds.includes(product._id);
          const isInCart = cartIds.includes(product._id);

          return (
            <div
              key={product._id}
              className="relative bg-white overflow-hidden border border-gray-200 group transition-all duration-300"
            >
              <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-80 overflow-hidden group ">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image?.url}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 "
                  />
                </Link>

                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-2xl shadow-sm">
                  New
                </div>

                {/* Icons */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center space-y-2 z-10">
                  <button onClick={() => toggleCart(product)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                      isInCart ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
                    }`}>
                    <ShoppingCart size={18} />
                  </button>

                  <button onClick={() => { setSelectedProduct(product); setShowQuickView(true); }}
                    className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 bg-white text-gray-600 hover:bg-red-500 hover:text-white">
                    <Eye size={18} />
                  </button>

                  <button onClick={() => toggleWishlist(product)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                      isWishlisted ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
                    }`}>
                    <Heart size={18} />
                  </button>
                </div>
              </div>

              <div className="px-2 py-2 sm:px-4 sm:py-4">
                <p className="text-[10px] sm:text-xs uppercase text-gray-400 tracking-widest leading-tight">
                  {product.category || "Handmade"}
                </p>
                <Link to={`/product/${product._id}`}>
                  <h2 className="text-[13px] sm:text-base font-semibold text-gray-800 truncate hover:text-red-500 mt-0.5 sm:mt-1 leading-snug">
                    {product.title}
                  </h2>
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-0.5 sm:mt-1 gap-1 sm:gap-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* MRP (cut price) */}
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      ₹{Math.round(product.price)}
                    </span>
                    {/* Offer price with green color */}
                    <span className="text-xs sm:text-sm font-semibold text-green-600">
                      ₹{Math.round(product.discountedPrice)}
                    </span>
                    {/* Discount percentage */}
                    {/* <span className="text-[10px] sm:text-xs text-green-600 font-medium">
                      ({Math.round(((product.price * 1.3 - product.price) / (product.price * 1.3)) * 100)}% OFF)
                    </span> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <Quickviews
          product={selectedProduct}
          onClose={() => {
            setShowQuickView(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3 right-4 text-gray-600 text-xl font-bold"
            >
              ×
            </button>
            <AuthPage
              onSuccess={() => {
                setShowLoginModal(false);
                window.dispatchEvent(new Event("storage"));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
