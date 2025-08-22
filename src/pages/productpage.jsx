import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Heart, Share2, Plus, Minus, MapPin, Star } from "lucide-react";
import HoverReview from "../components/card"; // Assuming these components exist
import ProductCard from "../components/ProductCard"; // Assuming these components exist
import toast from "react-hot-toast"; // Assuming react-hot-toast is installed
import { product as api, product } from "../data/allapi"; // Assuming this path and structure are correct
import { AuthContext } from "../context/AuthContext"; // Assuming this context exists

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usertoken, quantity, setQuantity } = useContext(AuthContext);

  const [products, setProducts] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: "50%", y: "50%" });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [pincode, setPincode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [customizationMode, setCustomizationMode] = useState(false);
  const intervalRef = useRef(null);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [customText, setCustomText] = useState("");
  const [customLength, setCustomLength] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [designImage, setDesignImage] = useState(null);
  const { customMessage, setCustomMessage } = useContext(AuthContext)
  const [giftWrap, setGiftWrap] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  
useEffect(() => {
  if (!products?.variants || Object.keys(selectedOptions).length === 0) {
    setSelectedVariant(null);
    return;
  }

  const matched = products.variants.find((variant) => {
    const attrMap = {};
    variant.attributes.forEach(attr => attrMap[attr.groupName] = attr.value);

    // Check if all selected options match this variant's attributes
    return Object.entries(selectedOptions).every(
      ([group, value]) => attrMap[group] === value
    );
  });

  setSelectedVariant(matched || null);
}, [selectedOptions, products?.variants]);


  // const [customMessage, setCustomMessage] = useState('');


  // `enableCustomization` now directly depends on `products.isFeatured`
  // It's not a state that can be toggled independently, but rather a derived value.
  // We'll use `products?.isFeatured` directly in the JSX for conditional rendering.

  const features = [
    { icon: "Leaf", title: "Eco-friendly Bamboo" },
    { icon: "Hand", title: "100% Handmade" },
    { icon: "Flag", title: "Made in India" },
    { icon: "CheckCircle", title: "Artisan Certified" },
    { icon: "Layout", title: "Minimal & Modern Design" },
  ];

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProducts(null);
        const res = await fetch(`${product.GET_SINGLE_PRODUCT}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const response = await res.json();
        setProducts(response.data);
        // Set default selections
        if (response.data.size?.length > 0)
          setSelectedSize(response.data.size[0]);
        if (response.data.color?.length > 0)
          setSelectedColor(response.data.color[0]);
      } catch (error) {
        console.error(error);
        setProducts(null);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch all products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(product.GET_ALL_PRODUCT);
        if (!res.ok) throw new Error("Failed to fetch all products");
        const response = await res.json();
        console.log(response)
        setAllProducts(response.data || []);
      } catch (error) {
        console.error(error);
        setAllProducts([]);
      }
    };

    fetchAllProducts();
  }, []);

  // Related Products Logic
  useEffect(() => {
    if (products && allProducts.length > 0) {
      const related = allProducts
        .filter((p) => {
          const sameCategory = p.category?._id === products.category?._id;
          const sameSubCategory =
            p.subCategory?._id === products.subCategory?._id;
          const hasCommonTags = p.tags?.some((tag) =>
            products.tags?.includes(tag)
          );
          return (
            (sameCategory || sameSubCategory || hasCommonTags) &&
            p._id !== products._id
          );
        })
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      setRelatedProducts([]);
    }
  }, [products, allProducts]);

  // Image Auto Slide
  useEffect(() => {
    if (!isHoveringImage && products?.images?.length > 0) {
      intervalRef.current = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % products.images.length);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHoveringImage, products?.images?.length]);

  const handleAddToCart = async () => {
    if (!usertoken) {
      toast.error("Please login to add products to cart.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${api.ADD_TO_CART}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usertoken}`,
        },
        body: JSON.stringify({
          quantity: quantity,
          size: selectedSize,
          color: selectedColor,
          // Include customization details if customizationMode is enabled
          ...(customizationMode && {
            customization: {
              material: selectedMaterial,
              text: customText,
              length: customLength,
              width: customWidth,
              height: customHeight,
              // Note: designImage would need to be uploaded to a storage service
              // and its URL passed here, not the File object directly.
              // For this example, we'll just pass a placeholder or null.
              designImageUrl: designImage ? "uploaded_design_url_placeholder" : null,
              message: customMessage,
              giftWrap: giftWrap,
            }
          })
        }),
      });
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || "Failed to add to cart");
      }
      toast.success("Item added to cart successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!usertoken) {
      toast.error("Please login to add to wishlist.");
      return;
    }
    try {
      const response = await fetch(`${api.ADD_TO_WISHLIST}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usertoken}`,
        },
        body: JSON.stringify({ productId: products._id }),
      });
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || "Failed to add to wishlist");
      }
      toast.success(`${products.title} added to wishlist!`);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: products.title,
          text: "Check out this amazing product!",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback for browsers that don't support Web Share API
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
      toast.success("Delivery available in your area!");
    } else {
      toast.error("Please enter a valid 6-digit pincode");
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

const calculateTotalPrice = () => {
  const basePrice = selectedVariant?.discountedPrice || selectedVariant?.price || products.discountedPrice;
  let price = basePrice * quantity;
  if (customizationMode && giftWrap) price += 49;
  return price.toFixed(2);
};

  if (products === null) {
    return (
      <div className="text-center py-20 text-gray-700 text-xl">Loading...</div>
    );
  }

  if (!products || !products._id) {
    return (
      <div className="text-center py-20 text-red-500 text-xl">
        Product not found.
      </div>
    );
  }

  const specs = {
    Material: products.material || "N/A",
    Size: products.size?.join(", ") || "N/A",
    Weight: products.weight || "N/A",
    Color: products.color?.join(", ") || "N/A",
    Brand: products.brand || "N/A",
    Category: products.category?.name || "N/A",
  };

  const reviews = Array.isArray(products.reviews) ? products.reviews : [];
  const ratingData = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return {
      stars,
      percentage: reviews.length
        ? Math.round((count / reviews.length) * 100)
        : 0,
    };
  });

  const faqs = Array.isArray(products.faqs) ? products.faqs : [];
  const productImages = products.images || [];

