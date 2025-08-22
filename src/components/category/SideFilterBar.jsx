import React, { useEffect, useState } from 'react';
import { product } from '../../data/allapi';
import { useNavigate } from 'react-router-dom';

const PRICE_LIMIT = [0, 5000]; // default fallback

const SideFilterBar = ({ filters, onFilterChange, onReset }) => {
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    artisans: [],
    priceRange: PRICE_LIMIT,
  });
  const navigate=useNavigate()

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const res = await fetch(product.GET_ALL_PRODUCT);
        const data = await res.json();
        const products = data.data || [];

        const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
        
        // Enhanced color extraction
        const allColors = products.flatMap(p => {
          const colors = [];
          if (p.color) colors.push(...(Array.isArray(p.color) ? p.color : [p.color]));
          if (p.specs?.Color) colors.push(p.specs.Color);
          if (p.colors) colors.push(...(Array.isArray(p.colors) ? p.colors : [p.colors]));
          return colors.filter(Boolean);
        });
        
        // Clean and normalize colors, remove duplicates and predefined colors
        const predefinedColors = ['#0000ff', '#00ff00', '#ffff00', '#800080', '#ffa500', '#ffc0cb', '#a52a2a', '#000000', '#ffffff', '#808080', '#000080'];
        const normalizedColors = allColors
          .map(color => {
            // Normalize color values
            if (color === 'black' || color === 'Black') return '#000000';
            if (color === 'white' || color === 'White') return '#ffffff';
            return color;
          })
          .filter(color => !predefinedColors.includes(color) && color !== '#000000' && color !== '#ffffff');
        
        const colors = [...new Set(normalizedColors)];
        
        const allSizes = products.flatMap(p => p.size || []);
        const sizes = [...new Set(allSizes)];
        const artisans = [...new Set(products.map(p => p.artisan?.name).filter(Boolean))];
        const prices = products.map(p => p.price || 0);
        const priceRange = [
          Math.min(...prices, PRICE_LIMIT[0]),
          Math.max(...prices, PRICE_LIMIT[1]),
        ];

        setFilterOptions({
          categories,
          brands,
          colors,
          sizes,
          artisans,
          priceRange,
        });
      } catch (err) {
        console.error('Failed to load filter data:', err);
        navigate("/notfound")
        
      }
    };

    fetchFilterData();
  }, []);

  return (
    <div className="md:w-64 p-5  border-r border-gray-200 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Filter By</h2>
        <button 
          onClick={onReset} 
          className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium shadow-sm hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2">Category</h3>
        {filterOptions.categories.map((item, i) => (
          <label key={i} className="block text-sm text-gray-700 mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.category.includes(item)}
              onChange={() => onFilterChange('category', item)}
            />
            {item}
          </label>
        ))}
        <button className="text-xs text-blue-700 mt-1">More</button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2">Price Range</h3>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>₹{filterOptions.priceRange[0]}</span>
            <span>to</span>
            <span>₹{filters.priceMax || filterOptions.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={filterOptions.priceRange[0]}
            max={filterOptions.priceRange[1]}
            value={filters.priceMax || filterOptions.priceRange[1]}
            onChange={e => onFilterChange('priceMax', parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>
      </div>

      {/* Brand
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2">Brand</h3>
        {filterOptions.brands.map((brand, i) => (
          <label key={i} className="block text-sm text-gray-700 mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.brand?.includes(brand)}
              onChange={() => onFilterChange('brand', brand)}
            />
            {brand}
          </label>
        ))} 
        <button className="text-xs text-blue-700 mt-1">More</button>
      </div>*/}-

      {/* Color */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2">Color</h3>
        <div className="grid grid-cols-6 gap-2">
          {/* Predefined common colors */}
          {[
            { name: 'Blue', value: '#0000ff' },
            { name: 'Green', value: '#00ff00' },
            { name: 'Yellow', value: '#ffff00' },
            { name: 'Purple', value: '#800080' },
            { name: 'Orange', value: '#ffa500' },
            { name: 'Pink', value: '#ffc0cb' },
            { name: 'Brown', value: '#a52a2a' },
            { name: 'Black', value: '#000000' },
            { name: 'White', value: '#ffffff' },
            { name: 'Gray', value: '#808080' },
            { name: 'Navy', value: '#000080' },
          ].map((colorOption, i) => (
            <div key={`predefined-${i}`} className="flex flex-col items-center group">
              <div
                title={colorOption.name}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 hover:scale-110
                  ${filters.color.includes(colorOption.value) ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 hover:border-gray-400'}`}
                style={{ backgroundColor: colorOption.value }}
                onClick={() => onFilterChange('color', colorOption.value)}
              ></div>
              <span className="text-xs text-gray-500 group-hover:text-gray-700 mt-1">{colorOption.name}</span>
            </div>
          ))}
          
          {/* Dynamic colors from API */}
          {filterOptions.colors.filter(color => {
            const predefinedColors = ['#0000ff', '#00ff00', '#ffff00', '#800080', '#ffa500', '#ffc0cb', '#a52a2a', '#000000', '#ffffff', '#808080', '#000080'];
            return !predefinedColors.includes(color) && color !== '#000000' && color !== '#ffffff' && color !== 'black' && color !== 'white';
          }).map((color, i) => (
            <div key={`dynamic-${i}`} className="flex flex-col items-center group">
              <div
                title={color}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 hover:scale-110
                  ${filters.color.includes(color) ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 hover:border-gray-400'}`}
                style={{ backgroundColor: color }}
                onClick={() => onFilterChange('color', color)}
              ></div>
              <span className="text-xs text-gray-500 group-hover:text-gray-700 mt-1">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2">Size & Fit</h3>
        {filterOptions.sizes.map((size, i) => (
          <label key={i} className="block text-sm text-gray-700 mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.size.includes(size)}
              onChange={() => onFilterChange('size', size)}
            />
            {size}
          </label>
        ))}
      </div>

      {/* Artisan */}
    
    </div>
  );
};

export default SideFilterBar;


