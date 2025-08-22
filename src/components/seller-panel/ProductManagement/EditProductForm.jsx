import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditProductForm = () => {
  const { productId } = useParams();

  // Dummy existing product (simulate fetching from backend)
  const dummyProduct = {
    id: productId,
    name: "Handmade Pottery Vase",
    price: 499,
    stock: 10,
    description: "A beautifully crafted clay vase.",
    image: "https://via.placeholder.com/100",
  };

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    // Simulate loading product data
    setFormData(dummyProduct);
  }, [productId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Product:", formData);
    // TODO: Send PUT request to backend
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-lg"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="image"
          type="text"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;
