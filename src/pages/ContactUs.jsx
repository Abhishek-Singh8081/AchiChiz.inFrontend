import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { auth } from "../data/allapi";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation check (all fields must be filled)
    const { name, email, phone, subject, category, message } = formData;
    if (!name || !email || !phone || !subject || !category || !message) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName: name,
      email,
      phoneNumber: Number(phone),
      Category: category,
      subject,
      message,
    };

    try {
      const response = await fetch(auth.CONTACT_US, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setToast({ message: "Message Sent Successfully! We'll get back to you within 24 hours.", type: "success" });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setToast({ message: "Something went wrong. Please try again later.", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[80px] text-black">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're here to help with any questions about our products, orders, or services.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow z-[9999] text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-600"
          }`}
          role="alert"
          aria-live="assertive"
        >
          {toast.message}
        </div>
      )}

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Choose the method that works best for you. Our team is ready to assist.
            </p>
          </div>

          {[
            {
              icon: <Phone className="h-5 w-5" />,
              title: "Phone Support",
              value: "+1 (555) 123-4567",
              desc: "Mon-Fri, 9 AM - 6 PM EST",
            },
            {
              icon: <Mail className="h-5 w-5" />,
              title: "Email Support",
              value: "support@yourstore.com",
              desc: "Response within 24 hours",
            },
            {
              icon: <MessageSquare className="h-5 w-5" />,
              title: "Live Chat",
              value: "Available on our website",
              desc: "Mon-Fri, 9 AM - 6 PM EST",
            },
            {
              icon: <MapPin className="h-5 w-5" />,
              title: "Visit Our Store",
              value: "123 Commerce St, New York, NY",
              desc: "Mon-Sat, 10 AM - 8 PM",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start space-x-4 p-4 border rounded hover:bg-gray-50"
            >
              <div className="bg-black text-white p-2 rounded">{item.icon}</div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.value}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}

          {/* Business Hours */}
          <div className="p-6 border rounded bg-gray-50">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-black" />
              <h3 className="font-semibold">Business Hours</h3>
            </div>
            <div className="text-sm space-y-1">
              <p className="flex justify-between">
                <span>Mon - Fri</span>
                <span>9:00 AM - 6:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </p>
            </div>
          </div>

          {/* Emergency */}
          <div className="p-6 border border-red-200 bg-red-50">
            <h3 className="font-semibold text-red-900 mb-2">Emergency Support</h3>
            <p className="text-sm text-red-700 mb-1">For urgent order/account issues:</p>
            <p className="font-medium text-red-900">+1 (555) 999-0000</p>
            <p className="text-xs text-red-600">24/7 for critical issues only</p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded bg-white"
              >
                <option value="">Select a category</option>
                <option value="general">General Inquiry</option>
                <option value="order">Order Support</option>
                <option value="product">Product Question</option>
                <option value="shipping">Shipping & Returns</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing & Payment</option>
                <option value="complaint">Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Brief subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea
              name="message"
              rows="6"
              required
              value={formData.message}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded resize-none"
              placeholder="Details about your inquiry..."
            />
          </div>

          <div className="bg-gray-50 border p-4 text-sm text-gray-600 rounded">
            <strong>Note:</strong> For order-related inquiries, please include your order number.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            {isSubmitting ? "Sending Message..." : "Send Message"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By submitting this form, you agree to our privacy policy and terms of service.
          </p>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600">Quick answers to common questions.</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6 text-gray-700">
          <details className="p-4 border rounded">
            <summary className="font-semibold cursor-pointer">How can I track my order?</summary>
            <p className="mt-2">Once your order ships, you'll receive a tracking number via email.</p>
          </details>
          <details className="p-4 border rounded">
            <summary className="font-semibold cursor-pointer">What is your return policy?</summary>
            <p className="mt-2">
              We accept returns within 30 days of delivery, provided items are unused and in original packaging.
            </p>
          </details>
          <details className="p-4 border rounded">
            <summary className="font-semibold cursor-pointer">Can I change my order after placing it?</summary>
            <p className="mt-2">You can modify your order within 1 hour of placement by contacting support.</p>
          </details>
          <details className="p-4 border rounded">
            <summary className="font-semibold cursor-pointer">How do I get technical support?</summary>
            <p className="mt-2">Use the live chat or email us with detailed info about your issue.</p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
