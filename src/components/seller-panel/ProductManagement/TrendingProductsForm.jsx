import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Search, Plus, X, Star } from "lucide-react";
import { product as productAPI } from "../../../data/allapi";

const TrendingProductsForm = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Fetch all products and trending products on component mount
  useEffect(() => {
    fetchAllProducts();
    fetchTrendingProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(productAPI.APPROVED_PRODUCTS_FOR_HOME);
      const { data } = await response.json();
      
      if (response.ok) {
        const validData = Array.isArray(data) ? data : data?.products || [];
        setAllProducts(validData);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingProducts = async () => {
    try {
      const response = await fetch(productAPI.GET_TRENDING_PRODUCTS);
      const { data } = await response.json();
      
      if (response.ok) {
        setTrendingProducts(data || []);
      }
    } catch (error) {
      console.error("Error fetching trending products:", error);
    }
  };

  const addToTrending = async (productId) => {
    try {
      const response = await fetch(productAPI.ADD_TO_TRENDING, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        toast.success("Product added to trending successfully!");
        fetchTrendingProducts(); // Refresh the trending products list
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add to trending");
      }
    } catch (error) {
      console.error("Error adding to trending:", error);
      toast.error("Failed to add to trending");
    }
  };

  const removeFromTrending = async (productId) => {
    try {
      const response = await fetch(`${productAPI.REMOVE_FROM_TRENDING}/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product removed from trending successfully!");
        fetchTrendingProducts(); // Refresh the trending products list
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to remove from trending");
      }
    } catch (error) {
      console.error("Error removing from trending:", error);
      toast.error("Failed to remove from trending");
    }
  };

  const isProductTrending = (productId) => {
    return trendingProducts.some(product => product._id === productId);
  };

  const filteredProducts = allProducts.filter(product =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.artisan?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.subCategory?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Trending Products Management</h1>
          <p className="text-gray-600">Manage which products appear in the trending section on the homepage</p>
        </div>

        {/* Current Trending Products */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            Current Trending Products ({trendingProducts.length})
          </h2>
          
          {trendingProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No trending products added yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingProducts.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">{product.title}</h3>
                        <p className="text-sm text-gray-500">₹{product.price}</p>
                        <p className="text-xs text-gray-400">by {product.artisan?.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromTrending(product._id)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                      title="Remove from trending"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Products to Trending */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Products to Trending</h2>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name, artisan, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const isTrending = isProductTrending(product._id);
                
                return (
                  <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">{product.title}</h3>
                          <p className="text-sm text-gray-500">₹{product.price}</p>
                          <p className="text-xs text-gray-400">by {product.artisan?.name}</p>
                          <p className="text-xs text-gray-400">{product.subCategory?.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => isTrending ? removeFromTrending(product._id) : addToTrending(product._id)}
                        disabled={isTrending}
                        className={`ml-2 p-2 rounded-full transition ${
                          isTrending
                            ? "bg-green-100 text-green-600 cursor-not-allowed"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                        title={isTrending ? "Already trending" : "Add to trending"}
                      >
                        {isTrending ? <Star size={16} fill="currentColor" /> : <Plus size={16} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? "No products found matching your search" : "No products available"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingProductsForm; 