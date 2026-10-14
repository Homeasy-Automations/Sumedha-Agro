import React from "react";
import { CiCircleInfo } from "react-icons/ci";
import { FaDatabase } from "react-icons/fa";
import { FaRegListAlt } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa"; 
import { FaPerson } from "react-icons/fa6"; 
import { CiMail } from "react-icons/ci";  
import { FaPrint } from "react-icons/fa6"; 
import { FaDownload } from "react-icons/fa6"; 
import { MdNorth } from "react-icons/md"; 
import { FaRegCheckCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoLocation } from "react-icons/io5";

export default function Privacy() {
  return (
    <section>
      <main className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        {/* <!-- Breadcrumbs --> */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-sans">
          <a className="text-gray-500 hover:text-primary" href="#">
            Home
          </a>
          <span className="text-gray-400">/</span>
          <span className="text-primary font-medium">Privacy Policy</span>
        </nav>
        <div className="flex flex-col lg:flex-row gap-16">
          {/* <!-- Sidebar Table of Contents --> */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-32">
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                Table of Contents
              </h3>
              <ul className="space-y-1 font-sans">
                <li>
                  <a
                    className="flex items-center gap-3 px-3 py-2 rounded bg-primary/10 text-primary font-semibold"
                    href="#intro"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      <CiCircleInfo size={30}/>
                    </span>
                    <span className="text-sm">Introduction</span>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    href="#collection"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-400">
                     <FaDatabase size={20} />
                    </span>
                    <span className="text-sm">Data Collection</span>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    href="#usage"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-400">
                     <FaRegListAlt />
                    </span>
                    <span className="text-sm">How We Use Data</span>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    href="#security"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-400">
                    <FaShieldAlt />
                    </span>
                    <span className="text-sm">Data Security</span>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    href="#rights"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-400">
                     <FaPerson />
                    </span>
                    <span className="text-sm">User Rights</span>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    href="#contact"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-400">
                  <CiMail />
                    </span>
                    <span className="text-sm">Contact Us</span>
                  </a>
                </li>
              </ul>
              <div className="mt-12 p-6 bg-accent-gold/20 rounded border border-accent-gold/30">
                <p className="font-sans text-xs font-bold text-primary uppercase mb-2">
                  Need help?
                </p>
                <p className="text-sm leading-relaxed mb-4">
                  Questions about your data? Reach out to our legal team.
                </p>
                <button className="w-full border border-primary text-primary py-2 text-xs font-bold rounded hover:bg-primary hover:text-white transition-all">
                  LEGAL@SUMEDHA.AGRO
                </button>
              </div>
            </div>
          </aside>
          {/* <!-- Main Content Area --> */}
          <article className="flex-1 max-w-[800px]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-5xl font-black font-sans text-primary tracking-tight mb-4">
                  Privacy Policy
                </h1>
                <div className="inline-block px-3 py-1 bg-gray-100 rounded-sm text-xs font-bold font-sans text-gray-500 uppercase">
                  Last Updated: October 20, 2023
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 border border-gray-200 rounded hover:bg-gray-50"
                  title="Print Document"
                >
                  <span className="material-symbols-outlined text-gray-600">
                    <FaPrint size={30} />
                  </span>
                </button>
                <button
                  className="p-2 border border-gray-200 rounded hover:bg-gray-50"
                  title="Download PDF"
                >
                  <span className="material-symbols-outlined text-gray-600">
                    <FaDownload size={30}/>
                  </span>
                </button>
              </div>
            </div>
            <div className="w-24 h-1 bg-accent-gold mb-12"></div>
            <div className="prose-custom font-display text-lg">
              <section className="mb-16" id="intro">
                <h2 className="text-3xl font-bold font-sans text-gray-900 mb-6">
                  1. Introduction
                </h2>
                <p>
                  Welcome to Sumedha Agro. We are committed to protecting your
                  personal information and your right to privacy. This Privacy
                  Policy describes how your personal information is collected,
                  used, and shared when you visit our agritech portfolio website
                  or interact with our mushroom-based product showcases.
                </p>
                <p>
                  As a leader in the sustainable agritech space, transparency is
                  at the core of our operations. Whether you are a curious
                  consumer, a retail partner, or a sustainable farming
                  enthusiast, we want you to feel secure while exploring our
                  digital ecosystem.
                </p>
              </section>
              <section className="mb-16" id="collection">
                <h2 className="text-3xl font-bold font-sans text-gray-900 mb-6">
                  2. Information We Collect
                </h2>
                <p>
                  When you visit our site, we automatically collect certain
                  information about your device, including information about
                  your web browser, IP address, and time zone. Additionally, as
                  you browse the site, we collect information about the
                  individual web pages or products that you view.
                </p>
                <div className="bg-gray-50 p-8 rounded-lg border-l-4 border-primary my-8">
                  <h4 className="font-sans font-bold text-primary mb-4 uppercase text-sm tracking-widest">
                    Lead Generation Data
                  </h4>
                  <p className="text-base m-0 italic text-gray-600">
                    If you submit an inquiry regarding our mushroom cultivation
                    kits or bulk agro-products, we collect your:
                  </p>
                  <ul className="list-disc ml-6 mt-4 space-y-2 text-base text-gray-700 font-sans">
                    <li>Full Name and Professional Title</li>
                    <li>Business Email Address</li>
                    <li>Contact Phone Number</li>
                    <li>Geographic Region for Shipping Estimates</li>
                    <li>
                      Specific Product Interests (e.g., Oyster Mushroom Spawn,
                      Dried Shiitake)
                    </li>
                  </ul>
                </div>
              </section>
              <section className="mb-16" id="usage">
                <h2 className="text-3xl font-bold font-sans text-gray-900 mb-6">
                  3. How We Use Information
                </h2>
                <p>
                  We use the information that we collect generally to fulfill
                  any requests placed through the Site (including providing you
                  with quotes and arranging for product samples). Furthermore,
                  we use this information to:
                </p>
                <ul className="space-y-4 font-sans text-base mb-8">
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">
                    <FaRegCheckCircle size={20}/>
                    </span>
                    <span>
                      Communicate with you regarding our agritech innovations.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">
                     <FaRegCheckCircle size={20} />
                    </span>
                    <span>
                      Screen our inquiries for potential risk or fraud.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">
                     <FaRegCheckCircle  size={20}/>
                    </span>
                    <span>
                      When in line with the preferences you have shared with us,
                      provide you with information or advertising relating to
                      our mushroom products.
                    </span>
                  </li>
                </ul>
              </section>
              <section className="mb-16" id="security">
                <h2 className="text-3xl font-bold font-sans text-gray-900 mb-6">
                  4. Data Security
                </h2>
                <p>
                  To protect your personal information, we take reasonable
                  precautions and follow industry best practices to make sure it
                  is not inappropriately lost, misused, accessed, disclosed,
                  altered or destroyed.
                </p>
                <p>
                  All lead generation data is stored on secure servers behind
                  robust firewalls. We use SSL (Secure Sockets Layer) encryption
                  for all data transmissions between your browser and our
                  website.
                </p>
              </section>
              <section className="mb-16" id="rights">
                <h2 className="text-3xl font-bold font-sans text-gray-900 mb-6">
                  5. Your Rights
                </h2>
                <p>
                  If you are a resident of certain jurisdictions, you have the
                  right to access personal information we hold about you and to
                  ask that your personal information be corrected, updated, or
                  deleted. If you would like to exercise this right, please
                  contact us through the contact information below.
                </p>
              </section>
              <section
                className="pt-12 border-t border-gray-200"
                id="contact"
              >
                <h2 className="text-3xl font-bold font-sans text-gray-900 mb-6">
                  6. Contact Us
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-primary text-white p-8 rounded-xl shadow-lg">
                    <h4 className="font-sans font-bold text-accent-gold uppercase text-xs tracking-widest mb-4">
                      Direct Inquiry
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-accent-gold">
                          <MdEmail size={30} />
                        </span>
                        <div>
                          <p className="text-xs opacity-70 font-sans uppercase">
                            Email
                          </p>
                          <p className="font-bold">privacy@sumedha.agro</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-accent-gold">
                          <IoLocation size={30} />
                        </span>
                        <div>
                          <p className="text-xs opacity-70 font-sans uppercase">
                            Headquarters
                          </p>
                          <p className="font-bold">
                            12 Agritech Park, Green Valley Road,
                            <br />
                            Maharashtra, India - 400001
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-base text-gray-500 italic mb-4">
                      "Dedicated to transparency and sustainable growth through
                      technological excellence."
                    </p>
                    <img
                      alt="Sumedha Agro farm"
                      className="w-full h-32 object-cover rounded opacity-80 filter grayscale hover:grayscale-0 transition-all duration-500"
                      data-alt="A clean organic mushroom farming facility interior"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA269NDudFC1hyTzpKE7ci5c3JUYciIOkgn6opO9BdJcjsoc8oRiVb7a-jxcNOwNROUP4_QCYi_IGsvgUlkWl3NveP-mar2rfffCXLPcKdmthAYMXy4l-skWTXkujOZW7fLCxtPlNXCX3sIEsuf7Tt4AGt7GwcKCVqGdK_IsaxcE4et0CSnHrQmzcAuGYbCL3Z5sUlLqqq4HXh776FVSVZNTJy5VVhbleI2FfiFBDAI96VOnCvAiwWf--_IUdTLOHLZZrwtHL7vQbs"
                    />
                  </div>
                </div>
              </section>
            </div>
            {/* <!-- Footer Sign-off --> */}
            <div className="mt-20 py-10 border-t border-gray-100 text-center">
              <p className="text-sm font-sans text-gray-400">
                © 2025 Sumedha Agro Pvt. Ltd. All Rights Reserved.
              </p>
            </div>
          </article>
        </div>
      </main>
      {/* <!-- Scroll to Top (Subtle) --> */}
      <button
        className="fixed bottom-8 right-8 size-12 border-2 border-primary text-primary flex items-center justify-center rounded hover:bg-primary hover:text-white transition-all bg-background-light z-50 shadow-sm"
        onclick="window.scrollTo({top: 0, behavior: 'smooth'})"
      >
        <span className="material-symbols-outlined"><MdNorth /></span>
      </button>
    </section>
  );
}
