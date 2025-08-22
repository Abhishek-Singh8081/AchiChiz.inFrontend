import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Heart, Share2, Plus, Minus, MapPin, Star, ShoppingCart, Zap } from "lucide-react";
import toast from "react-hot-toast";

const CustomProductPage = ({ 
  productData = null,
  apiEndpoints = {},
  userToken = null,
  customFeatures = [],
  customColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
  enableCustomization = true,
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onBuyNow = () => {},
  relatedProducts = []
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [product, setProduct] = useState(productData || {
    _id: "custom-product-1",
    title: "Premium Eco-Friendly Bamboo Water Bottle",
    description: "Sustainable, stylish, and perfect for everyday use. Made from premium bamboo with a sleek design that keeps your drinks fresh.",
    price: 1299,
    images: [
      { url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop" },
      { url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop" }
    ],
    ratings: 4.5,
    reviews: [
      { rating: 5, comment: "Excellent quality!" },
      { rating: 4, comment: "Great value for money" },
      { rating: 5, comment: "Love the design" }
    ],
    size: ["Small", "Medium", "Large", "XL"],
    color: ["Natural", "Dark Brown", "Light Wood", "Charcoal"],
    material: "Premium Bamboo",
    weight: "300g",
    brand: "EcoLife",
    category: { name: "Drinkware" },
    tags: ["eco-friendly", "sustainable", "bamboo"],
    faqs: [
      {
        question: "Is this dishwasher safe?",
        answer: "Yes, this product is dishwasher safe on the top rack."
      },
      {
        question: "What is the capacity?",
        answer: "Available in multiple sizes: Small (300ml), Medium (500ml), Large (750ml), XL (1L)"
      }
    ]
  });
  const [selectedMaterial, setSelectedMaterial] = useState("Bamboo");
const [customLength, setCustomLength] = useState("");
const [customWidth, setCustomWidth] = useState("");
const [customHeight, setCustomHeight] = useState("");
const [designImage, setDesignImage] = useState(null);
const [customMessage, setCustomMessage] = useState("");
const [giftWrap, setGiftWrap] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: "50%", y: "50%" });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [customColor, setCustomColor] = useState(customColors[0]);
  const [customText, setCustomText] = useState("");
  const [customFont, setCustomFont] = useState("Arial");
  const [customPosition, setCustomPosition] = useState("center");
  const [pincode, setPincode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [customizationMode, setCustomizationMode] = useState(false);
  const intervalRef = useRef(null);

  // Default features - can be overridden by customFeatures prop
  const defaultFeatures = [
    { icon: "Leaf", title: "Eco-Friendly Material", description: "Made from sustainable bamboo" },
    { icon: "Droplets", title: "Leak-Proof Design", description: "Advanced sealing technology" },
    { icon: "Thermometer", title: "Temperature Control", description: "Keeps drinks at perfect temperature" },
    { icon: "Recycle", title: "100% Recyclable", description: "Environmentally responsible" },
    { icon: "Award", title: "Premium Quality", description: "Certified high-grade materials" },
    { icon: "Truck", title: "Free Shipping", description: "Fast delivery across India" }
  ];

  const features = customFeatures.length > 0 ? customFeatures : defaultFeatures;

  // Font options for customization
  const fontOptions = [
    "Arial", "Helvetica", "Georgia", "Times New Roman", 
    "Verdana", "Courier New", "Impact", "Comic Sans MS"
  ];

  // Position options for custom text
  const positionOptions = [
    { value: "top", label: "Top" },
    { value: "center", label: "Center" },
    { value: "bottom", label: "Bottom" }
  ];

  // Initialize selected options
  useEffect(() => {
    if (product.size?.length > 0) setSelectedSize(product.size[0]);
    if (product.color?.length > 0) setSelectedColor(product.color[0]);
  }, [product]);

  // Image auto-slide functionality
  useEffect(() => {
    if (!isHoveringImage && product.images?.length > 0) {
      intervalRef.current = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
      }, 4000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHoveringImage, product.images?.length]);

  // Handlers
  const handleAddToCart = async () => {
    if (!userToken) {
      toast.error("Please login to add products to cart.");
      return;
    }
    
    setLoading(true);
    try {
      const cartData = {
  productId: product._id,
  quantity,
  size: selectedSize,
  color: selectedColor,
  customization: customizationMode
    ? {
        text: customText,
        font: customFont,
        position: customPosition,
        color: customColor,
        material: selectedMaterial,
        sizeDimensions: {
          length: customLength,
          width: customWidth,
          height: customHeight,
        },
        designImage: designImage ? designImage.name : null, // or upload separately
        message: customMessage,
        giftWrap: giftWrap,
      }
    : null,
};


      // Use provided handler or default API call
      if (onAddToCart && typeof onAddToCart === 'function') {
        await onAddToCart(cartData);
      } else if (apiEndpoints.addToCart) {
        const response = await fetch(apiEndpoints.addToCart, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(cartData),
        });
        
        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.message || "Failed to add to cart");
        }
      }
      
      toast.success("Item added to cart successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!userToken) {
      toast.error("Please login to add to wishlist.");
      return;
    }
    
    try {
      const wishlistData = { productId: product._id };
      
      if (onAddToWishlist && typeof onAddToWishlist === 'function') {
        await onAddToWishlist(wishlistData);
      } else if (apiEndpoints.addToWishlist) {
        const response = await fetch(apiEndpoints.addToWishlist, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(wishlistData),
        });
        
        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.message || "Failed to add to wishlist");
        }
      }
      
      toast.success(`${product.title} added to wishlist!`);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleBuyNow = () => {
    const purchaseData = {
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
      customization: customizationMode ? {
        text: customText,
        font: customFont,
        position: customPosition,
        color: customColor
      } : null
    };

    if (onBuyNow && typeof onBuyNow === 'function') {
      onBuyNow(purchaseData);
    } else {
      navigate(`/checkout/${product._id}`, { state: purchaseData });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: "Check out this amazing customizable product!",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Unable to share or copy link");
      }
    }
  };

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      toast.success("Delivery available in your area! Expected delivery: 2-3 days");
    } else {
      toast.error("Please enter a valid 6-digit pincode");
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const calculateTotalPrice = () => {
    let basePrice = product.price * quantity;
    if (customizationMode) {
      basePrice += 99; // Customization fee
    }
    return basePrice.toFixed(2);
  };

  const getCustomizationPreview = () => {
    if (!customizationMode || !customText) return null;
    
    const positionStyles = {
      top: "top-4",
      center: "top-1/2 transform -translate-y-1/2",
      bottom: "bottom-4"
    };

    return (
      <div className={`absolute left-1/2 transform -translate-x-1/2 ${positionStyles[customPosition]} z-10`}>
        <span 
          style={{ 
            fontFamily: customFont, 
            color: customColor,
            fontSize: '14px',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {customText}
        </span>
      </div>
    );
  };

  if (!product || !product._id) {
    return <div className="text-center py-20 text-red-500 text-xl">Product not found.</div>;
  }

  const specs = {
    Material: product.material || "Premium Quality",
    Size: product.size?.join(", ") || "Multiple Sizes",
    Weight: product.weight || "Lightweight",
    Color: product.color?.join(", ") || "Multiple Colors",
    Brand: product.brand || "Premium Brand",
    Category: product.category?.name || "Lifestyle"
  };

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const faqs = Array.isArray(product.faqs) ? product.faqs : [];

  return (
    <div className="min-h-screen w-full mt-3 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 px-4 sm:px-6 lg:px-12 py-5 space-y-10 font-sans">
      <div className="bg-white p-8 shadow-2xl rounded-xl border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Images Section */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row">
            <div className="flex flex-row lg:flex-col gap-3 justify-center lg:pr-4 mt-4 lg:mt-0">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedImage === i
                      ? "border-blue-500 scale-105 shadow-lg"
                      : "border-gray-300 hover:border-blue-400 hover:scale-105"
                  }`}
                >
                  <img src={img.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div
              className="relative w-full aspect-square overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200"
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => {
                setIsHoveringImage(false);
                setZoomPos({ x: "50%", y: "50%" });
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPos({ x: `${x}%`, y: `${y}%` });
              }}
            >
              <img
                src={product.images?.[selectedImage]?.url}
                alt={product.title}
                className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110"
                style={{ transformOrigin: `${zoomPos.x} ${zoomPos.y}` }}
              />
              {getCustomizationPreview()}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                In Stock
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Title and Description */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.title}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>
             {/* Rating */}
            <div className="flex items-center gap-3 p-4 ">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(product.ratings || 0) ? "text-yellow-300 fill-current" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {product.ratings || 0} ({reviews.length} reviews)
              </span>
            </div>
            {/* Price Section with Quantity */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-2  border border-green-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-green-600">₹{calculateTotalPrice()}</span>
                  <div className="text-sm text-gray-600">
                    <span>(₹{product.price} × {quantity})</span>
                    {customizationMode && <span className="text-blue-600 ml-2">+ ₹99 customization</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decrementQuantity}
                    className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
            {/* Wishlist and Share Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToWishlist}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
              >
                <Heart size={20} />
                Add to Wishlist
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                <Share2 size={20} />
                Share
              </button>
            </div>

           

            

            {/* Customization Section */}
            {enableCustomization && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-purple-800">Customize Your Product</h3>
                  <button
                    onClick={() => setCustomizationMode(!customizationMode)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      customizationMode
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {customizationMode ? "Enabled" : "Enable"}
                  </button>
                </div>
                
                {customizationMode && (
  <div className="space-y-6">
    {/* Material Option */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Material</label>
      <select
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        value={selectedMaterial}
        onChange={(e) => setSelectedMaterial(e.target.value)}
      >
        {["Bamboo", "Sheesham Wood", "Clay", "Jute"].map((material) => (
          <option key={material} value={material}>{material}</option>
        ))}
      </select>
    </div>

    {/* Custom Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Text / Name Personalization</label>
      <input
        type="text"
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg"
        placeholder="e.g., Happy Birthday, Raj"
        maxLength="30"
      />
    </div>
   {/* Size Selection with Predefined Options */}
<div className="space-y-4">
  <h3 className="text-lg font-semibold text-gray-800">Select Size</h3>
  <div className="flex flex-wrap gap-3">
    {["Small", "Medium", "Large", "Custom"].map((size) => (
      <button
        key={size}
        onClick={() => setSelectedSize(size)}
        className={`px-6 py-3 border-2 rounded-lg font-medium transition-all duration-300 ${
          selectedSize === size
            ? "bg-blue-600 text-white border-blue-600 scale-105"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        {size}
      </button>
    ))}
  </div>

  {/* Show dimensions input only if "Custom" selected */}
  {selectedSize === "Custom" && (
    <div className="grid grid-cols-3 gap-4 mt-3">
      <input
        type="text"
        placeholder="Length (cm)"
        value={customLength}
        onChange={(e) => setCustomLength(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        placeholder="Width (cm)"
        value={customWidth}
        onChange={(e) => setCustomWidth(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        placeholder="Height (cm)"
        value={customHeight}
        onChange={(e) => setCustomHeight(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg"
      />
    </div>
  )}
</div>

{/* Design / Pattern Upload Section */}
<div className="mt-6 space-y-3">
  <h3 className="text-lg font-semibold text-gray-800">Upload Design / Pattern</h3>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setDesignImage(e.target.files[0])}
    className="p-3 border border-gray-300 rounded-lg"
  />

  {/* Preview Uploaded Design Image */}
  {designImage && (
    <div className="mt-3">
      <img
        src={URL.createObjectURL(designImage)}
        alt="Uploaded Design"
        className="max-h-40 rounded-lg border border-gray-300 object-contain"
      />
    </div>
  )}
</div>
    {/* Message to Vendor */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Message / Instructions for Vendor</label>
      <textarea
        rows="4"
        value={customMessage}
        onChange={(e) => setCustomMessage(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg"
        placeholder="Any special requests or instructions"
      ></textarea>
    </div>

    {/* Gift Wrapping */}
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={giftWrap}
        onChange={(e) => setGiftWrap(e.target.checked)}
        className="h-5 w-5 text-purple-600"
      />
      <label className="text-sm text-gray-700 font-medium">Include gift wrapping (₹49 extra)</label>
    </div>
  </div>
)}

              </div>
            )}

            {/* Size and Color Selection */}
            <div className="space-y-6">
              {/* Size Selection */}
              {product.size && product.size.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Available Sizes:</h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.size.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border-2 rounded-lg font-medium transition-all duration-300 ${
                          selectedSize === size
                            ? "bg-blue-600 text-white border-blue-600 scale-105"
                            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Selected: <span className="font-semibold">{selectedSize}</span></p>
                </div>
              )}

              {/* Color Selection */}
              {product.color && product.color.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Available Colors:</h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.color.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 border-2 rounded-lg font-medium transition-all duration-300 ${
                          selectedColor === color
                            ? "bg-blue-600 text-white border-blue-600 scale-105"
                            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Selected: <span className="font-semibold">{selectedColor}</span></p>
                </div>
              )}
            </div>

            {/* Stock and Pincode */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-semibold">In Stock</span>
                <span className="text-gray-500">(23 items left)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-36 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength="6"
                />
                <button
                  onClick={handlePincodeCheck}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
                >
                  Check
                </button>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 mt-6">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className={`w-full/2 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl"
              }`}
            >
              <ShoppingCart size={24} />
              {loading ? "Adding to Cart..." : "Add to Cart"}
            </button>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full/2 py-4 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Zap size={24} />
              Buy Now
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white p-8 shadow-2xl rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          {["description", "features", "specifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-semibold text-lg capitalize transition-all duration-300 ${
                activeTab === tab
                  ? "border-b-3 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === "description" && (
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-lg text-gray-900">Key Benefits:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      🎁 Special combo offers available
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      🚚 Free delivery across India
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ✨ Premium quality materials
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      💬 24/7 customer support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      📦 Secure packaging guaranteed
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-lg text-gray-900">What Makes Us Special:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      🌱 Eco-friendly manufacturing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      🎨 Customization options
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      🏆 Award-winning design
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      🔒 Quality guarantee
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                               const Icon = LucideIcons[feature.icon] || LucideIcons.HelpCircle;
                return (
                  <div key={i} className="p-6 border rounded-xl bg-gray-50 hover:shadow-lg transition duration-300">
                    <Icon size={28} className="text-blue-600 mb-3" />
                    <h4 className="text-lg font-semibold text-gray-800">{feature.title}</h4>
                    <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="grid md:grid-cols-2 gap-6 text-gray-800 text-md leading-7">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-semibold">{key}:</span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAQs Section */}
      {faqs.length > 0 && (
        <div className="bg-white p-8 shadow-2xl rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h4 className="font-semibold text-blue-600">{faq.question}</h4>
                <p className="text-gray-700 mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="bg-white p-8 shadow-2xl rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={18}
                      className={j < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="bg-white p-8 shadow-2xl rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="cursor-pointer border rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 bg-gray-50"
              >
                <img
                  src={item.images?.[0]?.url}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-md font-semibold text-gray-800 truncate">{item.title}</h4>
                  <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomProductPage;
