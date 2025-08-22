import React, { useState, useEffect, useMemo, useContext } from 'react';
import AllProducts from "../components/category/AllProducts";
import SideFilterBar from "../components/category/SideFilterBar";
import TopBar from "../components/category/TopBar";
import { product } from "../data/allapi";
import { AuthContext } from '../context/AuthContext';

function Category() {
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    price: [],
    priceMin: '',
    priceMax: '',
    brand: [],
    color: [],
    size: [],
  });
  const [sort, setSort] = useState('highToLow');
  const {setQuantity}=useContext(AuthContext)

  useEffect(() => {
    setQuantity(1)
    
    const fetchProducts = async () => {
      try {
        const res = await fetch(product.GET_ALL_PRODUCT);
        const data = await res.json();

        if (!Array.isArray(data.data)) throw new Error("Invalid response");

        const normalized = data.data.map((p, idx) => {
          // Enhanced color extraction
          let color = '#cccccc'; // default color
          if (p.specs?.Color) color = p.specs.Color;
          else if (p.color) color = Array.isArray(p.color) ? p.color[0] : p.color;
          else if (p.colors) color = Array.isArray(p.colors) ? p.colors[0] : p.colors;
          
          return {
            _id: p._id,
            id: p.id || idx,
            image: Array.isArray(p.images) ? p.images[0] : p.image,
            title: p.title,
            price: p.price,
            category: p.category?.name || 'Other',
            brand: p.brand || 'Other',
            color: color,
            size: p.size || 'M',
            discountedPrice:p.discountedPrice


          };
        });

       

        setApiProducts([...normalized]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      if (type === 'priceMin' || type === 'priceMax') {
        return { ...prev, [type]: value };
      }
      if (prev[type].includes(value)) {
        return { ...prev, [type]: prev[type].filter(v => v !== value) };
      } else {
        return { ...prev, [type]: [...prev[type], value] };
      }
    });
  };

  const handleReset = () => {
    setFilters({
      category: [],
      price: [],
      priceMin: '',
      priceMax: '',
      brand: [],
      color: [],
      size: [],
    });
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleFilterToggle = () => {
    setShowMobileFilter(!showMobileFilter);
  };

  const filteredProducts = useMemo(() => {
    let result = apiProducts.filter(product => {
      if (filters.category.length && !filters.category.includes(product.category)) return false;
      if (filters.brand.length && !filters.brand.includes(product.brand)) return false;
      if (filters.color.length && !filters.color.includes(product.color)) return false;
      if (filters.size.length && !filters.size.includes(product.size)) return false;
      if (filters.priceMin && product.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && product.price > Number(filters.priceMax)) return false;
      return true;
    });

    switch (sort) {
      case 'lowToHigh':
        return result.slice().sort((a, b) => a.price - b.price);
      case 'highToLow':
        return result.slice().sort((a, b) => b.price - a.price);
      case 'nameAZ':
        return result.slice().sort((a, b) => a.title.localeCompare(b.title));
      case 'nameZA':
        return result.slice().sort((a, b) => b.title.localeCompare(a.title));
      case 'newest':
        return result.slice().sort((a, b) => b.id - a.id);
      default:
        return result;
    }
  }, [apiProducts, filters, sort]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      
      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilter(false)}
          />
          {/* Filter Panel */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b  mt-3 border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button 
                onClick={() => setShowMobileFilter(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto h-full">
              <SideFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 border-r border-gray-200">
        <div className="sticky top-4">
          <SideFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <TopBar
          totalItems={filteredProducts.length}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterToggle={handleFilterToggle}
        />
        <AllProducts products={filteredProducts} />
      </main>
    </div>
  );
}

export default Category;