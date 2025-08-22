import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { product } from "../data/allapi";
import { NavLink, useNavigate } from "react-router-dom";

const textMotion = {
  hidden: { opacity: 0, x: -100 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

const imageMotion = {
  hidden: { opacity: 0, x: 100 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

export default function HeroScroll() {
  const containerRef = useRef();
  const [index, setIndex] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch(product.GET_BANNERS);
        if (!res.ok) throw new Error("Failed to fetch banners");
        const result = await res.json();
        setPanels(result?.banners || []);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  const scrollToPanel = (i) => {
    containerRef.current?.scrollTo({
      left: i * window.innerWidth,
      behavior: "smooth",
    });
  };

  const next = () => {
    if (panels.length === 0) return;
    const nextIndex = (index + 1) % panels.length;
    setIndex(nextIndex);
    scrollToPanel(nextIndex);
    setAnimateKey((prev) => prev + 1);
  };

  const prev = () => {
    if (panels.length === 0) return;
    const prevIndex = (index - 1 + panels.length) % panels.length;
    setIndex(prevIndex);
    scrollToPanel(prevIndex);
    setAnimateKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (panels.length === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [index, panels]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || panels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const visibleIndex = parseInt(entry.target.dataset.index);
            setIndex(visibleIndex);
            setAnimateKey((prev) => prev + 1);
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    const children = container.querySelectorAll(".panel");
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [panels]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading banners...
      </div>
    );
  }

  if (panels.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No banners to display.
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="relative w-full overflow-hidden full-screen-mobile">
        <div
          ref={containerRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide h-full"
        >
          {panels.map((panel, idx) => (
            <div
              key={panel._id || idx}
              data-index={idx}
              className="panel w-screen full-screen-mobile flex-shrink-0 relative snap-start"
            >
              <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${panel.backgroundImage?.url})` }}
              />
              <div className="absolute inset-0 bg-black/60 z-0" />

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center h-full px-8 md:px-24 pt-[120px] md:pt-16 pb-16 gap-10">
                {/* Text Section */}
                <motion.div
                  key={animateKey}
                  initial="hidden"
                  animate="show"
                  variants={textMotion}
                  className="w-full md:w-1/2 text-white space-y-6"
                >
                  <h4 className="text-sm sm:text-base md:text-xl tracking-widest uppercase text-gray-300">
                    {panel.subtitle}
                  </h4>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                    {panel.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed">
                    {panel.description}
                  </p>
                  <NavLink to="/category" className="mt-4 bg-[#AC604F] px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg font-bold uppercase text-white hover:bg-orange-500 transition" >
                    {panel.button}
                  </NavLink>
                </motion.div>

                {/* Image Section */}
                <motion.div
                  key={"img-" + animateKey}
                  initial="hidden"
                  animate="show"
                  variants={imageMotion}
                  className="relative w-full md:mt-15 md:w-1/2 flex justify-center"
                >
                  <div className="relative hover:scale-105 transition-transform duration-500">
                    <img
                      src={panel.coverImage?.url}
                      alt="Product"
                      className="w-[240px] h-[320px] sm:w-[300px] sm:h-[400px] md:w-[380px] md:h-[550px] object-cover rounded shadow-xl"
                    />
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center text-orange-700 font-semibold text-[10px] sm:text-xs text-center shadow-md animate-[spin_16s_linear_infinite]">
                      <div className="rotate-[-30deg] whitespace-pre-line leading-tight">
                        HANDMADE{"\n"}CREATIONS
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {panels.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                scrollToPanel(i);
                setAnimateKey((prev) => prev + 1);
              }}
              className={`w-3 h-3 rounded-full ${
                index === i ? "bg-white" : "bg-gray-500"
              } transition-all duration-300`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="hidden md:block">
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/40 text-white p-2 md:p-3 rounded-full hover:bg-black/60 z-20"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/40 text-white p-2 md:p-3 rounded-full hover:bg-black/60 z-20"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
