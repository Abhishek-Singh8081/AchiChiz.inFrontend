import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { auth } from "../data/allapi";

// Single Blog Card
const BlogCard = ({ blog }) => {
  return (
    <div className="mb-10">
      <div className="relative">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-60 sm:h-72 object-cover rounded"
        />
         <span className="absolute top-3 left-3 bg-[#d26b4b] text-white text-xs px-3 py-1 rounded-full shadow">
              {blog.category}
            </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">{blog.date}</p>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
          {blog.title}
        </h2>
        <p className="text-gray-600 mt-2 line-clamp-2">{blog.description}</p>
        <NavLink to={`/blog/${blog.id}`}>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition">
            READ MORE
          </button>
        </NavLink>
      </div>
    </div>
  );
};

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(auth.getAllBlogs);
        const apiBlogs = res.data.blogs.map((item) => ({
          id: item._id,
          category: item.categories?.[0] || "General",
          image: item.coverImage?.url || "",
          date: new Date(item.createdAt).toLocaleDateString(),
          createdAt: new Date(item.createdAt),
          title: item.title,
          description: item.summary,
        }));

        const uniqueCategories = Array.from(
          new Set(apiBlogs.map((blog) => blog.category))
        );

        setBlogs(apiBlogs);
        setFilteredBlogs(apiBlogs);
        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) => blog.category === category);
      setFilteredBlogs(filtered);
    }
  };

  const latestPosts = [...blogs]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-12">
      <h1 className="text-center text-3xl sm:text-4xl font-bold my-10">
        <span className="block text-orange-600">Our Blog</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 space-y-8">
          {/* MOBILE Sidebar: Categories + Latest Posts */}
          <div className="block lg:hidden">
            <details className="mb-4  rounded">
              <summary className="cursor-pointer px-4 py-2 font-semibold bg-orange-100 text-orange-800">
                Categories
              </summary>
              <ul className="space-y-2 px-4 py-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`text-left w-full px-3 py-1 rounded ${
                        selectedCategory === category
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </details>

            <details className=" rounded">
              <summary className="cursor-pointer px-4 py-2 font-semibold bg-orange-100 text-orange-800">
                Latest Posts
              </summary>
              <ul className="space-y-4 px-4 py-2">
                {latestPosts.map((post) => (
                  <li key={post.id}>
                    <NavLink
                      to={`/blog/${post.id}`}
                      className="block group text-center"
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                      <p className="text-sm text-gray-500">{post.date}</p>
                      <p className="text-sm font-medium group-hover:underline">
                        {post.title}
                      </p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* DESKTOP Sidebar */}
          <div className="hidden lg:block space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`text-left w-full px-4 py-2 rounded ${
                        selectedCategory === category
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Latest Posts - Desktop View */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Latest Posts</h3>
              <ul className="space-y-4">
                {latestPosts.map((post) => (
                  <li
                    key={post.id}
                    className="flex items-center gap-3 rounded p-2 hover:bg-gray-50 transition"
                  >
                    <NavLink
                      to={`/blog/${post.id}`}
                      className="flex items-center gap-3 w-full group"
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="text-sm text-gray-500">{post.date}</p>
                        <p className="text-base font-medium text-gray-800 group-hover:underline">
                          {post.title}
                        </p>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Blog Grid */}
        <div className="lg:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <p>No blog posts found in this category.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
