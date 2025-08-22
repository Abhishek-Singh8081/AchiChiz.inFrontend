import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import ProductPage from "./pages/productpage";
import NotFound from "./components/NotFound";
import Checkouts from "./pages/checkouts";

import {
  Layout,
  PromoSection,
  Home,
  MyOrders,
  AccountDashboard,
  AccountInformation,
  AddressBook,
  Dashboard,
  ReviewCard,
  ReviewSummary,
  Reviews,
  RatingStars,
  Customerreview,
  Customizeproduct,
  Followus,
  NewArrivals,
  Scrollbar,
  ShopByCategory,
  NewTrending,
  Blog,
  BlogCommentSection,
  Category,
  Authpage,
  Aboutus,
  ContactUs,
  Policy,
  Checkout,
  CheckoutPage,
  OrderPage,
  OrderDetailsPage,
  ReturnRefundPage,
  TrackOrderPage,
  ReturnRefundPolicy,
  OtpPage,
  PageTopBanner,
  Payment,


  // seller dashboard imports
  SellerDashboard,
  // ProductList,
  // AddProductForm,
  // EditProductForm,
  // OrderList,
  // OrderDetails,
  // EarningsOverview,
  // PayoutHistory,
  // KYCUpload,
} from "./index";
// import Login  from "../../adminPanel/src/pages/Login";
import { Toaster } from "react-hot-toast";
import FavoritesPage from "./pages/Favpage";
import CartPage from "./pages/Cart";
import LogOut from "./components/LogOut";
import ProductDetail from "./pages/ProductDetail";
import { LogIn } from "lucide-react";
import CustomizeCategory from "./pages/CustomizeCategory";
import MyCustomization from "./pages/MyCustomization";
import { auth } from "./data/allapi";
import { useEffect, useLayoutEffect } from "react";
// import ForgotPasswordPage from "./components/Auth/ForgotPasswordPage";



function App() {
  
  
   useLayoutEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const res = await fetch(auth.SITE_TITLE); // replace with your actual endpoint
        const data = await res.json();
        if (data?.siteTitle) {
          document.title = data.siteTitle;
          const titleTag = document.getElementById("title");
          if (titleTag) {
            titleTag.innerText = data.siteTitle;
          }
        }
      } catch (error) {
        console.error("Failed to load site settings:", error);
      }
    };

    fetchSiteSettings();
  }, []);

  return (
    <CartProvider>
      <FavoriteProvider>
        <>
          <Routes>

              
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="customer-review" element={<Customerreview />} />
              <Route path="customize-product" element={<Customizeproduct />} />
              <Route path="follow-us" element={<Followus />} />
              <Route path="new-arrival" element={<NewArrivals />} />
              <Route path="scrollbar" element={<Scrollbar />} />
              <Route path="favoritespage" element={<FavoritesPage />} />
              <Route path="cartpage" element={<CartPage />} />
              <Route path="checkout-pages" element={<Checkouts />} />
              <Route path="shop-by-category" element={<ShopByCategory />} />
              <Route path="trending-product" element={<NewTrending />} />
              <Route path="promo-section" element={< PromoSection />} />
              <Route path="review-card" element={< ReviewCard />} />
              <Route path="review-summary" element={< ReviewSummary />} />
              <Route path="review-rating" element={<  RatingStars />} />
              <Route path="reviews/:id" element={< Reviews />} />
              <Route path="dashboard" element={<  Dashboard />} />
              <Route path="myorders" element={<  MyOrders />} />
              <Route path="authpage" element={<  Authpage />} />
              <Route path="account-dashboard" element={<  AccountDashboard />} />
              <Route path="account-information" element={<  AccountInformation />} />
              <Route path="address-book" element={<  AddressBook />} />
              <Route path="about-us" element={<  Aboutus />} />
              <Route path="contact-us" element={<  ContactUs />} />
              <Route path="privacy-policy" element={<  Policy />} />
              <Route path="blog" element={<  Blog />} />
              <Route path="/blog/:id" element={<  BlogCommentSection />} />
              <Route path="category" element={<  Category />} />
              <Route path="notfound" element={<  NotFound />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/checkout-page" element={<CheckoutPage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="/order-page" element={<OrderPage />} />
              <Route path="/order-detail/:id" element={<OrderDetailsPage />} />
              {/* <Route path="/return-refund" element={<ReturnRefundPage />} /> */}
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
              {/* <Route path="/product/:id" element={<productdetails />} /> */}
              {/* <Route path="/order-page" element={<OrderPage />} /> */}
              <Route path="/order-detail/:id" element={<OrderDetailsPage />} />
              <Route path="/return-refund/:id" element={<ReturnRefundPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route
                path="/return-refund-policy"
                element={<ReturnRefundPolicy />}
              />
              <Route path="/otp" element={<OtpPage />} />
              <Route path="/page-top-banner" element={<PageTopBanner/>} />
              <Route path="/payment" element={<Payment />} />

              <Route path="sellerDashboard" element={<SellerDashboard />} />
              <Route path="/customize-category" element={<CustomizeCategory/>}/>
              <Route path="/mycustomization" element={<MyCustomization/>}/>
              {/* <Route path ="ProductList" element={<ProductList />} />
              <Route path="AddProductForm" element={<AddProductForm />} />
              <Route path="ProductList" element={<ProductList />} />
              <Route path="AddProductForm" element={<AddProductForm />} />
              <Route path="EditProductForm " element={<EditProductForm />} />
              <Route path="EditProductForm" element={<EditProductForm />} />
              <Route path="OrderList " element={<OrderList />} />
              <Route path="OrderDetails" element={<OrderDetails />} />
              <Route path="EarningsOverview" element={<EarningsOverview />} />
              <Route path="PayoutHistory" element={<PayoutHistory />} /> */}
              {/* <Route path="KYCUpload " element={< KYCUpload />} /> */}

   {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
  

              {/* <Route path="/admin" element={<Login/>}/>/ */}
            </Route>
              <Route path="/logout" element={<LogOut/>}/>
          </Routes>
          <Toaster position="top-right" />
        </>
      </FavoriteProvider>
    </CartProvider>
  );
}

export default App;
