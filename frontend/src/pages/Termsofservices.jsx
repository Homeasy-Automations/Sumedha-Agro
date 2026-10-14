import React from 'react'
import { FaDownload } from "react-icons/fa6";
import { CiCircleInfo } from "react-icons/ci";
import { MdOutlineEco } from "react-icons/md";
import { MdLocalShipping } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";
import { MdGavel } from "react-icons/md";
import { FaBalanceScale } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";

export default function Termsofservices() {
  return (
    <main class="flex-grow max-w-[1200px] mx-auto w-full px-6 lg:px-20 py-12">
{/* <!-- Breadcrumbs --> */}
<nav class="flex items-center gap-2 mb-8 text-sm font-medium">
<a class="text-primary hover:underline" href="#">Corporate</a>
<span class="text-[#5b8b5b]">/</span>
<span class="text-[#101910]">Legal Documentation</span>
<span class="text-[#5b8b5b]">/</span>
<span class="font-bold">Terms of Service</span>
</nav>
{/* <!-- Page Heading --> */}
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#e9f1e9] pb-8">
<div class="flex flex-col gap-2">
<h1 class="text-5xl lg:text-6xl font-black tracking-tighter text-primary">Terms of Service</h1>
<p class="text-[#5b8b5b] font-medium text-lg italic">Version 2.4.1 | Last Updated: October 24, 2023</p>
</div>
<button class="flex items-center gap-2 px-6 py-3 bg-white border border-[#e9f1e9] text-sm font-bold rounded-sm hover:bg-[#f0f0f0] transition-colors">
<span class="material-symbols-outlined text-lg"><FaDownload /></span>
  DOWNLOAD LEGAL PDF
   </button>
</div>
<div class="flex flex-col lg:flex-row gap-16">
{/* <!-- Sticky Sidebar Navigation --> */}
<aside class="w-full lg:w-64 flex-shrink-0">
<div class="sticky top-28 space-y-8">
<div>
<h3 class="text-xs font-black uppercase tracking-[0.2em] text-[#5b8b5b] mb-4">Table of Contents</h3>
<nav class="flex flex-col gap-1">
<a class="group flex items-center gap-3 px-3 py-2 rounded-sm bg-primary/10 text-primary font-bold text-sm" href="#general">
<span class="material-symbols-outlined text-base">  <CiCircleInfo size={30}/></span>
       1. General Terms
        </a>
<a class="group flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-gray-100 transition-colors text-sm font-medium" href="#usage">
<span class="material-symbols-outlined text-base text-[#5b8b5b]"><MdOutlineEco  size={20}/></span>
     2. Product Usage
   </a>
<a class="group flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-gray-100 transition-colors text-sm font-medium" href="#shipping">
<span class="material-symbols-outlined text-base text-[#5b8b5b]"><MdLocalShipping size={20}/></span>
       3. Shipping Policy
       </a>
<a class="group flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-gray-100 transition-colors text-sm font-medium" href="#user">
<span class="material-symbols-outlined text-base text-[#5b8b5b]"><FaPerson size={20} /></span>
       4. User Obligations
       </a>
<a class="group flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-gray-100 transition-colors text-sm font-medium" href="#liability">
<span class="material-symbols-outlined text-base text-[#5b8b5b]"><MdGavel size={20} /></span>
    5. Liability Limits
     </a>
<a class="group flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-gray-100 transition-colors text-sm font-medium" href="#law">
<span class="material-symbols-outlined text-base text-[#5b8b5b]">
<FaBalanceScale size={20}/></span>
      6. Governing Law
      </a>
</nav>
</div>
<div class="p-4 bg-[#e9f1e9] border-l-4 border-primary">
<p class="text-xs font-bold leading-relaxed">
     Need legal clarification? <br/>
<a class="text-primary underline" href="mailto:legal@sumedhaagro.com">Contact our legal team</a>
</p>
</div>
</div>
</aside>
{/* <!-- Legal Content --> */}
<article class="flex-1 max-w-3xl space-y-16 pb-24 text-[17px] leading-[1.8] text-[#333c45]">
<section class="scroll-mt-32" id="general">
<h2 class="text-3xl font-black text-[#101910] mb-6 flex items-center gap-4">
<span class="text-primary tabular-nums">1.0</span> General Terms
      </h2>
<div class="space-y-4">
<p>By accessing the Sumedha Agro digital ecosystem, you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Sumedha Agro Private Limited regarding your use of our agritech solutions, mushroom-based product portfolio, and logistics tracking systems.</p>
<p>We reserve the right to modify these terms at any interval. Continued use of the platform following updates constitutes acceptance of the revised legal framework.</p>
</div>
</section>
<section class="scroll-mt-32" id="usage">
<h2 class="text-3xl font-black text-[#101910] mb-6 flex items-center gap-4">
<span class="text-primary tabular-nums">2.0</span> Product Usage &amp; Bio-Safety
     </h2>
<div class="space-y-4">
<p>Sumedha Agro specializes in advanced mushroom cultivation and derivative agritech products. Users agree to:</p>
<ul class="list-disc pl-5 space-y-3">
<li>Use products only for their intended agricultural or dietary purposes.</li>
<li>Adhere to the bio-safety guidelines provided with each fungal culture kit.</li>
<li>Refrain from reverse-engineering proprietary cultivation hardware or genetic spore sequences.</li>
</ul>
<div class="mt-6 p-6 bg-yellow-50 border border-yellow-100 rounded-sm">
<h4 class="font-bold text-[#101910] mb-2 flex items-center gap-2">
<span class="material-symbols-outlined"><IoIosWarning size={30}/></span>
     CRITICAL DISCLAIMER
     </h4>
<p class="text-sm text-yellow-800">Sumedha Agro is not responsible for yields affected by external environmental factors, improper storage, or failure to follow precise temperature/humidity protocols provided in the user manual.</p>
</div>
</div>
</section>
<section class="scroll-mt-32" id="shipping">
<h2 class="text-3xl font-black text-[#101910] mb-6 flex items-center gap-4">
<span class="text-primary tabular-nums">3.0</span> Shipping &amp; Logistics
     </h2>
<div class="space-y-4">
<p>Due to the biological nature of our products, shipping is conducted through temperature-controlled logistics partners. Standard delivery windows are 5-10 business days for live cultures and 3-5 days for hardware.</p>
<p>Risk of loss and title for items purchased pass to the customer upon delivery of the items to the carrier. We recommend immediate inspection of biological materials upon arrival.</p>
</div>
</section>
<section class="scroll-mt-32" id="user">
<h2 class="text-3xl font-black text-[#101910] mb-6 flex items-center gap-4">
<span class="text-primary tabular-nums">4.0</span> User Obligations
   </h2>
<div class="space-y-4">
<p>You represent that you have reached the age of majority in your jurisdiction. You are responsible for maintaining the confidentiality of any lead-generation accounts or partner portal credentials.</p>
<p>Unauthorized use of automated systems (bots, scrapers) to extract market data from our portfolio is strictly prohibited and will result in immediate termination of access.</p>
</div>
</section>
<section class="scroll-mt-32" id="liability">
<h2 class="text-3xl font-black text-[#101910] mb-6 flex items-center gap-4">
<span class="text-primary tabular-nums">5.0</span> Limitation of Liability
   </h2>
<div class="space-y-4">
<p>To the maximum extent permitted by applicable law, Sumedha Agro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.</p>
<div class="border-y border-[#e9f1e9] py-6 my-8 font-semibold italic text-primary">
      "Our aggregate liability for all claims relating to the services shall not exceed the amount paid by you to Sumedha Agro for the specific product in question."
      </div>
</div>
</section>
<section class="scroll-mt-32 pb-20" id="law">
<h2 class="text-3xl font-black text-[#101910] mb-6 flex items-center gap-4">
<span class="text-primary tabular-nums">6.0</span> Governing Law
       </h2>
<div class="space-y-4">
<p>These terms shall be governed and construed in accordance with the laws of the Jurisdiction in which Sumedha Agro is registered, without regard to its conflict of law provisions.</p>
<p>Any dispute arising from these terms will be settled through mandatory arbitration in the local municipal courts.</p>
</div>
<div class="mt-20 pt-10 border-t border-[#e9f1e9] flex flex-col md:flex-row items-center gap-8">
  <a href="/">
<button class="w-full md:w-auto px-10 py-4 bg-primary text-white font-black tracking-widest text-sm rounded-sm hover:scale-[0.98] transition-transform">
     Return to Portfolio Homepage
     </button>
    </a>
</div>
</section>
</article>
</div>
</main>
  )
}
