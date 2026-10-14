import React, { useState } from "react";
import { IoMdCall } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

export default function CTA() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const validateCTA = () => {
  let newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!formData.email.includes("@")) {
    newErrors.email = "Enter valid email";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCTA()) return;

  // your existing fetch code here

try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Inquiry sent successfully!");
      setFormData({
        name: "",
        email: "",
        company: "",
        interest: "",
        message: "",
      });
    } else {
      alert(data.error);
    }

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};
  return (
    <section
      className="py-20 px-4 md:px-20 lg:px-40 flex justify-center bg-background-light border-t border-gray-200"
      id="contact"
    >
      <div className="max-w[1000px] w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* <!-- Left Side: Info --> */}
        <div className="w-full md:w-2/5 bg-background-even p-10 flex flex-col justify-between text-black relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <span
              className="material-symbols-outlined text-[200px]"
              // style="font-size: 200px"
            >
              agriculture
            </span>
          </div>
          <div className="z-10">
            <h2 className="text-3xl font-bold mb-4">
              Partner with Sumedha Agro
            </h2>
            <p className="mb-8 font-medium opacity-90">
              Interested in bulk orders or contract farming? Let's discuss how
              we can grow together.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">
                  <IoMdCall size={20} />
                </span>
                <span className="font-bold">+91 9473896285</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">
                  <MdEmail size={20} />
                </span>
                <span className="font-bold">info@sumedhaagro.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">
                  <FaLocationDot size={20} />
                </span>
                <span className="font-bold">
                  982 Village Andpurdev, Banthra, Sarojni Nagar Lucknow 226401,
                  Uttar Pradesh, India
                </span>
              </div>
            </div>
          </div>
          <div className="mt-10 z-10">
            <p className="text-sm font-medium opacity-80">Follow us</p>
            <div className="flex gap-4 mt-2">
              {/* <!-- Simple social icons using text for demo --> */}
              <a
                className="hover:opacity-75 transition-opacity font-bold text-xl"
                href=" "
                target="_blank"
                aria-label="Visit our LinkedIn page"
              >
              <FaLinkedinIn />
              </a>
              <a
                className="hover:opacity-75 transition-opacity font-bold text-xl"
                href=" "
                target="_blank"
                aria-label="Visit our Twitter page"
              >
              <FaXTwitter />
              </a>
              <a
                className="hover:opacity-75 transition-opacity font-bold text-xl"
                href=" "
                target="_blank"
                aria-label="Visit our Instagram page"
              >
              <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        {/* <!-- Right Side: Form --> */}
        <div className="w-full md:w-3/5 p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-text-main"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="name"
                  placeholder="Your Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-text-main"
                  htmlFor="company"
                >
                  Company Name
                </label>
                <input
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="company"
                  placeholder="Company Ltd."
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-text-main"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="email"
                placeholder="you@example.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-text-main"
                htmlFor="interest"
              >
                I'm interested in
              </label>
              <select
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
              >
                <option>Fresh Mushrooms (Bulk)</option>
                <option>Processed Products</option>
                <option>Contract Farming</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-text-main"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                id="message"
                placeholder="Tell us about your requirements..."
                rows="3"
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button
              className="mt-2 w-full rounded-lg bg-black text-white py-3 text-sm font-bold tracking-wide hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              type="submit"
            >
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
