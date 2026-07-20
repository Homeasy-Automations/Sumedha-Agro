import React from "react";
import { MdEco } from "react-icons/md";
import { IoMdArrowForward } from "react-icons/io";
import { FaNutritionix } from "react-icons/fa";
import { MdOutlineRecycling } from "react-icons/md";
import { MdInventory } from "react-icons/md";
import { FaFlag } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";
import { PiPottedPlant } from "react-icons/pi";
import { MdOutlineVisibility } from "react-icons/md";
import { IoIosTrendingUp } from "react-icons/io";
import { MdOutlinePublic } from "react-icons/md";
import a1 from "../assets/a1.png";
import a2 from "../assets/a2.png";
import a3 from "../assets/a3.png";
import a4 from "../assets/a4.jpeg";
// import { FaLeaf, FaUtensils, FaCheckCircle } from "react-icons/fa";
// import { RiMicroscopeFill } from "react-icons/ri";
// import { MdWaterDrop } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";

// const container = {
//   hidden: {},
//   show: {
//     transition: {
//       staggerChildren: 0.12,
//       delayChildren: 0.1,
//     },
//   },
// };

// const item = {
//   hidden: { opacity: 0, y: 40, scale: 0.95 },
//   show: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: {
//       duration: 0.5,
//       ease: [0.22, 1, 0.36, 1],
//     },
//   },
// };
const data = [
  {
    icon: <FaRegLightbulb />,
    name: "Research and development",
    content:
      "The lab is involved in scientific studies on mushroom biodiversity, cultivation technologies, and nutrition enhancement; it has developed complete end-to-end cultivation system for Button mushroom (Agaricus bisporus), Oyster mushrooms (Pleurotus sps.), Paddy straw mushroom (Volvariella volvacea), Milky mushroom (Calocybe indica), Reishi mushroom (Ganoderma lucidum), Shiitake mushroom (Lentinula edodes), Giant mushroom (Stropharia ruguso- annulata) and is actively researching other verities like Lion’s Mane Mushroom (Hericium erinaceus), King Oyster mushroom (Pleurotus eryngii), Beech mushroom (Hypsizygus tessulatus), and Black poplar Velvet Pioppino mushroom (Cyclocybe cylindracea).",
  },
  {
    icon: <FaRegLightbulb />,
    name: "Research and development",
    content:
      "The lab is involved in scientific studies on mushroom biodiversity, cultivation technologies, and nutrition enhancement; it has developed complete end-to-end cultivation system for Button mushroom (Agaricus bisporus), Oyster mushrooms (Pleurotus sps.), Paddy straw mushroom (Volvariella volvacea), Milky mushroom (Calocybe indica), Reishi mushroom (Ganoderma lucidum), Shiitake mushroom (Lentinula edodes), Giant mushroom (Stropharia ruguso- annulata) and is actively researching other verities like Lion’s Mane Mushroom (Hericium erinaceus), King Oyster mushroom (Pleurotus eryngii), Beech mushroom (Hypsizygus tessulatus), and Black poplar Velvet Pioppino mushroom (Cyclocybe cylindracea).",
  },
  {
    icon: <FaRegLightbulb />,
    name: "Research and development",
    content:
      "The lab is involved in scientific studies on mushroom biodiversity, cultivation technologies, and nutrition enhancement; it has developed complete end-to-end cultivation system for Button mushroom (Agaricus bisporus), Oyster mushrooms (Pleurotus sps.), Paddy straw mushroom (Volvariella volvacea), Milky mushroom (Calocybe indica), Reishi mushroom (Ganoderma lucidum), Shiitake mushroom (Lentinula edodes), Giant mushroom (Stropharia ruguso- annulata) and is actively researching other verities like Lion’s Mane Mushroom (Hericium erinaceus), King Oyster mushroom (Pleurotus eryngii), Beech mushroom (Hypsizygus tessulatus), and Black poplar Velvet Pioppino mushroom (Cyclocybe cylindracea).",
  },
];

