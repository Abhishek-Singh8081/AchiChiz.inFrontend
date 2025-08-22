# 🧵 Handicraft E-Commerce Platform – MERN Stack (User & Admin Panel)

A scalable and fully functional **handicraft-based e-commerce web application** built using the **MERN Stack**, featuring a dynamic user experience, real-time filtering, cart and wishlist systems, live search, pincode-based availability, coupon handling, and a full-featured admin dashboard for managing products, categories, variants, orders, users, and analytics.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
  - [User Panel](#user-panel)
  - [Admin Panel](#admin-panel)
- [Authentication & Security](#authentication--security)
- [Media & Utilities](#media--utilities)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## 📖 Overview

This project is a **handicraft-specific e-commerce platform** developed on the MERN Stack (MongoDB, Express.js, React.js, Node.js). It provides:
- Seamless shopping experience with **live product search**, **variant and stock management**, **pincode-based availability**, and **discount/coupon validation**
- A robust **user dashboard** to manage profiles, addresses, orders, and tracking
- A powerful **admin dashboard** to control website content, manage products, track analytics, and configure user permissions

The goal is to offer a fully customizable, fast, and modern shopping experience specifically tailored to handcrafted and artisanal products.

---

## 🚀 Tech Stack

**Frontend:**
- React.js
- Redux / Context API
- React Router
- Tailwind CSS / Bootstrap

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB Atlas

**Cloud & Services:**
- Cloudinary (for product images, banners)
- Nodemailer (for order confirmations, user emails)
- JWT (Authentication)

---

## 💡 Core Features

### 👤 User Panel

- 🔍 **Live Search**: Real-time product search with suggestions
- 🎯 **Product Filtering**: Filter by category, variants, stock, price
- 💼 **Quick View**: Preview product without leaving page
- 🛒 **Add to Cart**: Add multiple items with quantity and variant control
- ❤️ **Wishlist**: Add/remove items to wishlist
- 🚚 **Pincode Check**: Shows if the product is available in the selected pincode
- 📦 **Product Details Page**:
  - Variant switching
  - Similar category recommendations
  - Live stock status
- 🧾 **Checkout Page**:
  - Apply coupons
  - Validate pincode
  - Mobile number validation
  - Address selection
  - Order summary & payment confirmation
- 📦 **Order System**:
  - Place orders with multiple products
  - Stock control during checkout
  - Track order status
- 🧍‍♂️ **User Dashboard**:
  - Add/edit multiple addresses
  - Set default address
  - View order history
  - Track order status
  - Manage profile info and password

---

### 🛠️ Admin Panel

- 🖼️ **Banner & Promo Management**:
  - Add/edit/delete promotional banners and promo sections
- 📋 **Category Management**:
  - Create/edit categories
  - Assign categories to products
- 🧶 **Product & Variant Management**:
  - Add products with multiple variants (size, color, material, etc.)
  - Set stock levels per variant
  - Upload images via Cloudinary
- 🌍 **Pincode Management**:
  - Set which products are available at which pincodes
  - Restrict availability by region
- 💸 **Coupon System**:
  - Generate/manage discount coupons
  - Apply conditions (min amount, expiry, usage limits)
- 📈 **Analytics Dashboard**:
  - Track sales, orders, and revenue daily, monthly, yearly
- 🔄 **Order Management**:
  - View all user orders
  - Update order status
  - Cancel or refund orders
- 👥 **User Management**:
  - View all registered users
  - Change user roles (admin, user)
  - Block or delete users
- 🔥 **Product Highlights**:
  - Set products as:
    - New Arrival
    - Trending
- ⭐ **Reviews Management**:
  - Moderate and manage customer reviews on products
- 📝 **Website Content Management**:
  - Update About, Contact, Footer, and FAQs

---

## 🔐 Authentication & Security

- JWT-based login authentication
- Passwords stored with bcrypt hashing
- Role-based access control (user/admin)
- Validation for coupons and pincode
- Secure route protection for both frontend and backend

---

## ☁️ Media & Utilities

- **Cloudinary**: For uploading product images, banners, and profile images
- **Nodemailer**: (Optional) For sending order confirmations, registration, and password reset emails
- **React Toastify / Alerts**: For user feedback (e.g. success, error messages)

---

## ⚙️ Installation

### 📥 Clone Repository

```bash
git clone https://github.com/Abhishek-Singh8081/AchiChiz.inFrontend.git
cd handicraft-ecommerce-platform
