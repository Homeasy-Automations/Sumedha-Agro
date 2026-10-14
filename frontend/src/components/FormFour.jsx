import React from "react";
import { MdConfirmationNumber } from "react-icons/md";
import { MdSchedule } from "react-icons/md";
import { MdHomeFilled } from "react-icons/md";
import { MdInventory } from "react-icons/md";

export default function FormFour({ referenceId, email }) {
  return (
    // <!-- Main Content -->
    <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* <!-- Abstract Decoration Elements --> */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-earthy-gold/5 rounded-full blur-3xl"></div>
      <div className="w-full max-w-[640px] flex flex-col items-center">
        {/* <!-- Success Illustration Area --> */}
        <div className="mb-8 w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl shadow-primary/10 border border-primary/20 relative">
          <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
          {/* <!-- Main Mushroom Illustration using Icons & Shapes for distinction --> */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="material-symbols-outlined text-[80px] text-primary font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48">
              mouse
            </span>
            <div className="absolute -top-2 -right-2 bg-earthy-gold text-white rounded-full p-2 shadow-lg">
              <span className="material-symbols-outlined text-xl">check</span>
            </div>
          </div>
        </div>
        {/* <!-- Confirmation Message --> */}
        <div className="text-center mb-10">
          <h1 className="text-[#101914] text-4xl font-extrabold tracking-tight mb-4">
            Request Received!
          </h1>
          <p className="text-[#101914]/70 text-lg max-w-[500px] mx-auto leading-relaxed">
            Thank you for your interest in Sumedha Agro's mushroom-based
            solutions. We've received your inquiry and our team is already on
            it.
          </p>
        </div>
        {/* <!-- Info Container --> */}
        <div className="w-full bg-white border border-[#d3e3da] rounded-xl p-8 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#d3e3da]">
            {/* <!-- Reference Number --> */}
            <div className="flex flex-col items-center md:items-start md:pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-sm">
                 <MdConfirmationNumber size={20} />
                </span>
                <span className="text-[#101914]/60 text-xs font-bold uppercase tracking-widest">
                  Reference ID
                </span>
              </div>
              <p className="text-2xl font-black text-[#101914] tracking-tight">
                #{referenceId|| "SAG-XXXXX"}
              </p>
            </div>
            {/* <!-- Timeline Info --> */}
            <div className="flex flex-col items-center md:items-start md:pl-8 pt-6 md:pt-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-sm">
                  <MdSchedule size={20} />
                </span>
                <span className="text-[#101914]/60 text-xs font-bold uppercase tracking-widest">
                  Estimated Wait
                </span>
              </div>
              <p className="text-lg font-semibold text-[#101914] leading-snug">
                24-48 Business Hours
              </p>
              <p className="text-sm text-[#101914]/60 mt-1">
                A representative will reach out shortly.
              </p>
            </div>
          </div>
        </div>
        {/* <!-- Secondary Confirmation Detail --> */}
        <div className="text-center mb-10 px-6">
          <p className="text-[#101914]/60 text-sm">
            A confirmation email has been sent to <strong>{email}</strong>.
            Please check your spam folder if you don't see it in your inbox.
          </p>
        </div>
        {/* <!-- Call to Actions --> */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <a
            className="flex-1 bg-primary text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            href="/"
          >
            <span className="material-symbols-outlined text-lg"><MdHomeFilled size={20} /></span>
            Return to Homepage
          </a>
          <a
            className="flex-1 border-2 border-primary/20 text-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
            href="/get-quote"
          >
            <span className="material-symbols-outlined text-lg">
              <MdInventory size={20} />
            </span>
            Browse More Products
          </a>
        </div>
      </div>
    </main>
  );
}
