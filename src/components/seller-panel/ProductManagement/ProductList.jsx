import React from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  // Dummy products (replace with real API later)
  const products = [
    {
      id: 1,
      name: "Handmade Pottery Vase",
      price: 499,
      stock: 10,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Woolen Scarf",
      price: 799,
      stock: 5,
      image: "https://via.placeholder.com/100",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Products</h1>
        <Link
          to="/seller/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Product
        </Link>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">₹{product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/seller/products/edit/${product.id}`}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </Link>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
