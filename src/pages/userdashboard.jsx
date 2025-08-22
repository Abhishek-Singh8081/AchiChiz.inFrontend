import React, { useState, useEffect, useContext } from "react";
import {
  User,
  Home,
  MapPin,
  ShoppingBag,
  Heart,
  Menu,
  X as CloseIcon,
  LogOut,
} from "lucide-react";

import AddressBook from "../components/addressbook";
import Wishlist from "../pages/Favpage";
import MyOrders from "../components/myOrder";
import AccountInformation from "../components/accountInfo";
import AccountDashboard from "../components/accountdashboard";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../data/allapi";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [section, setSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userdata, setUserdata] = useState(null);
  const { usertoken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!usertoken) return;
      try {
        const response = await fetch(auth.GET_USER_PROFILE, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${usertoken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserdata(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [usertoken]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarItems = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "info", label: "Account Info", icon: User },
    { key: "address", label: "Address Book", icon: MapPin },
    { key: "orders", label: "My Orders", icon: ShoppingBag },
    { key: "wishlist", label: "Wishlist", icon: Heart },
  ];

  const handleLogout = () => {
    navigate("/logout");
  };

  if (!userdata) {
    return <div className="text-center py-20 text-lg font-semibold text-gray-600">Loading user data...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col bg-[#e0e5ec] dark:bg-[#1e1e1e] transition-all">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex justify-between items-center px-4 py-4 bg-[#e0e5ec] dark:bg-[#1e1e1e] shadow-md">
          <h1 className="text-xl font-bold text-indigo-700 dark:text-white">My Dashboard</h1>
          <button className="p-2 rounded-md bg-indigo-600 text-white" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex flex-col w-72 bg-[#e0e5ec] dark:bg-[#1e1e1e] border-r border-gray-300 dark:border-gray-800 shadow-lg p-6 justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-3 mb-6">
              {userdata.image && (
                <img src={userdata.image} alt="User" className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700" />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{userdata.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{userdata.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSection(item.key)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium transition-all shadow-sm ${
                    section === item.key
                      ? "bg-indigo-600 text-white"
                      : "bg-[#e0e5ec] text-gray-800 dark:bg-[#1e1e1e] dark:text-white hover:shadow-inner"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-500 hover:text-white rounded-md shadow"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Sidebar for Mobile */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-72 bg-[#e0e5ec] dark:bg-[#1e1e1e] border-r border-gray-300 dark:border-gray-800 shadow-lg p-6 transition-transform duration-300 flex flex-col justify-between md:hidden`}
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              {userdata.image && (
                <img src={userdata.image} alt="User" className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{userdata.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{userdata.email}</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="ml-auto">
                <CloseIcon className="text-gray-600 dark:text-white" />
              </button>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setSection(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium transition-all shadow-sm ${
                    section === item.key
                      ? "bg-indigo-600 text-white"
                      : "bg-[#e0e5ec] text-gray-800 dark:bg-[#1e1e1e] dark:text-white hover:shadow-inner"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-500 hover:text-white rounded-md shadow"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10">
          <div className="bg-[#f1f3f6] dark:bg-[#2a2a2a] rounded-xl shadow-[8px_8px_15px_#c1c9d6,-8px_-8px_15px_#ffffff] dark:shadow-[8px_8px_15px_#1a1a1a,-8px_-8px_15px_#2a2a2a] p-6 md:p-10">
            {section === "info" && <AccountInformation />}
            {section === "dashboard" && <AccountDashboard />}
            {section === "address" && (
              <>
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">Address Book</h2>
                <AddressBook />
              </>
            )}
            {section === "orders" && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="text-indigo-800 dark:text-white" />
                  <h2 className="text-2xl font-bold text-indigo-800 dark:text-white">My Orders</h2>
                </div>
                <MyOrders />
              </>
            )}
            {section === "wishlist" && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="text-indigo-800 dark:text-white" />
                  <h2 className="text-2xl font-bold text-indigo-800 dark:text-white">My Wishlist</h2>
                </div>
                <Wishlist />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
