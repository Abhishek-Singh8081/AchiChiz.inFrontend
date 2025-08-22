import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HoverReview from "../components/card";
import { AuthContext } from "../context/AuthContext";
import { product } from "../data/allapi";
import { FiTrash2 } from "react-icons/fi";

const CartPage = () => {
  const { userdata, usertoken } = useContext(AuthContext);
  const navigate = useNavigate();
  const cartItems = userdata?.addtocart || [];

  // Local quantity state keyed by product id
  const [quantities, setQuantities] = useState({});

  // Key to store quantities in localStorage
  const STORAGE_KEY = "cartQuantities";

  useEffect(() => {
    // Load saved quantities from localStorage or initialize from cartItems
    const savedQuantities = localStorage.getItem(STORAGE_KEY);
    if (savedQuantities) {
      try {
        const parsed = JSON.parse(savedQuantities);

        // Filter parsed quantities to only those present in current cartItems
        const filtered = {};
        cartItems.forEach(item => {
          filtered[item._id] = parsed[item._id] || item.quantity || 1;
        });

        setQuantities(filtered);
      } catch {
        // fallback to cartItems quantities if JSON parse fails
        const initialQuantities = {};
        cartItems.forEach((item) => {
          initialQuantities[item._id] = item.quantity || 1;
        });
        setQuantities(initialQuantities);
      }
    } else {
      const initialQuantities = {};
      cartItems.forEach((item) => {
        initialQuantities[item._id] = item.quantity || 1;
      });
      setQuantities(initialQuantities);
    }

    document.body.style.backgroundColor = "#fef4e8";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [cartItems]);

  // Save quantities to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(quantities).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
    }
  }, [quantities]);

  const getTotal = () =>
    cartItems.reduce(
      (acc, item) =>
        acc + item.price * (quantities[item._id] || item.quantity || 1),
      0
    );

  // Update quantity locally only (no API call)
  const updateQuantityLocal = (id, delta) => {
    setQuantities((prev) => {
      const currentQty = prev[id] || 1;
      const newQty = currentQty + delta;

      if (newQty < 1) return prev; // Prevent quantity below 1 here

      return { ...prev, [id]: newQty };
    });
  };

  // Remove item from cart - keep API call here for immediate effect
  const removeFromCart = async (id) => {
    try {
      const response = await fetch(`${product.REMOVE_FROM_CART}/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to remove item from cart");
      // Also update localStorage by removing the deleted item quantity
      setQuantities((prev) => {
        const updated = { ...prev };
        delete updated[id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error removing item from cart");
    }
  };

  return (
    <div className="text-[#1e1e1e] font-sans mt-5 px-4 py-10 max-w-7xl mx-auto relative">
      <h1 className="text-4xl font-bold  mb-8 text-center text-[#0f2c5c]">
        🧺 Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          <p className="text-xl font-semibold mb-4">
            Your cart is feeling a little lonely 😢
          </p>
          <p className="text-md">
            “The best time to shop was yesterday. The second-best time is now.”
          </p>
          <p className="mt-2 mb-6">
            Start exploring our handmade treasures and fill your cart with love!
          </p>
          <button
            onClick={() => navigate("/category")}
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold hover:from-pink-400 hover:to-orange-500 transition-all shadow-lg hover:scale-105"
          >
            🛍️ Explore Products
          </button>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-10">
            {/* LEFT: Items */}
            <div className="lg:col-span-2 space-y-10">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-3xl bg-[#e0dcdc] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all relative"
                >
                  {/* Product Image */}
                  <div className="flex justify-center items-center">
                    <img
                      src={
                        item.images?.[0]?.url || "https://via.placeholder.com/150"
                      }
                      alt={item.title}
                      className="w-44 h-44 object-cover rounded-2xl shadow hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="md:col-span-2 space-y-3 relative">
                    <h2 className="text-xl font-bold text-[#0f2c5c]">
                      {item.title}
                    </h2>

                    <HoverReview
                      rating={item.ratings || 0}
                      reviewCount={item.numReviews || 0}
                      ratingData={item.ratingData}
                    />

                    <div className="flex items-center gap-10 mt-2">
                      <div>
                        <p className="text-sm font-semibold">Qty</p>
                        <div className="flex items-center bg-white rounded-xl mt-1 w-24 shadow-inner">
                          <button
                            onClick={() => {
                              if ((quantities[item._id] || 1) <= 1) {
                                removeFromCart(item._id);
                              } else {
                                updateQuantityLocal(item._id, -1);
                              }
                            }}
                            className="px-3 py-1 font-bold text-xl hover:scale-125 transition"
                          >
                            -
                          </button>
                          <span className="px-3 py-1">
                            {quantities[item._id] || 1}
                          </span>
                          <button
                            onClick={() => updateQuantityLocal(item._id, +1)}
                            className="px-3 py-1 font-bold text-xl hover:scale-125 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Total</p>
                        <p className="font-bold text-lg text-green-700 mt-1">
                          ₹{" "}
                          {(item.price || 0) *
                            (quantities[item._id] || item.quantity || 1)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700"
                      aria-label="Remove item"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Summary */}
            <div className="sticky top-10 h-fit p-6 rounded-3xl bg-white/40 backdrop-blur-lg border border-white/30 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4 text-[#0f2c5c]">Summary</h3>
              <div className="text-lg font-semibold mb-2">
                Total Items: {cartItems.length}
              </div>
              <div className="text-xl font-bold text-[#0f2c5c] mb-6">
                Grand Total: ₹ {getTotal()}
              </div>
              <button
                onClick={() =>
                  navigate("/checkout-pages", {
                    state: {
                      products: cartItems.map((item) => ({
                        ...item,
                        quantity: quantities[item._id] || item.quantity || 1,
                      })),
                      from: "cart",
                    },
                  })
                }
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold hover:from-pink-400 hover:to-orange-500 transition-all shadow-lg hover:scale-105"
              >
                🛍️ Proceed to Checkout
              </button>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white/30 backdrop-blur-lg border border-white/40 p-4 shadow-lg text-sm text-black hover:bg-[#e0dcdc] transition-all">
              <p className="font-bold">🚚 Free Shipping</p>
              <p className="underline text-gray-700 cursor-pointer hover:text-black">
                Enter your postal code for delivery availability.
              </p>
            </div>
            <div className="rounded-xl bg-white/30 backdrop-blur-lg border border-white/40 p-4 shadow-lg text-sm text-black hover:bg-[#e0dcdc] transition-all">
              <p className="font-bold pt-2 mt-1">↩️ Return Policy</p>
              <p className="text-gray-700">
                Free 30-day delivery return.{" "}
                <a href="#" className="underline hover:text-blue-700">
                  Details
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
