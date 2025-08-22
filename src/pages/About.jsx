import React, { useState, useEffect } from "react";
import { product } from "../data/allapi";

const AboutPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchCMSData = async () => {
      try {
        const res = await fetch(product.GET_CMS);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch about page data:", error);
      }
    };

    fetchCMSData();
  }, []);

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        Loading...
      </div>
    );
  }

  const stats = [
    { value: data.stats.yearsOfExcellence, label: "Years of Excellence" },
    { value: data.stats.happyCustomers, label: "Happy Customers" },
    { value: data.stats.piecesCreated, label: "Pieces Created" },
    { value: data.stats.generations, label: "Generations" },
  ];

  const formatText = (text) =>
    text.split("\r\n").map((line, i) => (
      <p key={i} className="mb-4 last:mb-0">
        {line}
      </p>
    ));

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 overflow-hidden">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {data.aboutUsTitle.split(" ").slice(0, 3).join(" ")}
            <span className="block text-orange-600">
              {" "}
              {data.aboutUsTitle.split(" ").slice(3).join(" ")}
            </span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {formatText(data.aboutUsContent)}
          </p>

          {/* Hero Image (Dummy) */}
          <div className="mt-10 relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="./image.png" // Dummy image
                alt="About Us"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Story Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid gap-12 items-center lg:grid-cols-2">
            {/* Left Column */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                Where Tradition Meets Innovation
              </h2>
              <div className="space-y-4 text-amber-800 text-base sm:text-lg leading-relaxed">
                {formatText(data.aboutUsContent)}
              </div>
            </div>

            {/* Right Column */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white border border-orange-300 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition"
                >
                  <div className="text-xl sm:text-3xl font-bold text-orange-600">
                    {stat.value}
                  </div>
                  <div className="text-orange-700 mt-1 text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 px-4 sm:px-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">
              {data.mission.split("\r\n")[0]}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {data.mission.split("\r\n")[1]}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">
              {data.vision.split("\r\n")[0]}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {data.vision.split("\r\n")[1]}
            </p>
          </div>
        </div>

        {/* Final Text Block */}
        <div className="text-center px-4">
          <h3 className="text-base sm:text-xl font-semibold text-gray-700">
            Crafted with ❤️ by artisans across India
          </h3>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Every product tells a story — of culture, care, and community. By
            shopping with us, you're helping preserve centuries of handmade
            excellence.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
