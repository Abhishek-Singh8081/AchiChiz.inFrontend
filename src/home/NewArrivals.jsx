import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import { toast } from "react-hot-toast";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import Quickviews from "../pages/Quickviews";
import { Link } from "react-router-dom";
import { product } from "../data/allapi";

const NewArrivals = () => {
  const [productsData, setProductsData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);

  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites } = useFavorites();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(product.APPROVED_PRODUCTS_FOR_HOME);
        const { data } = await res.json();
        const validData = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : [];
        setProductsData(validData.slice(0, 4));
      } catch (error) {
        console.error("API error:", error);
        toast.error("Failed to load products");
        setProductsData([]);
      }
    };

    fetchProducts();
  }, []);

 const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
    toast.success("Added to Cart");
  };

  const toggleWishlist = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (wishlistIds.includes(product.id)) {
      setWishlistIds(wishlistIds.filter((id) => id !== product.id));
      removeFromFavorites(product.id);
      toast.success("Removed from Favorites");
    } else {
      setWishlistIds([...wishlistIds, product.id]);
      addToFavorites(product);
      toast.success("Added to Favorites");
    }
  };

  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="max-w-8xl ml-1 pl-4 py-10 font-sans min-h-70">
       <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-center md:text-left text-[#000000]">
          New Arrivals
        </h2>

      {/* Responsive wrapper */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
        {productsData.map((product) => {
          const isWishlisted = wishlistIds.includes(product._id);
          return (
            <div key={product._id} className="relative bg-white overflow-hidden ">
              <div className="relative w-full h-110 group">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images?.[0].url}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0 group-hover:scale-105"
                  />
                  {product.images?.[1] && (
                    <img
                      src={product.images[1].url}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}
                </Link>

                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-4xl shadow-md">
                  {product.isHandmade ? "Handmade" : "Hot"}
                </div>

                <div className="absolute top-1/2 right-2 -translate-y-1/1 flex flex-col items-center space-y-3 z-10">
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-white w-12 h-12 flex items-center justify-center rounded-full shadow hover:bg-red-500 text-gray-600 hover:text-white transition opacity-100 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 duration-300 delay-100"
                  >
                    <ShoppingCart size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowQuickView(true);
                    }}
                    className="bg-white w-12 h-12 flex items-center justify-center rounded-full shadow hover:bg-red-500 text-gray-600 hover:text-white transition opacity-100 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 duration-300 delay-200"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full shadow transition hover:bg-red-500 text-gray-600 hover:text-white transition opacity-100 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 duration-300 delay-300  ${
                      isWishlisted
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              <div className="px-4  bg-white">
                <p className="text-xs py-3 uppercase text-gray-400 tracking-widest">
                  {product.subCategory?.name || "Gift Item"}
                </p>
                <Link to={`/product/${product._id}`}>
                  <h2 className="text-sm font-semibold  text-gray-800 truncate hover:text-red-500">
                    {product.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-500 truncate">
                  by {product.artisan?.name} ({product.artisan?.origin})
                </p>
                <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden flex space-x-4 mt-10 overflow-x-auto no-scrollbar">
        {productsData.map((product) => {
          const isWishlisted = wishlistIds.includes(product._id);
          return (
            <div key={product._id} className="flex-shrink-0  w-[60vw] relative bg-white ">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.images?.[0].url}
                  alt={product.title}
                  className="w-full h-90 object-cover "
                />
              </Link>

              {/* Floating bottom-right buttons */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowQuickView(true);
                  }}
                  className="bg-white w-10 h-10 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white transition"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full shadow transition ${
                    isWishlisted
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <Heart size={18} />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs uppercase text-gray-400 tracking-widest">
                  {product.subCategory?.name || "Gift Item"}
                </p>
                <h2 className="text-sm  py-2 font-semibold text-gray-800 truncate">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  by {product.artisan?.name} ({product.artisan?.origin})
                </p>
                <p className="text-sm py-1 font-medium text-gray-900">₹{product.price}</p>
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

      {/* Hide scrollbar style */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default NewArrivals;
