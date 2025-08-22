import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { product } from '../data/allapi';

const CategorySliderSection = ({
  title = 'Shop by Category',
  autoRotate = true,
  rotateInterval = 4000,
}) => {
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultImages = [
    'https://www.re-thinkingthefuture.com/wp-content/uploads/2022/07/A7341-Traditional-Crafts-of-India-Bamboo-Handicrafts-Image-1.jpg',
    'https://tse2.mm.bing.net/th/id/OIP.3NJ92vRCxdAWA3WKVoOdOgHaHa',
    'https://2.bp.blogspot.com/--TEGBCh9a8g/UrAfFZu4LXI/AAAAAAAAOvo/dYuwYbu0UAo/s1600/pottery+goa.jpg',
    'https://craftlipi.com/wp-content/uploads/2023/08/CDT-DYA-MC3-12-c.jpg',
    'https://d36tnp772eyphs.cloudfront.net/blogs/1/2018/08/Handmade-skirt-with-embroidery-and-mirror-work.jpg',
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(product.ADMIN_CREATED_CATEGORIES);
        const data = await response.json();
        if (data?.success && Array.isArray(data.categories)) {
          const categoriesWithImages = data.categories.map((cat, index) => ({
            name: cat.name,
            slug: cat.slug,
            image: defaultImages[index % defaultImages.length],
          }));
          setCategories(categoriesWithImages);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!autoRotate || categories.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, categories]);

  if (categories.length === 0) return null;

  return (
    <section className="w-full flex flex-col py-20 md:flex-row items-start justify-center bg-[#f5f2ed] overflow-hidden">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 md:h-[700px]">
        <img
          src={categories[activeIndex].image}
          alt={categories[activeIndex].name}
          className="md:ml-30 md:h-full h-[50vh] object-cover shadow-md translate-y-[15px]"
        />
      </div>

      {/* Right Text Section */}
      <div className="w-full md:w-1/2 h-[650px] bg-gradient-to-b from-[#f5f0ff] via-[#e0e8ff] to-[#d0f0ff] p-10 my-10 md:p-14 shadow-lg mr-30 flex flex-col z-10 justify-start">
        {/* Static Title */}
        <h2 className="text-sm uppercase text-gray-700 tracking-widest mb-6 sticky top-0 z-10 bg-opacity-90">
          {title}
        </h2>

        {/* Scrollable List */}
        <div
          className={`divide-y divide-gray-200 flex-1 pr-2 ${
            categories.length > 6 ? 'overflow-y-scroll scrollbar-hide' : ''
          }`}
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              onMouseEnter={() => setActiveIndex(i)}
              className="flex justify-between items-center py-4 cursor-pointer group"
            >
              <span
                className={`text-lg md:text-xl transition-colors duration-300 tracking-wide font-[serif] ${
                  i === activeIndex ? 'text-[#c74b2c]' : 'text-black'
                } group-hover:text-[#c74b2c]`}
              >
                <NavLink
                  to={`/category`}
                  className="hover:text-[#c74b2c] transition-colors duration-300"
                >
                  {cat.name.toUpperCase()}
                </NavLink>
              </span>
              <span
                className={`text-2xl transition-all duration-300 ${
                  i === activeIndex
                    ? 'opacity-100 translate-x-0 text-[#c74b2c]'
                    : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-[#c74b2c]'
                }`}
              >
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySliderSection;