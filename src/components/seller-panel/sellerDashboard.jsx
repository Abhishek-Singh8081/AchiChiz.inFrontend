import React, { useState } from "react";
import EarningsOverview from "./Earnings/EarningOverview";
import PayoutHistory from "./Earnings/PayoutHistory";
import OrderList from "./OrderManagement/OrderList";
import OrderDetails from "./OrderManagement/OrderDetails";
import ProductList from "./ProductManagement/ProductList";
import AddProductForm from "./ProductManagement/AddProductForm";
import EditProductForm from "./ProductManagement/EditProductForm";
import TrendingProductsForm from "./ProductManagement/TrendingProductsForm";

const TABS = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Earnings Overview", value: "earnings" },
  { label: "Payout History", value: "payouts" },
  { label: "Orders", value: "orders" },
  { label: "Order Details", value: "orderDetails" },
  { label: "Products", value: "products" },
  { label: "Add Product", value: "addProduct" },
  { label: "Edit Product", value: "editProduct" },
  { label: "Trending Products", value: "trendingProducts" },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - no overlay, just slides in/out */}
      <div
        className={`fixed z-30 inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out w-64 bg-white shadow-lg md:shadow-none md:block`}
        style={{ pointerEvents: sidebarOpen || window.innerWidth >= 768 ? 'auto' : 'none' }}
      >
        <div className="flex items-center justify-between md:justify-center p-4 border-b">
          <span className="text-xl font-bold">Seller Panel</span>
          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                activeTab === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100"
              }`}
              onClick={() => {
                setActiveTab(tab.value);
                setSidebarOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      {/* Hamburger for mobile - improved style */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:bg-blue-50 transition-colors"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
        style={{ outline: 'none' }}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Main content */}
      <div className="flex-1 p-6 md:ml-64">
        <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-xl font-semibold">Total Products</h2>
              <p className="text-3xl font-bold mt-2">12</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-xl font-semibold">Total Orders</h2>
              <p className="text-3xl font-bold mt-2">43</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-xl font-semibold">Total Earnings</h2>
              <p className="text-3xl font-bold mt-2 text-green-600">₹7580</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
              <p className="text-3xl font-bold mt-2 text-red-600">2</p>
            </div>
          </div>
        )}
        {activeTab === "earnings" && <EarningsOverview />}
        {activeTab === "payouts" && <PayoutHistory />}
        {activeTab === "orders" && <OrderList />}
        {activeTab === "orderDetails" && <OrderDetails />}
        {activeTab === "products" && <ProductList />}
        {activeTab === "addProduct" && <AddProductForm />}
        {activeTab === "editProduct" && <EditProductForm />}
        {activeTab === "trendingProducts" && <TrendingProductsForm />}
      </div>
    </div>
  );
};

export default SellerDashboard;
