import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { product } from "../data/allapi";

const PromoSection = () => {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch(product.GET_ALL_PROMOS);
        const data = await response.json();

        if (data.success) {
          setPromos(data.promos.slice(0, 2));
        }
      } catch (error) {
        console.error("Error fetching promos:", error);
      }
    };

    fetchPromos();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white mt-10">
      {promos.map((promo, index) => (
       <div key={promo._id} className="relative overflow-hidden h-[300px] md:h-[550px]">
  <img
    src={promo.image}
    alt={promo.title}
    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
  />

          <div
            className={`absolute ${
              index === 1 ? "top-20 sm:top-1/4 md:top-1/3" : "top-1/3"
            } left-10 text-left`}
          >
            {promo.description && (
              <p className="text-white text-lg mb-1">{promo.description}</p>
            )}
            <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4 text-white transition-colors duration-300 hover:text-red-600">
              {promo.title}
            </h2>
            <button className="relative overflow-hidden px-6 py-3 text-white font-medium z-10 bg-[#d75a3c] group">
              <span className="absolute inset-0 bg-[#c44b2e] transition-all duration-500 ease-out transform -translate-x-full group-hover:translate-x-0 z-0"></span>
              <span className="relative z-10">
                <NavLink to={"/category"}>
                  {promo.button || "SHOP NOW"}
                </NavLink>
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromoSection;