import React from "react";
import { Outlet,useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import PageTopBanner from "./Displayimage";
import AutoScrollToTop from "./AutoScrollToTop"; 



const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <AutoScrollToTop />
      <Header />
        {!isHome && <PageTopBanner />}
      <main>
        <Outlet /> 
      </main>
      <Footer />
      <ScrollToTop />
    </> 
  );
};


export default Layout;
