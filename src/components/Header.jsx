import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import AuthPage from "../components/Auth/Authpage";
import { product } from "../data/allapi";
import { path } from "framer-motion/client";

const navItems = [
  { title: "HOME", path: "/" },
  { title: "SHOP", path: "/category" },
  { title: "CUSTOMIZE PRODUCTS", path: "/customize-category" },
  { title: "BLOG", path: "/blog" },
  { title: "PAGE", path: "/about-us" },
  {title: "MY CUSTOMIZATION" , path : "/mycustomization"}
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { logout, userdata, usertoken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const firstLetter = userdata?.name?.charAt(0)?.toUpperCase() || "U";
  const isLoggedIn = !!usertoken;

  useEffect(() => {
    if (searchOpen && allProducts.length === 0) {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(product.GET_ALL_PRODUCT);
          const data = await res.json();
          const products = Array.isArray(data?.data) ? data.data : [];
          setAllProducts(products);
        } catch (err) {
          console.error("Product fetch error:", err);
          setAllProducts([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [searchOpen, allProducts.length]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredProducts(
        allProducts.filter((p) =>
          p.title?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setSearchOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const toggleSearchBar = () => {
    setMobileOpen(false);
    if (searchOpen) {
      setSearchOpen(false);
    } else {
      if (window.scrollY === 0) {
        setSearchOpen(true);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setSearchOpen(true), 400);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/logout");
  };

  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[60] bg-black text-white text-center text-sm py-1">
        🎉 Free shipping on orders over ₹999!
      </div>

      <nav className={`fixed top-[28px] w-full z-50 px-4 sm:px-6 py-3 h-[80px] flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-[#fff2eb] text-black shadow-md border-b border-black/10" : "bg-white/5 backdrop-blur-[99%] text-white border-b border-white/20"}`}>
        <div className="text-xl sm:text-2xl font-bold tracking-wide">
          <NavLink to="/">ACHICHIZ.</NavLink>
        </div>

        <ul className="hidden lg:flex items-center gap-8 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `uppercase text-sm font-bold transition duration-300 ${
                    isActive ? "text-[#fe5f55]" : "hover:text-[#fe5f55]"
                  }`
                }
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4 text-lg">
          <FiSearch onClick={toggleSearchBar} className="cursor-pointer hover:text-[#915c50]" />
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold cursor-pointer"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                {firstLetter}
              </div>
              {profileOpen && (
                <div
                  className="absolute top-10 right-0 bg-[#cfbd8c] shadow-md border p-3 w-40 rounded-md z-50 text-black"
                  onMouseDown={e => e.stopPropagation()}
                >
                  <NavLink to="/dashboard" className="block text-sm hover:text-[#fe5f55] mb-2" onClick={() => setProfileOpen(false)}>Profile</NavLink>
                  <NavLink to="/order-page" className="text-sm hover:text-[#fe5f55]" onClick={() => setProfileOpen(false)}>Orders</NavLink>
                  <div onClick={handleLogout} className="text-sm hover:text-[#fe5f55] cursor-pointer">Logout</div>
                </div>
              )}
            </div>
          ) : (
            <FiUser className="cursor-pointer hover:text-[#fe5f55]" onClick={() => setShowLoginModal(true)} />
          )}

          <div onClick={() => handleProtectedClick("/favoritespage")} className="relative cursor-pointer">
            <FiHeart className="hover:text-[#fe5f55]" />
            {userdata?.addtowishlist?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#fe4134] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {userdata.addtowishlist.length}
              </span>
            )}
          </div>

          <div onClick={() => handleProtectedClick("/cartpage")} className="relative cursor-pointer">
            <FiShoppingCart className="hover:text-red-500" />
            {userdata?.addtocart?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#fe4134] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {userdata.addtocart.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex lg:hidden items-center gap-4 text-2xl">
          <FiSearch onClick={toggleSearchBar} className="cursor-pointer hover:text-[#fe5f55]" />
          <div onClick={() => setMobileOpen((prev) => !prev)} className="cursor-pointer">
            {mobileOpen ? <FiX /> : <FiMenu />}
          </div>
        </div>
      </nav>

    <div className={`lg:hidden fixed top-0 right-0 h-full w-4/5 max-w-xs bg-[#cfbd8c] text-black shadow-xl z-[999] transform ${mobileOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-500 ease-in-out`}>
        <div className="flex justify-between items-center p-4 border-b">
          <div className="text-xl font-bold">ACHICHIZ.</div>
          <FiX className="text-2xl cursor-pointer" onClick={() => setMobileOpen(false)} />
        </div>

        <ul className="flex flex-col gap-4 p-6">
          {navItems.map((item) => (
            <li key={item.title}>
              <NavLink to={item.path} className="text-lg font-medium hover:text-orange-500" onClick={() => setMobileOpen(false)}>
                {item.title}
              </NavLink>
            </li>
          ))}

          {isLoggedIn ? (
            <div className="mt-4 space-y-2" ref={profileRef}>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold">
                  {firstLetter}
                </div>
                <div className="text-sm font-medium">{userdata?.name || "User"}</div>
              </div>
              {profileOpen && (
                <div className="mt-2 space-y-2">
                  <NavLink to="/dashboard" className="block text-sm hover:text-[#fe5f55]" onClick={() => { setMobileOpen(false); setProfileOpen(false); }}>Profile</NavLink>
                  <NavLink to="/order-page" className="block text-sm hover:text-[#fe5f55]" onClick={() => { setMobileOpen(false); setProfileOpen(false); }}>Orders</NavLink>
                  <div onClick={handleLogout} className="text-sm hover:text-[#fe5f55] cursor-pointer">Logout</div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 text-sm text-blue-600 underline cursor-pointer" onClick={() => { setShowLoginModal(true); setMobileOpen(false); }}>
              Login / Sign Up
            </div>
          )}

          <div className="flex gap-6 text-xl mt-6">
            <FiSearch onClick={toggleSearchBar} className="cursor-pointer" />
            <FiHeart onClick={() => handleProtectedClick("/favoritespage")} className="cursor-pointer" />
            <FiShoppingCart onClick={() => handleProtectedClick("/cartpage")} className="cursor-pointer" />
          </div>
        </ul>
      </div>

      {searchOpen && (
        <div ref={searchRef} className="fixed top-[110px] left-1/2 -translate-x-1/2 transform z-40 w-full max-w-md px-4 sm:px-6">
          <div className="rounded-md shadow-md border border-gray-300 bg-white/90 backdrop-blur-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, categories..."
              className="w-full p-3 outline-none rounded-t-md text-gray-800"
              autoFocus
            />
            {isLoading ? (
              <div className="px-4 py-2 text-center text-gray-500">Loading products...</div>
            ) : filteredProducts.length === 0 && searchQuery ? (
              <div className="px-4 py-2 text-center text-gray-500">No products found.</div>
            ) : (
              <ul className="max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <li
                    key={product._id}
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#cfbd8c]"
                  >
                    <img src={product.images?.[0]?.url} alt={product.title} className="w-10 h-10 object-cover rounded" />
                    {product.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/20 backdrop-blur-md">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl">×</button>
            <AuthPage onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 