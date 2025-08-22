import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { product } from '../data/allapi';

const MyCustomization = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    referenceLink: '',
    message: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    if (!form.image) newErrors.image = 'Image is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (form.phone && !/^\d{10}$/.test(form.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    setForm(prev => ({ ...prev, image: e.target.files[0] || null }));
  };

 


 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('mobileNumber', form.phone.trim());
    formData.append('email', form.email.trim());
    formData.append('link', form.referenceLink.trim());
    formData.append('message', form.message.trim());
    formData.append('image', form.image); // 👈 This goes into req.files.image

    const res = await fetch(product.CREATE_CUSTOM_PRODUCT, {
      method: 'POST',
      body: formData, // Don't set Content-Type; browser sets it
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to submit request');
    }

    // Reset form
    setForm({
      name: '',
      phone: '',
      email: '',
      referenceLink: '',
      message: '',
      image: null,
    });
    setErrors({});
    e.target.reset();

    toast.success('Your customization request has been submitted successfully!');
  } catch (err) {
    console.error(err);
    toast.error(err.message || 'Submission failed.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-8 text-center">Customize Your Handicraft</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <form onSubmit={handleSubmit} className="flex-1 space-y-5">
          <div>
            <label className="block font-medium mb-1">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter your 10-digit phone number"
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Reference Link (optional)</label>
            <input
              name="referenceLink"
              type="url"
              value={form.referenceLink}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300 focus:ring-blue-500"
              placeholder="Paste reference URL"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Message <span className="text-red-600">*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Write your message"
              rows={4}
            ></textarea>
            {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Upload Image <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full ${errors.image ? 'border border-red-500' : ''}`}
            />
            {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <div className="flex-1 flex items-center justify-center">
          <img
            src="/customize.png"
            alt="Handicraft"
            className="rounded-md shadow-md max-h-[500px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default MyCustomization;
