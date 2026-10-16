import React, { useState } from "react";
import { MdVerified } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { FaDotCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { IoWater } from "react-icons/io5";
import { TbTemperature } from "react-icons/tb";
import { IoFlaskOutline } from "react-icons/io5";
import { MdSpoke } from "react-icons/md";
import { WiHumidity } from "react-icons/wi";
import { MdOutlineShoppingBasket } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import showcaseOysterImage from "../assets/pages/showcase-oyster.webp";
import panSearedOysterImage from "../assets/pages/recipe-pan-seared-oyster.webp";
import mushroomSoupImage from "../assets/pages/recipe-mushroom-soup.webp";
import mushroomTempuraImage from "../assets/pages/recipe-mushroom-tempura.webp";

export default function Showcase() {
  const [activeTab, setActiveTab] = useState("oyster");
  const navigate = useNavigate();

  const productData = {
  oyster: {
    title: "The Science of Oysters",
    description:
      "Grown in sterile, climate-controlled environments, Oyster mushrooms offer a meaty texture and umami-rich flavor. Known for rapid growth and high nutritional density.",
    moisture: "88–90%",
    temp: "2°C - 4°C",
    nutrition: [
      { name: "Protein", value: "3.3g", width: "45%" },
      { name: "Dietary Fiber", value: "2.3g", width: "35%" },
      { name: "Potassium", value: "420mg", width: "65%" },
    ],
  },

  button: {
    title: "Precision Cultivated Buttons",
    description:
      "Button mushrooms (Agaricus bisporus) are cultivated in controlled compost environments. They offer a mild taste, firm texture, and excellent shelf life for commercial use.",
    moisture: "85–88%",
    temp: "0°C - 2°C",
    nutrition: [
      { name: "Protein", value: "3.1g", width: "40%" },
      { name: "Dietary Fiber", value: "1.2g", width: "25%" },
      { name: "Potassium", value: "318mg", width: "50%" },
    ],
  },

  milky: {
    title: "Tropical Milky Mushrooms",
    description:
      "Milky mushrooms thrive in warm climates and are highly resistant to heat. They have thick flesh, longer shelf life, and are ideal for Indian farming conditions.",
    moisture: "80–85%",
    temp: "4°C - 6°C",
    nutrition: [
      { name: "Protein", value: "3.5g", width: "48%" },
      { name: "Dietary Fiber", value: "2.0g", width: "32%" },
      { name: "Potassium", value: "390mg", width: "60%" },
    ],
  },
};
  const data = productData[activeTab];
  return (
    <main>
      <div className="flex flex-col min-h-screen w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-8 gap-12">
        {/* <!-- Hero Section --> */}
        <section className="@container  bg-slate-50">
          <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 items-center">
            <div className="flex flex-col gap-6 flex-1 text-left">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 w-fit">
                  <span className="material-symbols-outlined text-primary text-sm">
                    <MdVerified />
                  </span>
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">
                    Premium Harvest
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em]">
                  Premium Organic Oyster Mushrooms
                </h1>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                  Cultivated with precision in our sterile, climate-controlled
                  environments for superior texture, savory flavor, and maximum
                  nutritional value.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <button className="bg-primary hover:bg-[#0fd60f] text-[#0d1b0d] h-12 px-8 rounded-lg text-base font-bold transition-all shadow-[0_4px_14px_0_rgba(19,236,19,0.39)] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    <FiDownload />

                  </span>
                  Download Brochure
                </button>
                <button
                      onClick={() => navigate("/get-quote")}
                      className="bg-surface-light border border-gray-200 hover:border-primary text-current h-12 px-8 rounded-lg text-base font-bold transition-all flex items-center gap-2"
                    >
                      Inquire Bulk Order
                    </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl transform rotate-3 scale-95 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div
                style={{
                  backgroundImage:
                    `url(${showcaseOysterImage})`,
                }}
                className="relative w-full aspect-4/3 bg-gray-100 rounded-2xl overflow-hidden shadow-xl bg-cover bg-center"
                data-alt="High resolution close up of fresh oyster mushrooms with dramatic lighting"
              >
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-bold border border-white/20">
                  Fresh Harvest #402
                </div>
              </div>
            </div>
          </div>
        </section>
      {/* <!-- Product Selector / Tabs --> */}
      <section className="border-b bg-slate-50 border-[#cfe7cf] top-[73px] z-40 pt-4">
        <div className="flex overflow-x-auto gap-8 pb-px">
          {/* OYSTER */}
          <button
            onClick={() => setActiveTab("oyster")}
            className={`flex flex-col items-center justify-center min-w-max pb-3 px-2 border-b-[3px] transition-all group ${
              activeTab === "oyster"
                ? "border-primary text-[#0d1b0d]"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
          >
            <div
              className={`p-2 rounded-full mb-2 transition-colors ${
                activeTab === "oyster"
                  ? "bg-primary/10"
                  : "bg-gray-100 group-hover:bg-primary/10"
              }`}
            >
              <BsStars
                size={30}
                className={activeTab === "oyster" ? "text-primary" : ""}
              />
            </div>
            <p className="text-sm font-bold tracking-wide">
              Oyster Mushroom
            </p>
          </button>
          {/* BUTTON */}
          <button
            onClick={() => setActiveTab("button")}
            className={`flex flex-col items-center justify-center min-w-max pb-3 px-2 border-b-[3px] transition-all group ${
              activeTab === "button"
                ? "border-primary text-[#0d1b0d]"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
          >
            <div
              className={`p-2 rounded-full mb-2 transition-colors ${
                activeTab === "button"
                  ? "bg-primary/10"
                  : "bg-gray-100 group-hover:bg-primary/10"
              }`}
            >
              <FaDotCircle
                size={20}
                className={activeTab === "button" ? "text-primary" : ""}
              />
            </div>
            <p className="text-sm font-bold tracking-wide">
              Button Mushroom
            </p>
          </button>
          {/* MILKY */}
          <button
            onClick={() => setActiveTab("milky")}
            className={`flex flex-col items-center justify-center min-w-max pb-3 px-2 border-b-[3px] transition-all group ${
              activeTab === "milky"
                ? "border-primary text-[#0d1b0d]"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
          >
            <div
              className={`p-2 rounded-full mb-2 transition-colors ${
                activeTab === "milky"
                  ? "bg-primary/10"
                  : "bg-gray-100 group-hover:bg-primary/10"
              }`}
            >
              <FaDotCircle
                size={20}
                className={activeTab === "milky" ? "text-primary" : ""}
              />
            </div>
            <p className="text-sm font-bold tracking-wide">
              Milky Mushroom
            </p>
          </button>
        </div>
        {/* 🔥 CONTENT SWITCH */}
        <div className="mt-8">
          {activeTab === "oyster" && (
            <p className="text-center text-lg font-semibold">
              Oyster Mushroom Content
            </p>
          )}
          {activeTab === "button" && (
            <p className="text-center text-lg font-semibold">
              Button Mushroom Content
            </p>
          )}
          {activeTab === "milky" && (
            <p className="text-center text-lg font-semibold">
              Milky Mushroom Content
            </p>
          )}
      </div>
    </section>

    {/* <!-- About & Stats Grid --> */}
    <section className="grid bg-slate-50 grid-cols-1 lg:grid-cols-12 gap-10 py-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold leading-tight mb-4">
                {data.title}
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

              {/* Moisture */}
              <div className="flex items-start gap-3 p-4 bg-surface-light rounded-xl border border-gray-100 shadow-sm">
                <IoWater size={30} className="text-primary mt-1" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide text-gray-500">
                    Moisture
                  </h4>
                  <p className="text-xl font-bold">{data.moisture}</p>
                </div>
              </div>

              {/* Temp */}
              <div className="flex items-start gap-3 p-4 bg-surface-light rounded-xl border border-gray-100 shadow-sm">
                <TbTemperature size={30} className="text-primary mt-1" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide text-gray-500">
                    Storage Temp
                  </h4>
                  <p className="text-xl font-bold">{data.temp}</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE - NUTRITION */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-surface-light rounded-2xl p-6 border border-gray-100 shadow-lg relative overflow-hidden">

              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                Nutritional Profile
                <span className="text-xs font-normal ml-auto">per 100g</span>
              </h3>

              <div className="space-y-6">

                {data.nutrition.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-bold">{item.value}</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

        </section>
        {/* <!-- About & Stats Grid --> 
        <section className="grid  bg-slate-50 grid-cols-1 lg:grid-cols-12 gap-10 py-8">
          {/* <!-- Text Content --> 
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold leading-tight mb-4">
                The Science of Spores
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Grown in a controlled, sterile environment, our Oyster mushrooms
                offer a meaty texture and a delicate, savory flavor profile
                perfect for gourmet applications. We utilize a proprietary
                substrate mix that enhances the protein content and extends
                shelf life naturally.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3 p-4 bg-surface-light rounded-xl border border-gray-100 shadow-sm">
                <span className="material-symbols-outlined text-primary mt-1">
                  <IoWater size={30}/>
                </span>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide text-gray-500">
                    Moisture
                  </h4>
                  <p className="text-xl font-bold">88-90%</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-surface-light rounded-xl border border-gray-100 shadow-sm">
                <span className="material-symbols-outlined text-primary mt-1">
                  <TbTemperature size={30}/>
                </span>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide text-gray-500">
                    Storage Temp
                  </h4>
                  <p className="text-xl font-bold">2°C - 4°C</p>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Nutritional Data Cards --> 
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-surface-light rounded-2xl p-6 border border-gray-100 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  nutrition
                </span>
                Nutritional Profile
                <span className="text-xs font-normal text-gray-800 ml-auto">
                  per 100g
                </span>
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Protein</span>
                    <span className="font-bold">3.3g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full w-[45%]"
                      //   style="width: 45%"
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Dietary Fiber</span>
                    <span className="font-bold">2.3g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full w-[35%]"
                      //   style="width: 35%"
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Potassium</span>
                    <span className="font-bold">420mg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full w-[65%]"
                      //   style="width: 65%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>*/}
        {/* <!-- Cultivation Timeline --> */}
        <section className="py-12  bg-slate-50">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-3">From Lab to Table</h2>
            <p className="text-gray-600">
              Our rigorous 4-step organic cultivation process ensures
              consistency and purity.
            </p>
          </div>
          <div className="relative px-4">
            {/* <!-- Connecting Line (Desktop) --> */}
            <div className="hidden md:block absolute top-26px left-[10%] right-[10%] h-3px bg-gray-200 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* <!-- Step 1 --> */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined"><IoFlaskOutline size={30}/></span>
                </div>
                <h4 className="text-lg font-bold mb-2">Substrate Prep</h4>
                <p className="text-sm text-gray-500">
                  Sterilized wheat straw and organic supplements.
                </p>
              </div>
              {/* <!-- Step 2 --> */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined"></span>
                  <MdSpoke size={30}/>
                </div>
                <h4 className="text-lg font-bold mb-2">Spawning</h4>
                <p className="text-sm text-gray-500">
                  Inoculation with high-yield mother culture.
                </p>
              </div>
              {/* <!-- Step 3 --> */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined"><WiHumidity size={30}/></span>
                </div>
                <h4 className="text-lg font-bold mb-2">Incubation</h4>
                <p className="text-sm text-gray-500">
                  21 days in dark, humidity-controlled rooms.
                </p>
              </div>
              {/* <!-- Step 4 --> */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined"><MdOutlineShoppingBasket size={30} /></span>
                </div>
                <h4 className="text-lg font-bold mb-2">Harvest</h4>
                <p className="text-sm text-gray-500">
                  Hand-picked at peak nutrient density.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Culinary Showcase --> */}
        <section className="py-8  bg-slate-50">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Versatility in the Kitchen
              </h2>
              <p className="text-gray-600">
                Explore culinary possibilities with Sumedha Agro mushrooms.
              </p>
            </div>
            <a
              className="hidden md:flex items-center text-primary font-bold hover:underline gap-1"
              href="#"
            >
              View all recipes
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 40 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                className="w-8 h-6 text-green-400"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M2 12h28M22 6l10 6-10 6" 
                />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <!-- Recipe Card 1 --> */}
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-xl bg-gray-200 relative aspect-[4/3] mb-4">
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                    schedule
                  </span>
                  20 min
                </div>
                <div
                style={{
                    backgroundImage : `url(${panSearedOysterImage})`
                }}
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  data-alt="Gourmet plate of pan seared oyster mushrooms with herbs"
                //   style="
                //   background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHU1-qqOmSeVjwX5xBeRpv4XDkO774f0CA34E5mPI2oqFcVjxv3Jaw8KZh5vFMVdsc8FaIZd8ufPdkFoXvnHvfrWqfgSlZSTTK6YmBdf-O_ofm4vWxNJx7cczHz92zjoRio--5J-N2gZiNxIYGF-8d-1X7XTf_X8fBxEEAQB3KbzZ7pawX3Cg-QgbAhCi3i8ofUxRZBOcKRq0-ynx34yLDstx9zAvR6CDokC4d1_1HuNDTvoXpTkVTKq4QQC2q2qWxSe46SiL1FKY');
                // "
                ></div>
                <div className="absolute inset-0 bg-gradient-tot from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-bold flex items-center gap-2">
                    View Recipe
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 40 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      className="w-8 h-6 text-white"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M2 12h28M22 6l10 6-10 6" 
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                Pan-Seared Delight
              </h3>
              <p className="text-sm text-gray-500">
                Garlic butter glaze with fresh thyme.
              </p>
            </div>
            {/* <!-- Recipe Card 2 --> */}
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-xl bg-gray-200 relative aspect-4/3 mb-4">
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                    schedule
                  </span>
                  45 min
                </div>
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  data-alt="Rich creamy mushroom soup in a rustic bowl"
                  style={{
                    backgroundImage : `url(${mushroomSoupImage})`
                  }}
                //   style="
                //   background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmfPGtCX6XPy-HC1pTk2IkUvmIERPPmGbutXONGHP_4eJVp5e1E8D_rdtRKmoh1ZcZuho_cc5JMvlMXedg_E2cfPu2VSQbYq9o5rIIHjkFMjlrBNJPk0HVdBK7ofI_bDtxeJsn7zpfCoFF39DCUrjFD7DCBsQTBIN3cUtNP-a0T-OvRCU3gHf-6aGoStAFCsnbqHfYD8Qk2Sc7Yp4n8j7zsXJIb6mgJviVml9RSQ0x6SnS_HkqgbAMDGR2dvn6i2kMv3_rWuyDzsw');
                // "
                ></div>
                <div className="absolute inset-0 bg-gradient-tot from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-bold flex items-center gap-2">
                    View Recipe
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 40 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      className="w-8 h-6 text-white"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M2 12h28M22 6l10 6-10 6" 
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                Creamy Wild Soup
              </h3>
              <p className="text-sm text-gray-500">
                Rich umami flavor base for soups.
              </p>
            </div>
            {/* <!-- Recipe Card 3 --> */}
            <div className="group cursor-pointer">
              <div className="overflow-hidden rounded-xl bg-gray-200 relative aspect-4/3 mb-4">
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                    schedule
                  </span>
                  15 min
                </div>
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  data-alt="Crispy fried mushroom tempura with dipping sauce"
                  style={{
                    backgroundImage : `url(${mushroomTempuraImage})`
                  }}
                //   style="
                //   background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8c8bBrbqil14q4dJPOfZXoFw2e73DntSFJT_HwuQYNieQ43IMXhSsXwlV2SXIaEQF90FJkLF-oIFvPxoE0WJoMYuN_1MYrB48FSmLIoQqRkzRJkjlq20hr9kiecVzcEQtZSun_grj58XZcyMZWIGjb0fjKu7xd59f0feAKobLzHGJHR0IDsOHlKWzWHHDaSmyUcPz6YJ_JWiB49cCH7_3dCABVHhaRYD1L_DYy5NC7_Kwm_-hWZ0VUvqTWsXwQz2lHOhbaOJlYXE');
                // "
                ></div>
                <div className="absolute inset-0 bg-gradient-tot from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-bold flex items-center gap-2">
                    View Recipe
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 40 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      className="w-8 h-6 text-white"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M2 12h28M22 6l10 6-10 6" 
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                Crispy Tempura
              </h3>
              <p className="text-sm text-gray-500">
                Light batter, perfectly golden.
              </p>
            </div>
          </div>
        </section>
        {/* <!-- Bottom CTA --> */}
        <section className="bg-#e7f3e7  bg-slate-50 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border border-primary/20">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#0d1b0d]">
              Ready to stock premium fungi?
            </h2>
            <p className="text-gray-700 max-w-lg">
              Partner with Sumedha Agro for consistent supply chains and
              top-tier organic quality. We offer flexible bulk pricing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <a href="/contact">
            <button className="bg-primary hover:bg-[#0fd60f] text-[#0d1b0d] h-12 px-8 rounded-lg text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap">
              Contact Sales
            </button>
            </a>
            <button className="bg-transparent border-2 border-[#0d1b0d] text-[#0d1b0d] h-12 px-8 rounded-lg text-base font-bold transition-all hover:bg-[#0d1b0d] hover:text-white flex items-center justify-center gap-2 whitespace-nowrap">
              View Pricing
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
