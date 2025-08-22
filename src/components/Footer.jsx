import React, { useState, useEffect } from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaApplePay,
} from "react-icons/fa";
import { SiKlarna } from "react-icons/si";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { product } from "../data/allapi"; // 👈 Make sure this has GET_SETTINGS_INFO

const Footer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState("");
  const [setting, setSetting] = useState(null);

  // Fetch setting info
  useEffect(() => {
    const fetchSettingInfo = async () => {
      try {
        const response = await fetch(product.GET_SETTINGS_INFO);
        const data = await response.json();
        if (data && data._id) {
          setSetting(data);
        }
      } catch (error) {
        console.error("Failed to fetch footer settings:", error);
      }
    };

    fetchSettingInfo();
  }, []);

  const handleSignupRedirect = () => {
    if (!emailInput.trim()) return toast.error("Please enter your email");
    navigate(`/signup?email=${encodeURIComponent(emailInput.trim())}`);
  };

  const renderCustomerCare = () => {
    if (!setting?.customerCareItems || setting.customerCareItems.length === 0) return null;
    return setting.customerCareItems.map((item, index) => (
      <li key={index}>
        <a href="#">{item}</a>
      </li>
    ));
  };

  return (
    <footer
      className="bg-black text-white py-5"
      style={{
        backgroundImage: "url('/your-bg-image.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 w-full">
        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-3 gap-10">
          {/* Contact Section */}
          <div className="text-left">
            <NavLink to="/contact-us">
              <h2 className="font-semibold text-lg mb-4">CONTACT US</h2>
            </NavLink>
            <p className="text-sm">
              <span className="text-red-500">Mon – Fri:</span>{" "}
              {setting?.openingTime || "10AM"} – {setting?.closingTime || "5PM"}
            </p>
            <p className="text-sm mt-2">
              <span className="text-red-500">Address:</span>{" "}
              {setting?.address || "Your address"}
            </p>
            <p className="text-sm mt-2">
              <span className="text-red-500">Phone:</span>{" "}
              {setting?.contactPhone || "(02) 6188 8062"}
            </p>
            <p className="text-sm mt-2">
              <span className="text-red-500">Email:</span>{" "}
              {setting?.supportEmail || "support@email.com"}
            </p>
          </div>

          {/* Signup Section */}
          <div className="text-center">
            {!user ? (
              <>
                <h2 className="text-2xl font-semibold mb-4">SIGN UP FOR 10% OFF</h2>
                <div className="flex flex-col sm:flex-row items-center max-w-md mx-auto">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full sm:flex-1 p-3 text-white bg-gray-800 border border-gray-700 rounded-md sm:rounded-r-none sm:rounded-l-md"
                  />
                  <button
                    onClick={handleSignupRedirect}
                    className="bg-white text-black px-6 py-3 mt-2 sm:mt-0 sm:rounded-r-md font-bold"
                  >
                    SEND
                  </button>
                </div>
              </>
            ) : (
              <h2 className="text-2xl font-semibold mb-4">FOLLOW US ON</h2>
            )}

            <div className="flex justify-center gap-6 mt-4 text-xl">
              <a href={setting?.twitter || "#"} aria-label="Twitter" className="hover:text-red-500 transition">
                <FaTwitter />
              </a>
              <a href={setting?.facebook || "#"} aria-label="Facebook" className="hover:text-red-500 transition">
                <FaFacebookF />
              </a>
              <a href={setting?.instagram || "#"} aria-label="Instagram" className="hover:text-red-500 transition">
                <FaInstagram />
              </a>
              <a href={setting?.linkedin || "#"} aria-label="Pinterest" className="hover:text-red-500 transition">
                <FaPinterestP />
              </a>
            </div>
          </div>

          {/* Customer Care Section */}
          <div className="text-right">
            <h2 className="font-semibold text-lg mb-4">CUSTOMER CARE</h2>
            <ul className="space-y-2 text-sm">{renderCustomerCare()}</ul>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="block md:hidden space-y-10">
          <div className="grid grid-cols-2 gap-6">
            {/* Contact */}
            <div className="text-left">
              <NavLink to="/contact-us">
                <h2 className="font-semibold text-lg mb-4">CONTACT US</h2>
              </NavLink>
              <p className="text-sm">
                <span className="text-red-500">Mon – Fri:</span>{" "}
                {setting?.openingTime || "10AM"} – {setting?.closingTime || "5PM"}
              </p>
              <p className="text-sm mt-2">
                <span className="text-red-500">Address:</span>{" "}
                {setting?.address || "Your address"}
              </p>
              <p className="text-sm mt-2">
                <span className="text-red-500">Phone:</span>{" "}
                {setting?.contactPhone || "(02) 6188 8062"}
              </p>
              <p className="text-sm mt-2">
                <span className="text-red-500">Email:</span>{" "}
                {setting?.supportEmail || "support@email.com"}
              </p>
            </div>

            {/* Customer Care */}
            <div className="text-left">
              <h2 className="font-semibold text-lg mb-4">CUSTOMER CARE</h2>
              <ul className="space-y-2 text-sm">{renderCustomerCare()}</ul>
            </div>
          </div>

          {/* Mobile Signup */}
          <div className="text-center">
            {!user ? (
              <>
                <h2 className="text-2xl font-semibold mb-4">SIGN UP FOR 10% OFF</h2>
                <div className="flex justify-center items-center max-w-md mx-auto">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full sm:flex-1 p-3 text-white bg-gray-800 border border-gray-700 rounded-l-md"
                  />
                  <button
                    onClick={handleSignupRedirect}
                    className="bg-white text-black p-3 px-4 rounded-r-md shadow-2xl font-bold"
                  >
                    SEND
                  </button>
                </div>
              </>
            ) : (
              <h2 className="text-2xl font-semibold mb-4">FOLLOW US ON</h2>
            )}

            <div className="flex justify-center gap-6 mt-4 text-xl">
              <a href={setting?.twitter || "#"} aria-label="Twitter" className="hover:text-red-500 transition">
                <FaTwitter />
              </a>
              <a href={setting?.facebook || "#"} aria-label="Facebook" className="hover:text-red-500 transition">
                <FaFacebookF />
              </a>
              <a href={setting?.instagram || "#"} aria-label="Instagram" className="hover:text-red-500 transition">
                <FaInstagram />
              </a>
              <a href={setting?.linkedin || "#"} aria-label="Pinterest" className="hover:text-red-500 transition">
                <FaPinterestP />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 pt-4 px-4 md:px-6 w-full text-sm flex flex-col md:flex-row justify-between items-center">
        <p>{setting?.footerText || "Copyright © 2024. All Rights Reserved."}</p>
        <div className="flex gap-4 flex-wrap justify-center text-2xl">
          <FaCcAmex title="American Express" />
          <FaCcMastercard title="MasterCard" />
          <FaCcVisa title="Visa" />
          <FaCcPaypal title="PayPal" />
          <FaApplePay title="Apple Pay" />
          <SiKlarna title="Klarna" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
