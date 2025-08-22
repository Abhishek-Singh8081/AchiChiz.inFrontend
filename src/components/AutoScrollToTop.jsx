import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AutoScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Auto scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // You can change this to "auto"
    });
  }, [pathname]);

  return null;
};

export default AutoScrollToTop;