const variantImages = (products.variants || [])
  .map(v => v.images?.[0])
  .filter(Boolean); // valid images only

const seenUrls = new Set();
const combinedImages = [...productImages, ...variantImages].filter(img => {
  if (!img?.url || seenUrls.has(img.url)) return false;
  seenUrls.add(img.url);
  return true;
});
const selectedVariantDetails = (() => {
  if (selectedVariant) {
    const attributes = selectedVariant.attributes?.reduce((acc, attr) => {
      acc[attr.groupName] = attr.value;
      return acc;
    }, {});

    return {
      id: selectedVariant._id,
      attributes,
      price: selectedVariant.price,
      discountedPrice: selectedVariant.discountedPrice,
      images: selectedVariant.images?.length > 0 ? selectedVariant.images : (products.images || []),
    };
  }

  // Fallback: Base product
  return {
    id: products._id,
    attributes: {},
    price: products.price,
    discountedPrice: products.discountedPrice,
    images: products.images || [],
  };
})();











  return (
    <div className="min-h-screen w-full mt-3 bg-white text-[#1e1e1e] px-4 sm:px-6 lg:px-12 py-5 space-y-10 font-sans">
      <div className="bg-white p-6 shadow-xl rounded-lg">
        <div className="flex flex-col lg:flex-row  gap-10">
          {/* Images Section */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Image Section */}
            <div className="w-full  lg:w-1/2">
              <div className="flex flex-col-reverse lg:sticky lg:h-[120vh] lg:flex-row overflow-hidden">
                {/* Thumbnails */}
                <div className="flex flex-row lg:flex-col gap-2 justify-center lg:pr-4 mt-4 lg:mt-0 max-h-[calc(80vh-1rem)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                 {combinedImages.map((img, i) => (
  <button
    key={i}
    onClick={() => setSelectedImage(i)}
    className={`w-14 h-16 border-2 rounded ${
      selectedImage === i
        ? "border-blue-600 scale-105"
        : "border-gray-300 hover:border-blue-400"
    } transition`}
  >
    <img
      src={img.url}
      alt={`thumb-${i}`}
      className="w-full h-full object-cover rounded"
    />
  </button>
))}

                </div>

                {/* Main Image */}
                <div
                  className="relative w-full aspect-square overflow-hidden rounded-lg shadow-lg"
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
  src={combinedImages[selectedImage]?.url}
  alt={products.title}
  className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-110"
  style={{ transformOrigin: `${zoomPos.x} ${zoomPos.y}` }}
