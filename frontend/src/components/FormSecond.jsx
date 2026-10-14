import React, {useState} from "react";
import { IoLocation } from "react-icons/io5";
import { MdLocalShipping } from "react-icons/md";
import { MdInventory } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdAcUnit } from "react-icons/md";
import { MdOutlineCalendarMonth } from "react-icons/md";

export default function FormSecond({ handlePrev, handleNext, formData, setFormData }) {
  
const [errors, setErrors] = useState({});

const handleChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};
const validate = () => {
  let newErrors = {};

  if (!formData.address?.trim()) {
    newErrors.address = "Street address required";
  }

  if (!formData.city?.trim()) {
    newErrors.city = "City required";
  }

  if (!formData.state?.trim()) {
    newErrors.state = "State required";
  }

  if (!formData.postalCode?.trim()) {
    newErrors.postalCode = "Postal code required";
  }

  if (!formData.shippingMethod) {
    newErrors.shippingMethod = "Select shipping method";
  }

  if (!formData.deliveryDate) {
    newErrors.deliveryDate = "Delivery date required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  return (
    <main className="max-w-[960px] mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-xl mb-8">
          <div
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCO5qZceNACJnnfdyx1ooFgH_Wo6NOCnp2H5QJSovXmqd3w5d5TzX2qrn1nDewvHGdzPqQiy7fDDgzsylZmQQMRq6HnO3AyEmnnbjdfI9C6KCuNgyz4oxM734Dm9FHJOBc8sQV19EjyV-5gYAkCivqIpL47zhS3QdTosEmqyLw-opbtB64CusaPl0Ka4dYrNDx1z9uhJGnb9DKFb8od3q9K5HlqHMjHMhiZ_KvR9hb-jzt9Y91BMKPPnOKQHTg4YhalSHh9idPOLFg')",
            }}
            className="absolute inset-0 bg-cover bg-center"
            data-alt="Logistics and distribution center with fresh produce"
            // style="
            //   background-image: linear-gradient(
            //       180deg,
            //       rgba(0, 0, 0, 0.2) 0%,
            //       rgba(0, 0, 0, 0.7) 100%
            //     ),
            //     url('');
            // "
          ></div>
          <div className="absolute bottom-0 left-0 p-8">
            <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Supply Chain
            </span>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Logistics &amp; Delivery
            </h2>
            <p className="text-gray-200 mt-2 max-w-xl">
              Specify your delivery requirements to ensure fresh, on-time
              arrival of your mushroom supply.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#e9f1ec] shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary text-white text-sm font-bold">
                  2
                </span>
                <span className="text-[#101914] font-bold text-lg">
                  Logistics Planning
                </span>
              </div>
              <span className="text-sm font-medium text-primary">
                Step 2 of 3
              </span>
            </div>
            <div className="w-full bg-[#d3e3da] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 w-[66%]"
                // style="width: 66%"
              ></div>
            </div>
            <p className="text-[#5a8c6f] text-sm">
              Tell us where and how you'd like your order to be delivered.
            </p>
          </div>
        </div>
      </div>
      <section className="mb-12">
        <h3 className="text-[22px] font-bold text-[#101914] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            <IoLocation />
          </span>
          1. Delivery Address
        </h3>
        <div className="bg-white p-8 rounded-xl border border-[#e9f1ec] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700">
                Street Address
              </label>
              <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Industrial Park Way"
                className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3"
                />
              {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address}
              </p>
            )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                City
              </label>
              <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Bhubaneswar"
                className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3"
                
              />
              {errors.city && (
              <p className="text-red-500 text-sm mt-1">
                {errors.city}
              </p>
            )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                State / Province
              </label>
              <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="Odisha"
                className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3"
                
              />
              {errors.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.state}
              </p>
            )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Postal / ZIP Code
              </label>
              <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              placeholder="751001"
                className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3"
                
              />
              {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.postalCode}
              </p>
            )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Country
              </label>
              <select 
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3">
                <option>India</option>
                <option>Nepal</option>
                <option>Bangladesh</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-12">
        <h3 className="text-[22px] font-bold text-[#101914] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            <MdLocalShipping />
          </span>
          2. Preferred Shipping Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cold Storage */}
          <label
            onClick={() => handleChange("shippingMethod", "cold")}
            className={`relative bg-white border-2 rounded-xl overflow-hidden transition-all cursor-pointer p-6 flex items-start gap-4
              ${
                formData.shippingMethod === "cold"
                  ? "border-primary shadow-md"
                  : "border-[#e9f1ec] hover:border-primary"
              }`}
          >
            <input
              type="radio"
              name="shipping_method"
              checked={formData.shippingMethod === "cold"}
              onChange={() => handleChange("shippingMethod", "cold")}
              className="hidden"
            />

            <div className="bg-primary/10 rounded-lg p-3 text-primary shrink-0">
              <MdAcUnit className="text-3xl" />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-lg font-bold text-[#101914]">
                  Cold Storage Transit
                </p>

                {formData.shippingMethod === "cold" && (
                  <AiFillCheckCircle className="text-primary text-xl" />
                )}
              </div>

              <p className="text-sm text-gray-500">
                Essential for fresh mushrooms. Climate-controlled 2-4°C delivery trucks.
              </p>
            </div>
          </label>


          {/* Standard Shipping */}
          <label
            onClick={() => handleChange("shippingMethod", "standard")}
            className={`relative bg-white border-2 rounded-xl overflow-hidden transition-all cursor-pointer p-6 flex items-start gap-4
              ${
                  formData.shippingMethod === "standard"
                  ? "border-primary shadow-md"
                  : "border-[#e9f1ec] hover:border-primary"
              }`}
          >
            <input
              type="radio"
              name="shipping_method"
              checked={formData.shippingMethod === "standard"}
              onChange={() => handleChange("shippingMethod", "standard")}
              className="hidden"
            />

            <div className="bg-primary/10 rounded-lg p-3 text-primary shrink-0">
              <MdInventory className="text-3xl" />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-lg font-bold text-[#101914]">
                  Standard Shipping
                </p>

                {formData.shippingMethod === "standard" && (
                  <AiFillCheckCircle className="text-primary text-xl" />
                )}
              </div>

              <p className="text-sm text-gray-500">
                Suitable for Spawn (Seeds) and Pickles. Standard freight transportation.
              </p>
            </div>
          </label>
          {errors.shippingMethod && (
            <p className="text-red-500 text-sm mt-2">
              {errors.shippingMethod}
            </p>
          )}
        </div>
      </section>
      <section className="mb-12">
        <h3 className="text-[22px] font-bold text-[#101914] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            <MdOutlineCalendarMonth />
          </span>
          3. Delivery Timeline
        </h3>
        <div className="bg-white p-8 rounded-xl border border-[#e9f1ec] shadow-sm">
          <div className="max-w-md">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Requested Start Date
            </label>
            <div className="relative">
              <input
               type="date"
              value={formData.deliveryDate}
              onChange={(e) => handleChange("deliveryDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
                className="w-full border-gray-200 rounded-lg focus:ring-primary focus:border-primary px-4 py-3"
                
              />
              {errors.deliveryDate && (
              <p className="text-red-500 text-sm mt-2">
                {errors.deliveryDate}
              </p>
            )}
            </div>
            <p className="text-xs text-[#5a8c6f] mt-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">info : </span>
              We recommend scheduling 7 days in advance for bulk orders.
            </p>
          </div>
        </div>
      </section>
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-4 w-full max-w-md">
          <button
            onClick={handlePrev}
            className="flex-[2] bg-primary hover:bg-opacity-95 text-white font-extrabold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95 text-lg"
          >
            Back
          </button>
          <button onClick={() => {
              if (validate()) {
                handleNext();
              }
            }}
          className="flex-[2] bg-primary hover:bg-opacity-95 text-white font-extrabold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95 text-lg">
            Proceed to Step 3
          </button>
        </div>
        <p className="text-sm text-gray-800 text-center">
          Your logistics preferences will help us calculate the most accurate
          shipping rates for your quote.
        </p>
      </div>
    </main>
  );
}