export default function About() {
  //  const services = [
  //   {
  //     title: "Spawn Supply",
  //     icon: <FaLeaf />,
  //     desc: "Premium quality spawn ensuring high yield, faster growth, and reliable cultivation.",
  //   },
  //   {
  //     title: "Mushroom Training",
  //     icon: <RiMicroscopeFill />,
  //     desc: "Hands-on training programs covering cultivation, business setup, and scaling.",
  //   },
  //   {
  //     title: "Growing Kits",
  //     icon: <FaUtensils />,
  //     desc: "Easy-to-use kits for beginners and home growers to start mushroom farming instantly.",
  //   },
  //   {
  //     title: "Compost",
  //     icon: <MdWaterDrop />,
  //     desc: "High-quality compost designed for optimal mushroom growth and sustainable farming.",
  //   },
  //   {
  //     title: "Future Growth",
  //     icon: <FaChartLine />,
  //     desc: "Building a stronger national brand for nutrition, sustainability, and agri entrepreneurship.",
  //   },
  // ];

  return (
    <main>
      {/* <!-- Hero Section --> */}
      <section className="w-full max-w-1280px px-4 md:px-10 py-12 md:py-20">
        <div className="@container">
          <div className="flex flex-col-reverse gap-8 md:gap-12 md:flex-row items-center">
            <div className="flex flex-col gap-6 md:w-1/2 items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-sm">
                  <MdEco />
                </span>
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Who We Are
                </span>
              </div>
              <h1 className="text-text-main dark:text-black text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Mushroom Seed Production Laboratory <br className="hidden lg:block" />{" "}
                through{" "}
                <span className="text-primary underline decoration-4 underline-offset-4 decoration-primary/30">
                  Fungi
                </span>
              </h1>
              <p className="text-text-main/80 dark:text-gray-500 text-lg md:text-xl font-normal leading-relaxed max-w-xl">
                The SAMSPL operated for Quality Mushroom Spawn production and training program With a clear mission to integrate mushrooms into mainstream Indian diets and contribute to the farmers double income with rural and urban economy,
 the lab’s efforts are strategically aligned to address some of the most pressing the challenges faced by society today such as youth unemployment, malnutrition,
 women’s empowerment, and management of agricultural waste.
For thousands of years,
 mushrooms—one of nature's oldest and most varied organisms—have been valued for their gastronomic, medicinal,
 and even cultural and spiritual qualities. Psilocybin mushrooms were referred to as Teonanácatl "Flesh of the God" by ancient Mesoamerican tribes such as the Maya and Aztecs, 
who used them in holy rites to converse with gods. The red-and-white Amanita muscaria (Glückspilz) mushroom is considered lucky in German and other European mythology.
We are striving to make mushrooms generally available,
 economically feasible, and socially acceptable through cutting-edge facilities, community-based training, 
and knowledge-sharing programs. This guarantees that they can make a significant contribution to grassroots entrepreneurship as well as national and nutritional goals.
              </p>
            </div>
            <div className="w-full md:w-1/2 aspect-4/3 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 relative group">
              <div className="absolute inset-0 bg-gradient-tot from-black/50 to-transparent z-10"></div>
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                data-alt="Close up of fresh oyster mushrooms growing in a controlled environment farm"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbdXb-0k0Ao_ZE41Wze6SYb_JsNjOXv01IvoKYb6NqJYta8fARLbKBZ7KL8l3GYSQdskunv4ZljmFzmayVzts-bKsXtzPB2hO9NUjH-D_mDuQ8HhFUGsDQFfx9bP3PtV8emEYFlfwwIF3co5WEyD2ZyTIQStko6LHvBbs-vq_cqoYV232kkZSC4yfsDUOcZkOKAc1IRBz-SGurOW9AGVxPjMwOAkBgv_ehDGSYAs7CKAtlSfNsVawE3MjrTaZ6Ssum48DYi84y_ZQ')",
                }}
                //                 style='background-image:
                //  url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbdXb-0k0Ao_ZE41Wze6SYb_JsNjOXv01IvoKYb6NqJYta8fARLbKBZ7KL8l3GYSQdskunv4ZljmFzmayVzts-bKsXtzPB2hO9NUjH-D_mDuQ8HhFUGsDQFfx9bP3PtV8emEYFlfwwIF3co5WEyD2ZyTIQStko6LHvBbs-vq_cqoYV232kkZSC4yfsDUOcZkOKAc1IRBz-SGurOW9AGVxPjMwOAkBgv_ehDGSYAs7CKAtlSfNsVawE3MjrTaZ6Ssum48DYi84y_ZQ");'
              ></div>
              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-white text-sm font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-1">
                  Live from Lab
                </p>
                {/* <p className="text-white font-bold">Smart Hydroponic Unit 04</p> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Stats Grid --> */}
      <section className="w-full bg-white dark:bg-surface-dark py-16 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-1280px mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 ">
            <div className="max-w-6xl  flex-col text-center mx-auto">
              <h2 className="text-text-main dark:text-black text-5xl font-bold leading-tight mb-3 flex flex-col text-center">
                Why Mushrooms?
              </h2>

              <p className="text-text-main/70 dark:text-gray-500 text-xl">
                {/* Our data-driven approach yields superior nutritional profiles
                with minimal environmental footprint. For thousands of years,
                mushrooms—one of nature&#39;s oldest and most varied organisms
                have been valued for their gastronomic, medicinal, and even
                cultural and spiritual qualities. We are striving to make
                mushrooms generally available, economically feasible, and
                socially acceptable through cutting-edge facilities,
                community-based training, and knowledge-sharing programs. This
                guarantees that they can make a significant contribution to
                grassroots entrepreneurship as well as national and nutritional
                goals. */}
                Mushrooms are nutritious, sustainable, and high-potential crops.
                They require fewer resources, support rural income, and create 
                opportunities in fresh food, health products, and value-added industries.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3 rounded-2xl p-8 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary text-primary group-hover:text-black transition-colors">
                <span className="material-symbols-outlined">
                  <FaNutritionix size={30} />
                </span>
              </div>
              <p className="text-text-main dark:text-slate-300 text-base font-medium leading-normal">
                Protein Content
              </p>
              <p className="text-text-main dark:text-white text-4xl font-black leading-tight tracking-tight">
                3.5g{" "}
                <span className="text-lg font-medium text-text-main/60 dark:text-slate-500">
                  per 100g
                </span>
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[85%]"></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl p-8 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary text-primary group-hover:text-black transition-colors">
                <span className="material-symbols-outlined">
                  <MdOutlineRecycling size={30} />
                </span>
              </div>
              <p className="text-text-main dark:text-slate-300 text-base font-medium leading-normal">
                Sustainability Score
              </p>
              <p className="text-text-main dark:text-white text-4xl font-black leading-tight tracking-tight">
                98{" "}
                <span className="text-lg font-medium text-text-main/60 dark:text-slate-500">
                  / 100
                </span>
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[98%]"></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl p-8 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary text-primary group-hover:text-black transition-colors">
                <span className="material-symbols-outlined">
                  <MdInventory size={30} />
                </span>
              </div>
              <p className="text-text-main dark:text-slate-300 text-base font-medium leading-normal">
                Annual Yield
              </p>
              <p className="text-text-main dark:text-white text-4xl font-black leading-tight tracking-tight">
                500+{" "}
                <span className="text-lg font-medium text-text-main/60 dark:text-slate-500">
                  Tons
                </span>
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[70%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-white dark:bg-surface-dark py-10 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-1280px mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4 ">
            <div className="max-w-6xl  flex-col text-center mx-auto">
              <h2 className="text-text-main dark:text-black text-5xl font-bold leading-tight mb-3 flex flex-col text-center">
                Our Focus Area?
              </h2>
              <p className="text-xl">
                {/* We focus on research; spawn production, training, conservation,
                and sustainable technologies to promote mushrooms as a delicious
                and nutritious food, income source and ecofriendly solution. */}
                We work across the complete mushroom value chain to create income, 
                nutrition, and scalable agricultural growth.
              </p>
            </div>
            </div>
           
          {/* Card */}
          <div className="">
            {data.map((d, index) => {
              <div key={index} className="border w-72  p-4">
                <div className="flex items-center gap-2 mb-5">
                  icon{d.icon}
                  <h1>Research and Development {d.name}</h1>
                </div>
                <div>
                  <p>
                    {/* The lab is involved in scientific studies on mushroom
                    biodiversity, cultivation technologies, and nutrition
                    enhancement; it has developed complete end-to-end
                    cultivation system for Button mushroom (Agaricus bisporus),
                    Oyster mushrooms (Pleurotus sps.), Paddy straw mushroom
                    (Volvariella volvacea), Milky mushroom (Calocybe indica),
                    Reishi mushroom (Ganoderma lucidum), Shiitake mushroom
                    (Lentinula edodes), Giant mushroom (Stropharia ruguso-
                    annulata) and is actively researching other verities like
                    Lion’s Mane Mushroom (Hericium erinaceus), King Oyster
                    mushroom (Pleurotus eryngii), Beech mushroom (Hypsizygus
                    tessulatus), and Black poplar Velvet Pioppino mushroom
                    (Cyclocybe cylindracea). */}
                    {d.content}
                  </p>
                </div>
              </div>
            })}
          </div>
        </div>
      </section>
      {/* <!-- Mission & Vision --> */}
      <section className="w-full max-w-1280px px-4 md:px-10 py-12 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* <!-- Mission Card --> */}
          <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="size-14 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                <FaFlag size={30} />
              </span>
            </div>
            <div>
              <h2 className="text-text-main dark:text-black text-2xl font-bold leading-tight mb-3">
                Our Mission
              </h2>
              <p className="text-text-main/80 dark:text-gray-500 text-sm leading-relaxed">
                {/* To revolutionize global nutrition by making sustainable,
                zero-waste mushroom cultivation accessible, scalable, and highly
                efficient through technology. */}
                {/* To make mushroom cultivation accessible, profitable, and 
                sustainable through innovation, training, and quality products. */}
                To make mushroom cultivation accessible, profitable, and sustainable through innovation, training, and quality products.
We empower farmers, youth, and women with practical mushroom farming skills, reliable mushroom seed, and modern growing solutions.
Our mission is to create better livelihoods, healthier food choices, and long-term agricultural growth through mushrooms.
              </p>
            </div>
          </div>
          {/* <!-- Vision Card --> */}
          <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute bottom-0 left-0 p-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
            <div className="size-14 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                <MdOutlineVisibility size={30} />
              </span>
            </div>
            <div>
              <h2 className="text-text-main dark:text-black text-2xl font-bold leading-tight mb-3">
                Our Vision
              </h2>
              <p className="text-text-main/80 dark:text-gray-500 text-sm leading-relaxed">
                {/* To become the undisputed global leader in AI-driven agritech and
                functional foods, creating a healthier planet one spore at a
                time. */}
                {/* To become a trusted leader in mushroom farming, functional foods, 
                and farmer-led rural transformation. */}
                To become a trusted leader in mushroom farming, functional foods, and farmer-led rural transformation.
We envision a future where mushroom cultivation drives nutrition, entrepreneurship, and sustainable income across rural and urban communities.
Our goal is to build one of India’s most respected mushroom brands known for quality, impact, and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Timeline Section --> */}
      <section className="w-full bg-slate-50 dark:bg-black/20 py-16 md:py-24">
        <div className="max-w-960px mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-text-main dark:text-black text-3xl font-bold mb-4">
              Our Growth Journey
            </h2>
            <p className="text-text-main/70 dark:text-slate-400">
              From a backyard lab to global exports.
            </p>
          </div>
          <div className="relative">
            {/* <!-- Vertical Line --> */}
            <div className="absolute left-4 md:left-1/2 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700 md:-translate-x-1/2"></div>
            {/* <!-- Timeline Item 1 --> */}
            <div className="relative z-10 mb-12 flex flex-col md:flex-row items-start md:items-center w-full group">
              <div className="md:w-1/2 md:pr-12 md:text-right pl-12 md:pl-0">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  {/* Inception*/}Foundation &amp; Research
                </h3>
                <p className="text-primary font-bold text-sm mb-2">2018</p>
                <p className="text-text-main/70 dark:text-slate-400">
                  {/* Started with a small team of biologists researching high-yield
                  spore strains. */}
                  Started a vision to build reliable mushroom farming solutions 
                  through science and training.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 w-8 h-8 rounded-full border-4 border-white group-hover:border-primary bg-white group-hover:bg-primary dark:border-background-dark md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center shadow-lg transition-colors duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-[14px] font-bold transition-colors duration-300">
                  <FaRegLightbulb size={30} />
                </span>
              </div>
              <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
            </div>
            {/* <!-- Timeline Item 2 --> */}
            <div className="relative z-10 mb-12 flex flex-col md:flex-row items-start md:items-center w-full group">
              <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
              <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 w-8 h-8 rounded-full border border-white group-hover:border-primary bg-white group-hover:bg-primary dark:border-background-dark md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center shadow-lg transition-colors duration-300 border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-[16px] transition-colors duration-300">
                  <PiPottedPlant size={30} />
                </span>
              </div>
              <div className="md:w-1/2 md:pl-12 pl-12">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  {/* First Smart Farm */}
                  Spawn & Cultivation Expansion
                </h3>
                <p className="text-primary font-bold text-sm mb-2">2020</p>
                <p className="text-text-main/70 dark:text-slate-400">
                  {/* Launched our pilot IoT-enabled farm, achieving 40% higher
                  yield than traditional methods. */}
                  Expanded into quality spawn production and modern cultivation systems.
                </p>
              </div>
            </div>
            {/* <!-- Timeline Item 3 --> */}
            <div className="relative z-10 mb-12 flex flex-col md:flex-row items-start md:items-center w-full group">
              <div className="md:w-1/2 md:pr-12 md:text-right pl-12 md:pl-0">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  {/* Market Expansion */}
                  Training & Farmer Support
                </h3>
                <p className="text-primary font-bold text-sm mb-2">2022</p>
                <p className="text-text-main/70 dark:text-slate-400">
                  {/* Partnered with 50+ local grocery chains and launched our
                  direct-to-consumer line. */}
                  Empowered farmers, youth, and women through mushroom training programs.
                </p>
              </div>
              <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 w-8 h-8 rounded-full border-4 border-white group-hover:border-primary bg-white group-hover:bg-primary dark:border-background-dark md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center shadow-md border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-[16px] transition-colors duration-300">
                  <IoIosTrendingUp size={30} />
                </span>
              </div>
              <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
            </div>
            {/* <!-- Timeline Item 4 --> */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center w-full group">
              <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
              <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 w-8 h-8 rounded-full border-4 border-white group-hover:border-primary bg-white group-hover:bg-primary dark:border-background-dark md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center shadow-md border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-[16px] transition-colors duration-300">
                  <MdOutlinePublic size={30} />
                </span>
              </div>
              <div className="md:w-1/2 md:pl-12 pl-12">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  {/* Global Export */}
                  Processed Foods & Markets
                </h3>
                <p className="text-primary font-bold text-sm mb-2">2024</p>
                <p className="text-text-main/70 dark:text-slate-400">
                  {/* Shipping freeze-dried functional mushroom powders to Europe
                  and North America. */}
                  Launched value-added mushroom products and expanded commercial partnerships.
                </p>
              </div>
            </div>
            {/* <!-- Timeline Item 5 --> */}
            <div className="relative z-10 mt-12 flex flex-col md:flex-row items-start md:items-center w-full group">
              
              {/* LEFT CONTENT (same as Item 1 & 3 pattern) */}
              <div className="md:w-1/2 md:pr-12 md:text-right pl-12 md:pl-0">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  Future Growth
                </h3>

                <p className="text-primary font-bold text-sm mb-2">2026</p>

                <p className="text-text-main/70 dark:text-slate-400">
                  {/* Expanding into national markets, strengthening brand presence,
                  and scaling sustainable mushroom-based products and entrepreneurship. */}
                  Building a stronger national brand for nutrition, sustainability, and agri entrepreneurship
                </p>
              </div>

              {/* ICON (center line) */}
              <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 
                              w-8 h-8 rounded-full border-4 border-white
                              group-hover:border-primary 
                              dark:border-background-dark 
                              bg-white dark:bg-surface-dark 
                              group-hover:bg-primary 
                              md:-translate-x-1/2 md:-translate-y-1/2 
                              flex items-center justify-center shadow-md 
                              border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-[16px] transition-colors duration-300">
                  <FaChartLine size={24} />
                </span>
              </div>

              {/* EMPTY RIGHT SIDE */}
              <div className="md:w-1/2 md:pl-12 hidden md:block"></div>

            </div>
          </div>
        </div>
      </section>

      {/* <section className="relative py-28 px-4 md:px-20 lg:px-40 bg-gradient-to-b from-[#f8fff8] to-[#eaffea] dark:from-[#0b130b] dark:to-[#071007] overflow-hidden">
        {/* Background glow 
        <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-green-400/20 blur-[140px] rounded-full"></div>
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-green-600/20 blur-[140px] rounded-full"></div>

        <div className="relative max-w-6xl mx-auto text-center">

          {/* Badge 
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-green-200 bg-white/70 backdrop-blur-md text-green-700 text-xs font-bold uppercase tracking-widest mb-6">
            🌿 Our Vision
          </div>

          {/* Heading 
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Shaping a Sustainable <br />
            <span className="text-green-600">Future</span> Together
          </h2>

          {/* Subtitle 
          <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            We are committed to empowering farmers, promoting healthy living,
            and driving innovation in the mushroom industry.
          </p>

          {/* Cards 
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8"
          >
            {services.map((s, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -10, scale: 1.03 }}
                className={`
                  group relative rounded-2xl p-8 
                  bg-white/40 dark:bg-white/5 
                  backdrop-blur-xl 
                  border border-white/30 dark:border-white/10
                  shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_25px_80px_rgba(0,128,0,0.15)]
                  transition-all duration-300
                  
                  col-span-1 sm:col-span-2
                  ${i === 3 ? "lg:col-start-2 lg:col-span-2" : ""}
                  ${i === 4 ? "lg:col-start-4 lg:col-span-2" : ""}
                `}
              >

                {/* Hover glow 
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                {/* Icon 
                <div className="w-16 h-16 mx-auto mb-5 rounded-full 
                    bg-white/80 backdrop-blur-md shadow-md 
                    flex items-center justify-center 
                    text-green-600 text-2xl 
                    group-hover:bg-green-500 group-hover:text-white transition">
                  {s.icon}
                </div>

                {/* Title 
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {s.title}
                </h3>

                {/* Divider 
                <div className="w-10 h-[2px] bg-green-500 mx-auto my-3"></div>

                {/* Desc 
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {s.desc}
                </p>

              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* <!-- Team Section --> */}
      <section className="w-full  bg-slate-100 max-w-1280px px-4 md:px-10 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">
            Our Leadership
          </span>
          <h2 className="text-text-main dark:text-black text-3xl font-bold mb-2">
            Cultivators of Innovation
          </h2>
          <p className="text-text-main/70 dark:text-slate-400">
              A dedicated team combining research, business, agriculture, and 
              execution to shape the future of mushroom farming.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* <!-- Team Member 1 --> */}
          <div className="group flex flex-col items-center">
            <div className="w-40 h-50 rounded-full overflow-hidden border-4 border-white dark:border-surface-dark shadow-lg mb-6 relative group-hover:border-primary transition-colors duration-300">
              <div
                style={{
                  backgroundImage:
                    `url(${a3})`
                }}
                className="w-full h-full bg-cover bg-center"
                data-alt="Portrait of Dr. Enespa Singh"
                // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDF79cuIwmXLA6Q2NoOuufqZdlfKtSM8Cr-46rsy3iU5zWcyMKfjp0ZP-06thn2TjIUtfq4Ak7q8APTr49oq2cVToBo3umvWlMehY1wYbG_1QtFvu8eHoD03b_1WKoT81_2KFZiAECGfDuiSoJOYpYAfpFs0f_6aAXEEXGHKyhnv8ygegbK0Cj4kV0rKaXwlWHApbKSiv23NkP2G_NhTXu1vwQ7C9T8931hzv95fvR1wPlhmTLGnVIdv7m9u48yI8J9rIYAeNxn460");'
              ></div>
            </div>
            <h3 className="text-lg font-bold text-text-main dark:text-black">
              Dr. Enespa Singh
            </h3>
            <p className="text-sm text-primary font-medium mb-3">
              Founder
            </p>
            <p className="text-sm text-text-main/60 dark:text-slate-400 text-center px-4">
              Expert in spore genetics with 15 years in agricultural biotech.
            </p>
          </div>
          {/* <!-- Team Member 2 --> */}
          <div className="group flex flex-col items-center">
            <div className="w-40 h-50 rounded-full overflow-hidden border-4 border-white dark:border-surface-dark shadow-lg mb-6 relative group-hover:border-primary transition-colors duration-300">
              <div
                style={{
                  backgroundImage:
                    `url(${a2})`
                }}
                className="w-full h-full bg-cover bg-center"
                data-alt="Portrait of Dr. Prem Singh"
                // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAS_7DbLu61mAzK0g9CBhEm9XW9XFRzqQZYfDXMt461IC88K3a4DVLrPmLambUGZ9jFUewW7XAMS5plqCTia6pQ87hSzFOkFFWR_OrZz5BUzO2Py2bEZ6T2uH3vlt0QHSySTU9O1Q8LuUN3V6cn2i_JY4LlpSr-KOJTOVSnBEypZ7_bjBlx55vQBRJ3IMJhE7iDqNR5nifLzGjk-VIFhhES9MRvrGUs1NvNfZfzJkPsiSF_panDjpWPRQiM55HhLIRNs2LuUPDy_8M");'
              ></div>
            </div>
            <h3 className="text-lg font-bold text-text-main dark:text-black">
              Dr. Prem Chandra
            </h3>
            <p className="text-sm text-primary font-medium mb-3">
              Co-Founder
            </p>
            <p className="text-sm text-text-main/60 dark:text-slate-400 text-center px-4">
              Supply chain wizard optimizing farm-to-table logistics.
            </p>
          </div>
          {/* <!-- Team Member 3 --> */}
          <div className="group flex flex-col items-center">
            <div className="w-40 h-50 rounded-full overflow-hidden border-4 border-white dark:border-surface-dark shadow-lg mb-6 relative group-hover:border-primary transition-colors duration-300">
              <div
                style={{
                  backgroundImage:
                    `url(${a1})`
                }}
                className="w-full h-full bg-cover bg-center"
                data-alt="Portrait of Surjeet Singh"
                // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzXSMuclTayKwyXZ1eMfJTS34Xq_bVSiiKGg4v_fIUJxCn9cRXNfuGdAiiLvmkgN5iF6KkZrIE4b7B8jqMugYNpCuxZAFiTKNYeVGnBd7fAq4lu8lMXysZZVVvtfhf40gD6fkwCpy97l3PjTdK-6wZnctJ7Os7GcAJtEkObHi-GnFSs0dKnqxTbZUuaNKgBp8x9sk8DMxyRQNmuXF9bsTZDmikJ_0CuwCE3RhefJaDbnA0dnuvs826wO69S4-C6U2MyQoFT7J81-E");'
              ></div>
            </div>
            <h3 className="text-lg font-bold text-text-main dark:text-black">
              Surjeet Singh
            </h3>
            <p className="text-sm text-primary font-medium mb-3">
              Marketing Head
            </p>
            <p className="text-sm text-text-main/60 dark:text-slate-400 text-center px-4">
              Ensuring our zero-waste promise is kept in every process.
            </p>
          </div>
          {/* <!-- Team Member 4 --> */}
          <div className="group flex flex-col items-center">
            <div className="w-40 h-50 rounded-full overflow-hidden border-4 border-white dark:border-surface-dark shadow-lg mb-6 relative group-hover:border-primary transition-colors duration-300">
              <div
                style={{
                  backgroundImage:
                    `url(${a4})`,
                }}
                className="w-full h-full bg-cover bg-center"
                data-alt="Portrait of Ayush Kumar"
                // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDW5pf-zUrK7L5mk-Tkjmnj0w4kvdE20e1igcqkbLhO1zLd-5R7Ed6s1ApAHwA-HlgCva2RuHXyuQG6fRVYlBXvwHtbSnaiKYBHVOH-zpMFXZSCYdp6I9CsXHcd63VpLurspqHN6GFBqFg2zcF6G7RMx7GyWbz09vnEA66_kcih43I8p43_c8WnyMNcWkTQ4n1dGlitbFhuIUZPmL2YBom_4CBbC21uDgNOM8-IUlxqEwJzXJXB1IkUPQfD-ea1pV_DeEjWOwIEPas");'
              >
            </div>
            </div>
              <h3 className="text-lg font-bold text-text-main dark:text-black">
                Ayush Kumar
              </h3>
              <p className="text-sm text-primary font-medium mb-3">
                Tech Expert
              </p>
              <p className="text-sm text-text-main/60 dark:text-slate-400 text-center px-4">
                {/* Architect of our proprietary AI climate control systems. */}
                Built and manages the company’s website and digital infrastructure.
              </p>
            </div>
        </div>
      </section>
      {/* <!-- CTA Section --> */}
      <section className="w-full px-4 md:px-10 pb-16">
        <div className="max-w-1280px mx-auto rounded-3xl bg-surface-dark text-white overflow-hidden relative">
          {/* <!-- Background pattern overlay --> */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url('background-image: radial-gradient(#13ec13 1px, transparent 1px); background-size: 24px 24px')",
            }}
            //  style="background-image: radial-gradient(#13ec13 1px, transparent 1px); background-size: 24px 24px;"
            //
          ></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-8 bg-green-900">
            <div className="max-w-2xl ">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to grow with us?
              </h2>
              <p className="text-slate-300 text-lg">
                {/* Whether you're a retailer looking for premium produce or an
                investor seeking sustainable opportunities, we'd love to talk. */}
                Whether you are looking for premium products, mushroom training, 
                dealership opportunities, or sustainable farming partnerships, we 
                would love to connect.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              <a href="/contact">
                <button className="flex items-center justify-center rounded-lg h-14 px-8 bg-primary hover:bg-primary/90 transition-all text-[#0d1b0d] text-lg font-bold shadow-lg shadow-primary/25">
                  Partner with Us
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