/>

                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              {/* Title and Description */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {products.title}
                </h1>
                <p className="text-gray-600 text-justify text-sm leading-relaxed">
                  {products.description}
                </p>
              </div>

              {/* Wishlist and Share Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToWishlist}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:text-red-600 hover:border-red-300 transition"
                >
                  <Heart size={18} />
                  Add to Wishlist
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:text-blue-600 hover:border-blue-300 transition"
                >
                  <Share2 size={18} />
                  Share
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.round(products.ratings || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {products.ratings || 0} ({reviews.length} reviews)
                </span>

                {/* See all reviews button */}
                <NavLink
                  to={`/reviews/${id}`}
                  className="text-blue-600 text-sm underline ml-2 hover:text-blue-800"
                >
                  See all reviews
                </NavLink>
              </div>

              {/* Price Section with Quantity */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Price Display */}
                  <div className="text-center sm:text-left">
                   <span className="text-3xl font-bold text-green-600 block">
  ₹{calculateTotalPrice()}
</span>




                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={decrementQuantity}
                      className="p-2 border rounded-lg hover:bg-gray-100 transition"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-2 border rounded-lg hover:bg-gray-100 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Customization Section - Only visible if products.isFeatured is true */}
              {products.isFeatured && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 shadow">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">
                    Customize Your Product
                  </h3>

                  <label className="block text-gray-700 font-medium mb-2" htmlFor="customMessage">
                    Add your personal message:
                  </label>
                  <textarea
                    id="customMessage"
                    name="customMessage"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>
              )}



              {/* Size and Color Selection (Original, non-customization related) */}
              {/* This block remains for products that are not featured or don't require customization */}
              <div className="space-y-4">
                {/* Size Selection */}
  {/* Variant Selection Section */}
{Array.isArray(products?.variants) && products.variants.length > 0 && (
  <div className="space-y-6">
    {(() => {
      const groups = {};
      products.variants.forEach((variant) => {
        if (Array.isArray(variant.attributes)) {
          variant.attributes.forEach((attr) => {
            if (attr?.groupName && attr?.value) {
              if (!groups[attr.groupName]) groups[attr.groupName] = new Set();
              groups[attr.groupName].add(attr.value);
            }
          });
        }
      });

      if (Object.keys(groups).length === 0) return null;

      return Object.entries(groups).map(([groupName, values]) => (
        <div key={groupName}>
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            {groupName}
          </h3>
          <div className="flex flex-wrap gap-3">
            {[...values].map((value) => {
              const isSelected = selectedOptions[groupName] === value;

              return (
                <button
                  key={value}
                  onClick={() =>
                    setSelectedOptions((prev) => {
                      const isAlreadySelected = prev[groupName] === value;
                      if (isAlreadySelected) {
                        const updated = { ...prev };
                        delete updated[groupName];
                        return updated;
                      }
                      return { ...prev, [groupName]: value };
                    })
                  }
                  className={`min-w-[60px] px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 shadow-sm focus:outline-none
                    ${
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100 hover:border-blue-500 hover:text-blue-700'
                    }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ));
    })()}
  </div>
)}






                {/* Color Selection */}
                {/* {products.color && products.color.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Available Colors:
                    </h3>
                    <div className="flex gap-2">
                      {products.color.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border rounded-lg transition ${selectedColor === color
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:border-blue-400"
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedColor}
                    </p>
                  </div>
                )} */}
              </div>

              {/* Stock and Pincode */}
<div className="text-sm">
  {!selectedVariant ? (
    Object.keys(selectedOptions).length > 0 ? (
      <span className="text-red-600 font-semibold">
        No stock available
      </span>
    ) : (
      <span className="text-green-600 font-semibold">
        In Stock: {products.stock}
      </span>
    )
  ) : selectedVariant.stock > 0 ? (
    <span className="text-green-600 font-semibold">
      In Stock: {selectedVariant.stock}
    </span>
  ) : (
    <span className="text-red-600 font-semibold">
      No stock available
    </span>
  )}
</div>



              <div className="flex gap-4">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className={`flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${loading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:scale-105 hover:shadow-lg"
                    }`}
                >
                  {loading ? "Adding..." : "Add to Cart"}
                </button>

                {/* Buy Now */}
                <div className="text-sm">
  {!selectedVariant ? (
    Object.keys(selectedOptions).length > 0 ? (
       <button
                  
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-300 to-blue-300 text-white font-bold rounded-lg text-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Buy Now
                </button>
    ) : (
      <button
                  onClick={() =>
                    navigate(`/checkout/${id}`, {
                      state: {
                        product: products,
                        selectedVariantDetails,
    quantity,
    selectedOptions, // ✅ This includes dynamic keys/values
                      },
                    })
                  }
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg text-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Buy Now
                </button>
    )
  ) : selectedVariant.stock > 0 ? (
   <button
                  onClick={() =>
                    navigate(`/checkout/${id}`, {
                      state: {
                        product: products,
                        selectedVariantDetails,
    quantity,
    selectedOptions, // ✅ This includes dynamic keys/values
                      },
                    })
                  }
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg text-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Buy Now
                </button>
  ) : (
   <button
                  
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-300 to-blue-300 text-white font-bold rounded-lg text-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Buy Now
                </button>
  )}
</div>
                {/* <button
                  onClick={() =>
                    navigate(`/checkout/${id}`, {
                      state: {
                        product: products,
    quantity,
    selectedOptions, // ✅ This includes dynamic keys/values
                      },
                    })
                  }
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg text-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Buy Now
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white p-4 sm:p-6 md:p-8 my-10 shadow-2xl rounded-xl border border-gray-200">
          {/* Tab Buttons */}
          <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
            {["description", "features", "specifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-3 sm:px-6 py-3 text-sm sm:text-base font-semibold capitalize transition-all duration-300 whitespace-nowrap ${activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6 sm:mt-8">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="space-y-6">
                <p className="text-gray-700 text-justify leading-relaxed text-base sm:text-lg">
                  {products.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Key Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-base sm:text-lg text-gray-900">
                      Key Benefits:
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                      {[
                        "🎁 Special combo offers available",
                        "🚚 free shipping on orders over ₹999",
                        "✨ Premium quality materials",
                        "💬 24/7 customer support",
                        "📦 Secure packaging guaranteed",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What Makes Us Special */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-base sm:text-lg text-gray-900">
                      What Makes Us Special:
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                      {[
                        "🌱 Eco-friendly manufacturing",
                        "🎨 Customization options",
                        "🏆 Award-winning design",
                        "🔒 Quality guarantee",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === "features" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, i) => {
                  const Icon =
                    LucideIcons[feature.icon] || LucideIcons.HelpCircle;
                  return (
                    <div
                      key={i}
                      className="p-2 sm:p-3 border rounded-xl bg-gray-50 hover:shadow-lg transition duration-300"
                    >
                      <Icon size={28} className="text-blue-600 mb-2" />
                      <h4 className="text-base font-semibold text-gray-800">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-2">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-800 text-sm sm:text-base leading-6">
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

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="bg-white p-6 shadow-xl rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q: {faq.question}
                  </h3>
                  <p className="text-gray-700">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="space-y-6 border-y-2 py-3 mt-10">
          <h2 className="text-2xl font-bold text-[#0f2c5c]">
            Related Products
          </h2>

          {/* Mobile: horizontal scroll | Desktop: grid */}
          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible scroll-smooth scrollbar-hide">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((product) => (
                <div key={product._id} className="min-w-[250px] md:min-w-0">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="text-gray-400">No related products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;