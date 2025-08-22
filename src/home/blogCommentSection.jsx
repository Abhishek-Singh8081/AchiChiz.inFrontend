import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../data/allapi";
import { AuthContext } from "../context/AuthContext";

const BlogCommentSection = () => {
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { usertoken } = useContext(AuthContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(auth.getAllBlogs);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        const apiBlogs = data.blogs.map((b) => ({
          category: b.categories?.[0] || "General",
        }));
        const allCategories = ["All", ...new Set(apiBlogs.map((b) => b.category))];
        setCategories(allCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const loadBlog = async () => {
    try {
      const res = await fetch(`${auth.getSingleBlogById}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog");
      const { blog: b } = await res.json();
      setBlog({
        _id: b._id,
        category: b.categories?.[0] || "General",
        image: b.coverImage?.url || "",
        date: new Date(b.createdAt).toLocaleDateString(),
        title: b.title,
        description: b.content,
        comments: b.comments || [],
      });
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  useEffect(() => {
    loadBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usertoken) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${auth.commentOnBlog}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usertoken}`,
        },
        body: JSON.stringify({ comment }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      await loadBlog();
      setComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  if (!blog) {
    return <div className="text-center py-20 text-gray-600 text-lg">Loading blog content...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
      {/* Sidebar */}
      <aside className="bg-white shadow-md rounded-lg p-5 border border-gray-100 self-start">
  <h3 className="text-lg font-semibold text-[#d26b4b] mb-3 pb-2 border-b border-gray-200">
    Filter by Category
  </h3>
  <div className="relative">
    <select
      className="block w-full appearance-none border border-gray-300 bg-white px-4 py-2 rounded-md text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#d26b4b] shadow-sm"
      value={blog.category}
      onChange={(e) => navigate(`/blog?category=${encodeURIComponent(e.target.value)}`)}
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</aside>


      {/* Main Content */}
      <main className="col-span-1 lg:col-span-3 bg-white shadow-lg rounded-xl p-8 border">
        {/* Blog Header */}
        <div className="mb-10">
          <div className="relative overflow-hidden rounded-xl shadow">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
            />
            <span className="absolute top-3 left-3 bg-[#d26b4b] text-white text-xs px-3 py-1 rounded-full shadow">
              {blog.category}
            </span>
          </div>
          <div className="mt-5">
            <p className="text-sm text-gray-500">{blog.date}</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-3">{blog.title}</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{blog.description}</p>
          </div>
        </div>

        {/* Comments */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">{blog.comments.length} Comment{blog.comments.length !== 1 ? "s" : ""}</h2>
          {blog.comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            blog.comments.map((c) => (
              <div
                key={c._id}
                className="flex gap-4 p-4 mb-6 border rounded-md shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-[#f2e4e0] rounded-full flex items-center justify-center font-bold text-lg text-[#d26b4b]">
                  {c.comment.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center text-sm text-gray-600 mb-1">
                    <span className="font-semibold text-gray-800">{c.user?.name || "Anonymous"}</span>
                    <span className="text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                    <button className="text-xs text-[#d26b4b] underline hover:no-underline">Reply</button>
                  </div>
                  <p className="text-gray-700 text-[1rem]">{c.comment}</p>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Leave a Comment */}
        <section className="mt-16">
          <h3 className="text-xl font-bold text-[#d26b4b] text-center mb-2">Leave a Reply</h3>
          <p className="text-sm text-center text-gray-500 mb-6">
            Your email address will not be published. Required fields are marked <span className="text-red-500">*</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 p-6 rounded-xl shadow border max-w-2xl mx-auto">
            <textarea
              rows="5"
              required
              placeholder="Your Comment..."
              className="w-full border border-gray-300 rounded px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d26b4b] resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#d26b4b] text-white font-medium px-6 py-2 rounded hover:bg-[#bd4e2c] transition"
              >
                Post Comment
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default BlogCommentSection;
