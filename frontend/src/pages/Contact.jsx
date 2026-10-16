import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { IoSend } from "react-icons/io5";
import { MdOutlineExpandMore } from "react-icons/md";
import content from "../data/content";
import PageHeader from "../components/PageHeader";
import ContactBlock from "../components/ContactBlock";

const { contact, nav, ui } = content;

export default function Contact() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    interest: "Fresh Mushrooms (Wholesale)",
    message: ""
  });

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const validate = () => {
  let newErrors = {};

  if (!formData.fullName.trim()) {
  newErrors.fullName = "Name is required";
}


  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!formData.email.includes("@")) {
    newErrors.email = "Enter valid email";
  }

  if (!formData.message) {
    newErrors.message = "Message is required";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};


const handleSubmit = async (e) => {
  e.preventDefault();
if (!validate()) return;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
});


    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
};


  
  return (
    <main>
      <PageHeader crumbs={[{ label: nav.links.contact.label }]} title={contact.heading} />
      <section className="py-8 bg-slate-50 lg:pb-14">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 md:px-10 lg:grid-cols-12">
          {/* Left column: contact details and map */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">{contact.heading}</h2>
              <ContactBlock />
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <iframe
                src={contact.mapEmbedUrl}
                title={contact.mapTitle}
                className="block h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={contact.mapLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-3 py-2 text-xs font-semibold text-slate-900 shadow-md transition hover:bg-green-700 hover:text-white"
              >
                {contact.mapLinkLabel}
                <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only">{ui.opensInNewTab}</span>
              </a>
            </div>
          </div>
          {/*
    <!-- Right Column: Form -->
    */}
          <div className="lg:col-span-7" id="contact-form">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 lg:p-10 shadow-sm">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-slate-500">
                  Our team is ready to answer any questions about our mushroom
                  spawn, fresh produce, or consulting.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/*
            <!-- Full Name -->
            */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      Full Name
                    </span>
                    
                  <input 
                  name="fullName"
                    value={formData.fullName}
                      onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="John Doe"
                          type="text"
                          />
                           {errors.fullName && (
                             <p className="text-red-500 text-sm">{errors.fullName}</p>
                          )}
                  </label>
                  {/*
            <!-- Company Name -->
            */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      Company Name (Optional)
                    </span>
                    <input 
                    name="company"
                     value={formData.company}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Sumedha Farms Ltd."
                      type="text"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/*
            <!-- Email -->
            */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      Email Address
                    </span>
                    <input
                    name="email"
                     value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="john@example.com"
                      type="email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </label>
                  {/*
            <!-- Phone -->
            */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      Phone Number
                    </span>
                    <input
                    name="phone"
                   value={formData.phone}
                    onChange={handleChange}
                      className="w-full rounded-lg border border-green-300 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="+91 98765 43210"
                      type="tel"
                    />
                  </label>
                </div>
                {/*
          <!-- Product Interest -->
          */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    What are you interested in?
                  </span>
                  <div className="relative">
                    <select 
                     name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary">
                      <option>Fresh Mushrooms (Wholesale)</option>
                      <option>Mushroom Spawn</option>
                      <option>Consulting &amp; Training</option>
                      <option>Equipment &amp; Supplies</option>
                      <option>Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <MdOutlineExpandMore className="material-symbols-outlined"/>
                    </div>
                  </div>
                </label>
                {/*
          <!-- Message -->
          */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    Your Message
                  </span>
                  <textarea
                  name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-gray-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Tell us more about your requirements..."
                    rows="4"
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                  )}
                </label>
                {/*
          <!-- Submit Button -->
          */}
                <button
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-base font-bold text-slate-900 transition-transform hover:scale-[1.01] active:scale-[0.99] hover:bg-green-400 shadow-lg shadow-green-500/10"
                  type="submit"
                >
                  <span>Send Message</span>
                  <span className="material-symbols-outlined text-lg">
                    <IoSend />
                  </span>
                </button>
                <p className="text-center text-xs text-slate-500 mt-2">
                  By submitting this form, you agree to our
                  {" "}
                  <Link
                    className="underline hover:text-slate-800"
                    to="/privacy"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
