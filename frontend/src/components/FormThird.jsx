import React, { useState } from "react";
import { MdInventory } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdEco } from "react-icons/md";
import { MdBusinessCenter } from "react-icons/md";
import { IoShieldCheckmark } from "react-icons/io5";
import { BiArrowBack } from "react-icons/bi";
import { IoSend } from "react-icons/io5";

export default function FormThird({ handlePrevious, handleSubmit, goToStep, formData}) {

        const [agreed, setAgreed] = useState(false);
      const [error, setError] = useState("");

      const handleFinalSubmit = () => {
  if (!agreed) {
    setError("You must accept the terms before submitting.");
    return;
  }

  setError("");
  handleSubmit();
};

  return (
    <main className="max-w-[960px] mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-xl mb-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            data-alt="Review your quote request"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCO5qZceNACJnnfdyx1ooFgH_Wo6NOCnp2H5QJSovXmqd3w5d5TzX2qrn1nDewvHGdzPqQiy7fDDgzsylZmQQMRq6HnO3AyEmnnbjdfI9C6KCuNgyz4oxM734Dm9FHJOBc8sQV19EjyV-5gYAkCivqIpL47zhS3QdTosEmqyLw-opbtB64CusaPl0Ka4dYrNDx1z9uhJGnb9DKFb8od3q9K5HlqHMjHMhiZ_KvR9hb-jzt9Y91BMKPPnOKQHTg4YhalSHh9idPOLFg')",
            }}
            // style='background-image:
            // linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCO5qZceNACJnnfdyx1ooFgH_Wo6NOCnp2H5QJSovXmqd3w5d5TzX2qrn1nDewvHGdzPqQiy7fDDgzsylZmQQMRq6HnO3AyEmnnbjdfI9C6KCuNgyz4oxM734Dm9FHJOBc8sQV19EjyV-5gYAkCivqIpL47zhS3QdTosEmqyLw-opbtB64CusaPl0Ka4dYrNDx1z9uhJGnb9DKFb8od3q9K5HlqHMjHMhiZ_KvR9hb-jzt9Y91BMKPPnOKQHTg4YhalSHh9idPOLFg");'
          ></div>
          <div className="absolute bottom-0 left-0 p-8">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Review Your Request
            </h2>
            <p className="text-gray-200 mt-1 max-w-xl">
              Please confirm all details before submitting your wholesale quote
              request.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#e9f1ec] shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary text-white text-sm font-bold">
                  3
                </span>
                <span className="text-[#101914] font-bold text-lg">
                  Review and Submit
                </span>
              </div>
              <span className="text-sm font-medium text-primary">
                Step 3 of 3
              </span>
            </div>
            <div className="w-full bg-[#d3e3da] h-2.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all duration-500 w-[100%]"></div>
            </div>
            <p className="text-[#5a8c6f] text-sm">
              Almost there! Finalize your inquiry to receive our competitive
              pricing.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <section className="bg-white rounded-xl border border-[#e9f1ec] shadow-sm overflow-hidden">
          <div className="bg-[#f8faf9] px-6 py-4 border-b border-[#e9f1ec] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                <MdInventory size={20} />
              </span>
              <h3 className="font-bold text-[#101914]">
                Product &amp; Order Details
              </h3>
            </div>
            <button
              onClick={() => goToStep(0)}   // 🔥 go directly to FormOne
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                <MdEdit size={20} />
              </span>
              Edit
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Selected Product
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2 text-primary">
                  <span className="material-symbols-outlined">
                    <MdEco size={20} />
                  </span>
                </div>
                <div>
                  <p className="font-bold text-[#101914]">
                    {formData.product === "spawn" && "Mushroom Seeds (Spawn)"}
                    {formData.product === "bulk" && "Bulk Fresh Mushrooms"}
                    {formData.product === "pickles" && "Mushroom Pickles"}
                  </p>
                  
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Volume
                </p>
                <p className="font-bold text-[#101914]">
                  {formData.volume} KG / Month
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Frequency
                </p>
                <p className="font-bold text-[#101914]">
                  {formData.frequency}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Packaging
                </p>
                <p className="font-bold text-[#101914]">
                  {formData.packaging}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white rounded-xl border border-[#e9f1ec] shadow-sm overflow-hidden">
          <div className="bg-[#f8faf9] px-6 py-4 border-b border-[#e9f1ec] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                <MdBusinessCenter size={20} />
              </span>
              <h3 className="font-bold text-[#101914]">
                Business Information
              </h3>
            </div>
            <button
              onClick={() => goToStep(0, "business")}   // 🔥 go directly to Formone
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                <MdEdit size={20} />
              </span>
              Edit
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Company
                </p>
                <p className="font-bold text-[#101914] text-lg">
                  {formData.company || "Not Provided"}
                </p>

                <p className="text-sm text-gray-500">
                  GST: {formData.gst || "N/A"}
                </p>

              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Primary Contact
                </p>
                <p className="font-bold text-[#101914]">
                {formData.name || "Not Provided"}
              </p>

              <p className="text-sm text-gray-500">
                {formData.email || "No Email"}
              </p>
              </div>
            </div>
            <div className="md:col-span-2 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Additional Requirements
              </p>
              <p className="text-sm text-[#5a8c6f] italic">
                "Please ensure temperature-controlled logistics for the Friday
                deliveries. We are also interested in organic certification
                documentation."
              </p>
            </div>
          </div>
        </section>
        <section className="space-y-8 mt-12">
          <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="pt-0.5">
              <input
                className="size-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
            </div>
            <label
              className="text-sm text-gray-600 leading-relaxed cursor-pointer"
              for="terms"
            >
              I agree to the{" "}
              <a className="text-primary font-bold underline" href="..\src\pages\Termsofservices.jsx">
                Terms of Service
              </a>{" "}
              and confirm that the information provided above is accurate for
              the purpose of a commercial quote from Sumedha Agro-Tech
              Industries.
            </label>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-sm">
                <IoShieldCheckmark size={20} />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">
                Secure Submission
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <button
                onClick={handlePrevious}
                className="flex-[2] bg-primary hover:bg-opacity-95 text-white font-extrabold py-5 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95 text-xl flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">
                  <BiArrowBack size={20} />
                </span>
                Previous Step
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-[2] bg-primary hover:bg-opacity-95 text-white font-extrabold py-5 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95 text-xl flex items-center justify-center gap-3"
              >
                Confirm and Send Request from 3
                <span className="material-symbols-outlined">
                  <IoSend size={20} />
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-600 text-center max-w-lg">
              By clicking "Confirm and Send Request", your inquiry will be
              prioritized. A specialized account manager will contact you with a
              detailed proposal and contract draft within 24 hours.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
