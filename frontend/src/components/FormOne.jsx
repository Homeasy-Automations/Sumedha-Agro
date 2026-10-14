import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { MdVerifiedUser } from "react-icons/md";
import { RiShoppingBasketFill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlinePsychologyAlt } from "react-icons/md";
import { MdEco } from "react-icons/md";
import { MdLiquor } from "react-icons/md";
import { MdOutlineTune } from "react-icons/md";
import { IoMdBusiness } from "react-icons/io";
import Seeds from "../assets/Seeds.jpg";
import Bulk from "../assets/Bulk.jpg";
import Pickles from "../assets/Pickles.jpg";

export default function FormOne({ handleNext, formData, setFormData, scrollTo }) {
const businessRef = useRef(null);
  const [errors, setErrors] = useState({});
const handleChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};
const validate = () => {
  let newErrors = {};

  if (!formData.product) {
    newErrors.product = "Please select a product";
  }

  if (!formData.volume || !/^\d+$/.test(formData.volume)) {
    newErrors.volume = "Enter valid monthly volume (numbers only)";
  }
if (!formData.frequency) {
  newErrors.frequency = "Please select delivery frequency";
}

  if (!formData.name?.trim()) {
    newErrors.name = "Full name required";
  }

  if (!formData.email?.trim()) {
    newErrors.email = "Email required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

useEffect(() => {
  if (scrollTo === "business" && businessRef.current) {
    businessRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [scrollTo]);

  return (
    <main className="max-w-[960px] mx-auto px-6 py-12">
      {/* <!-- Header Image & Intro --> */}
      <div className="mb-10">
        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-xl mb-8">
          <div
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCO5qZceNACJnnfdyx1ooFgH_Wo6NOCnp2H5QJSovXmqd3w5d5TzX2qrn1nDewvHGdzPqQiy7fDDgzsylZmQQMRq6HnO3AyEmnnbjdfI9C6KCuNgyz4oxM734Dm9FHJOBc8sQV19EjyV-5gYAkCivqIpL47zhS3QdTosEmqyLw-opbtB64CusaPl0Ka4dYrNDx1z9uhJGnb9DKFb8od3q9K5HlqHMjHMhiZ_KvR9hb-jzt9Y91BMKPPnOKQHTg4YhalSHh9idPOLFg')",
            }}
            className="absolute inset-0 bg-cover bg-center"
            data-alt="Vibrant fresh organic mushrooms in a farm setting"
            // style='background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%), url("");'
          ></div>
          <div className="absolute bottom-0 left-0 p-8">
            <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Wholesale Partners
            </span>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Request a Custom Quote
            </h2>
            <p className="text-gray-200 mt-2 max-w-xl">
              Scale your business with high-quality mushroom spawn and bulk
              fresh produce directly from our agro-facility.
            </p>
          </div>
        </div>
        {/* <!-- Progress Tracker --> */}
        <div className="bg-white p-6 rounded-xl border border-[#e9f1ec] shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary text-white text-sm font-bold">
                  1
                </span>
                <span className="text-[#101914] font-bold text-lg">
                  Product Selection
                </span>
              </div>
              <span className="text-sm font-medium text-primary">
                Step 1 of 3
              </span>
            </div>
            <div className="w-full bg-[#d3e3da] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 w-[33%]"
                // style="width: 33%;"
              ></div>
            </div>
            <p className="text-[#5a8c6f] text-sm">
              Tell us which products fit your current distribution or processing
              needs.
            </p>
          </div>
        </div>
      </div>
      {/* <!-- Section 1: Product Selection --> */}
      <section className="mb-12">
        <h3 className="text-[22px] font-bold text-[#101914] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            <RiShoppingBasketFill />
          </span>
          1. What are you looking for?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <!-- Product Card 1 --> */}
          <div
          style={{
           backgroundImage: `url(${Seeds})`,
          }}
            onClick={() => handleChange("product", "spawn")}
            className={`group relative bg-white border-2 rounded-xl overflow-hidden transition-all cursor-pointer p-4 aspect-square flex flex-col justify-between
            ${
              formData.product === "spawn"
                ? "border-primary shadow-md"
                : "border-[#e9f1ec] hover:border-primary"
            }`}
          >
            <div
              className={`absolute top-4 right-4 text-primary transition-opacity
              ${
                formData.product === "spawn"
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <FaCheckCircle />
            </div>
            <div className="bg-primary/10 rounded-lg p-3 w-fit text-primary">
              <MdOutlinePsychologyAlt className="text-3xl" />
            </div>

           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-lg font-bold text-white">
                Mushroom Seeds (Spawn)
              </p>
              <p className="text-sm text-gray-200">
                High-yield spores for commercial growers.
              </p>
            </div>
          </div>
          {/* <!-- Product Card 2 --> */}
          <div
          style={{
           backgroundImage: `url(${Bulk})`,
          }}
            onClick={() => handleChange("product", "bulk")}
            className={`group relative bg-white border-2 rounded-xl overflow-hidden transition-all cursor-pointer p-4 aspect-square flex flex-col justify-between
            ${
              formData.product === "bulk"
                ? "border-primary shadow-md"
                : "border-[#e9f1ec] hover:border-primary"
            }`}
          >
            <div
              className={`absolute top-4 right-4 text-primary transition-opacity
              ${
                formData.product === "bulk"
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <FaCheckCircle />
            </div>
            <div className="bg-primary/10 rounded-lg p-3 w-fit text-primary">
              <MdEco className="text-3xl" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-lg font-bold text-white">
              Bulk Fresh Mushrooms
            </p>

            <p className="text-sm text-gray-200">
              Daily harvested Oyster, Button & Milky varieties.
            </p>
          </div>
          </div>
          {/* <!-- Product Card 3 --> */}
          <div

          style={{
           backgroundImage: `url(${Pickles})`,
          }}
        onClick={() => handleChange("product", "pickles")}
        className={`group relative bg-white border-2 rounded-xl overflow-hidden transition-all cursor-pointer p-4 aspect-square flex flex-col justify-between
        ${
          formData.product === "pickles"
            ? "border-primary shadow-md"
            : "border-[#e9f1ec] hover:border-primary"
        }`}
      >
        <div
          className={`absolute top-4 right-4 text-primary transition-opacity
          ${
            formData.product === "pickles"
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <FaCheckCircle />
        </div>
        <div className="bg-primary/10 rounded-lg p-3 w-fit text-primary">
          <MdLiquor className="text-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-lg font-bold text-white">
              Mushroom Pickles
            </p>

            <p className="text-sm text-gray-200">
              Premium value-added jars for retail outlet chains.
            </p>
          </div>
      </div>
      {errors.product && (
  <p className="text-red-500 text-sm mt-2">
    {errors.product}
  </p>
)}
      </div>
      </section>
      {/* <!-- Section 2: Order Specifications --> */}
      <section className="mb-12">
        <h3 className="text-[22px] font-bold text-[#101914] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            <MdOutlineTune />
          </span>
          2. Order Specifications
        </h3>
        <div className="bg-white p-8 rounded-xl border border-[#e9f1ec] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Estimated Monthly Volume
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={formData.volume}
                  onChange={(e) => handleChange("volume", e.target.value)}
                  placeholder="e.g. 500"
                  className={`w-full rounded-lg focus:ring-primary focus:border-primary px-4 py-3 pr-16
                    ${errors.volume ? "border-2 border-red-500" : "border border-gray-200"}
                  `}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-800">
                  KG
                </span>
              </div>

              {errors.volume && (
                <p className="text-red-500 text-sm">
                  {errors.volume}
                </p>
              )}
            </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Packaging Preference
            </label>
            <select value={formData.packaging}
                    onChange={(e) => handleChange("packaging", e.target.value)}
            className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3">
              <option>Eco-friendly Paper Trays</option>
              <option>Plastic Punnet Crates</option>
              <option>Bulk Sacks (for Spawn)</option>
              <option>Retail Glass Jars</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-bold text-gray-00">
              Delivery Frequency
            </label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-center border-2 border-[#e9f1ec] p-3 rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                <input type="radio"
                    name="freq"
                    value="Weekly"
                    checked={formData.frequency === "Weekly"}
                    onChange={(e) => handleChange("frequency", e.target.value)}
                    className="hidden" />
                <span className="text-sm font-semibold">Weekly</span>
              </label>
              <label className="flex-1 flex items-center justify-center border-2 border-[#e9f1ec] p-3 rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                <input type="radio"
                    name="freq"
                    value="Bi-Weekly"
                    checked={formData.frequency === "Bi-Weekly"}
                    onChange={(e) => handleChange("frequency", e.target.value)}
                    className="hidden" />
                <span className="text-sm font-semibold">Bi-Weekly</span>
              </label>
              <label className="flex-1 flex items-center justify-center border-2 border-[#e9f1ec] p-3 rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                <input  type="radio"
                  name="freq"
                  value="One-time"
                  checked={formData.frequency === "One-time"}
                  onChange={(e) => handleChange("frequency", e.target.value)}
                  className="hidden" />
                <span className="text-sm font-semibold">One-time</span>
              </label>
             
            </div>
                   {errors.frequency && (
            <p className="text-red-500 text-sm mt-2">
              {errors.frequency}
            </p>
          )}

          </div>
        </div>
      </section>
      {/* <!-- Section 3: Business Details --> */}
      <section ref={businessRef} className="mb-12">
        <h3 className="text-[22px] font-bold text-[#101914] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            <IoMdBusiness />
          </span>
          3. Business Information
        </h3>
        <div className="bg-white p-8 rounded-xl border border-[#e9f1ec] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Company Name
              </label>
              <input

             className="w-full 
             border-gray-200 
 
 
             rounded-lg 
             px-4 py-3
             
             focus:outline-none
             focus:ring-2
             focus:ring-green-500
             focus:ring-offset-2"
                // className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3"
                type="text"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Organic Foods Ltd"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                GST / Tax ID (Optional)
              </label>
              <input
                className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3"
                type="text"
                value={formData.gst}
                onChange={(e) => handleChange("gst", e.target.value)}
                placeholder="AA000000000000"
              />
            </div>
            {/* Full Name */}
{/* Full Name */}
<div className="space-y-2">
  <label className="block text-sm font-bold text-gray-700">
    Full Name
  </label>

  <input
    type="text"
    value={formData.name}
    onChange={(e) => handleChange("name", e.target.value)}
    placeholder="John Doe"
    className={`w-full rounded-lg focus:ring-primary focus:border-primary px-4 py-3
      ${errors.name ? "border-2 border-red-500" : "border border-gray-200"}
    `}
  />

  {errors.name && (
    <p className="text-red-500 text-sm mt-1">
      {errors.name}
    </p>
  )}
</div>


{/* Work Email */}
<div className="space-y-2">
  <label className="block text-sm font-bold text-gray-700">
    Work Email
  </label>

  <input
    type="email"
    value={formData.email}
    onChange={(e) => handleChange("email", e.target.value)}
    placeholder="john@company.com"
    className={`w-full rounded-lg focus:ring-primary focus:border-primary px-4 py-3
      ${errors.email ? "border-2 border-red-500" : "border border-gray-200"}
    `}
  />

  {errors.email && (
    <p className="text-red-500 text-sm mt-1">
      {errors.email}
    </p>
  )}
</div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Additional Requirements
            </label>
            <textarea
              className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3"
              placeholder="Mention any specific quality standards, delivery location details, or mixed order requests..."
              rows="4"
            ></textarea>
          </div>
        </div>
      </section>
      {/* <!-- Form Submission --> */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
          <span className="material-symbols-outlined text-primary text-sm">
            <MdVerifiedUser />
          </span>
          <span className="text-xs font-bold text-[#101914]">
            Trusted by 50+ Agro Partners in the region
          </span>
        </div>
        <button
                onClick={() => {
        if (validate()) {
          handleNext();
        }
      }}
          className="w-full max-w-md bg-primary hover:bg-opacity-95 text-white font-extrabold py-5 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95 text-lg"
        >
          Next
        </button>
        <p className="text-sm text-gray-600 text-center">
          Our team will review your requirements and respond with a tailored
          pricing plan within 24 business hours.
        </p>
      </div>
    </main>
  );
}
