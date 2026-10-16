/* restored from the previous site, October 2026 */
// Sections brought back from the previous version of the site. The copy is the original text,
// exactly as it was published (spelling, punctuation and capitalisation): edit layout in the
// components, not the words here. Icons are the react-icons the original used.
// The client's own text stays in content.js.

import { FaCheckCircle, FaGraduationCap, FaHeartbeat, FaLeaf, FaNutritionix, FaTruck, FaUtensils } from "react-icons/fa";
import { FaFlag } from "react-icons/fa6";
import { GiMushroom } from "react-icons/gi";
import { IoMdArrowForward } from "react-icons/io";
import { LuFlaskConical } from "react-icons/lu";
import { MdEco, MdInventory, MdOutlineRecycling, MdOutlineVisibility, MdWaterDrop } from "react-icons/md";
import { RiMicroscopeFill } from "react-icons/ri";
import liveFromLabImage from "../assets/live-from-lab.webp";
import surjeetSinghImage from "../assets/a1.png";
import premChandraImage from "../assets/a2.png";
import enespaSinghImage from "../assets/a3.png";
import ayushKumarImage from "../assets/a4.jpeg";

// --- Home ---------------------------------------------------------------------

export const trustStrip = [
  { icon: GiMushroom, label: "Quality Spawn Production" },
  { icon: MdOutlineRecycling, label: "Sustainable Farming Solutions" },
  { icon: FaGraduationCap, label: "Expert-Led Instructions" },
  { icon: FaTruck, label: "Trusted Supply Network" },
];

export const whyMushrooms = {
  heading: "Why We Choose Mushrooms?",
  intro: "Mushrooms are more than just food; they are a sustainable solution for nutrition and wellness.",
  items: [
    {
      icon: FaHeartbeat,
      title: "Health Benefits",
      text: "Rich in protein, fiber, and essential nutrients for a healthier lifestyle.",
    },
    {
      icon: FaLeaf,
      title: "Sustainability",
      text: "Uses less land and agricultural waste to create nutritious food.",
    },
    {
      icon: RiMicroscopeFill,
      title: "Innovation",
      text: "Supports farming income, training, and new business opportunities.",
    },
    {
      icon: FaUtensils,
      title: "Versatility",
      text: "Used in fresh foods, powders, pickles, snacks, and many value-added products.",
    },
  ],
};

export const services = {
  eyebrow: "Our Services",
  heading: "Complete Mushroom Ecosystem",
  intro: "From training to production, we provide end-to-end solutions.",
  linkLabel: "Learn more",
  cta: { label: "Apply for Training", to: "/training/apply" },
  // Training first: the home page leads visitors towards the training programme.
  items: [
    {
      icon: RiMicroscopeFill,
      title: "Mushroom Training",
      text: "Hands-on training for farming and business setup.",
      to: "/training",
    },
    {
      icon: FaLeaf,
      title: "Spawn Supply",
      text: "Premium spawn ensuring high yield and faster growth.",
      to: "/spawn-booking",
    },
    {
      icon: FaUtensils,
      title: "Growing Kits",
      text: "Ready-to-use kits for beginners and home growers.",
      to: "/spawn-booking",
    },
    {
      icon: MdWaterDrop,
      title: "Compost",
      text: "Nutrient-rich compost for optimal cultivation.",
      to: "/spawn-booking",
    },
    {
      icon: FaCheckCircle,
      title: "Bulk Supply",
      text: "Reliable supply chain for businesses and retailers.",
      to: "/get-quote",
    },
    {
      icon: LuFlaskConical,
      title: "Research & Development",
      text: "Advanced research in mushroom cultivation, nutrition, and sustainable farming technologies.",
      to: "/about",
    },
  ],
};

export const partnerCta = {
  heading: "Partner with Sumedha Agro",
  text: "Interested in bulk orders or contract farming? Let's discuss how we can grow together.",
  form: {
    fields: {
      name: { label: "Name", placeholder: "Your Name" },
      company: { label: "Company Name", placeholder: "Company Ltd." },
      email: { label: "Email Address", placeholder: "you@example.com" },
      interest: {
        label: "I'm interested in",
        options: ["Fresh Mushrooms (Bulk)", "Processed Products", "Contract Farming", "Other"],
      },
      message: { label: "Message", placeholder: "Tell us about your requirements..." },
    },
    submit: "Send Inquiry",
    errors: {
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Enter valid email",
    },
    // Shown once the inquiry is saved (the previous site showed it in an alert).
    success: "Inquiry sent successfully!",
  },
};

// --- About --------------------------------------------------------------------

export const whoWeAre = {
  badge: { icon: MdEco, label: "Who We Are" },
  // The last word is shown in the primary colour.
  heading: { lead: "Innovating Agriculture through", highlight: "Fungi" },
  text: "Sumedha Agro is an integrated mushroom enterprise focused on quality spawn production, sustainable cultivation, processed foods, farmer training, and future-ready agricultural solutions. We are building a healthier and more profitable mushroom ecosystem.",
  image: {
    src: liveFromLabImage,
    alt: "Close up of fresh oyster mushrooms growing in a controlled environment farm",
    caption: "Live from Lab",
  },
};

export const stats = {
  heading: "Why Mushrooms?",
  text: "Mushrooms are nutritious, sustainable, and high-potential crops. They require fewer resources, support rural income, and create opportunities in fresh food, health products, and value-added industries.",
  // `progress` is the bar's fill in percent, as on the previous site.
  items: [
    { icon: FaNutritionix, label: "Protein Content", value: "3.5g", unit: "per 100g", progress: 85 },
    { icon: MdOutlineRecycling, label: "Sustainability Score", value: "98", unit: "/ 100", progress: 98 },
    { icon: MdInventory, label: "Annual Yield", value: "500+", unit: "Tons", progress: 70 },
  ],
};

export const missionVision = [
  {
    icon: FaFlag,
    title: "Our Mission",
    text: "To make mushroom cultivation accessible, profitable, and sustainable through innovation, training, and quality products. We empower farmers, youth, and women with practical mushroom farming skills, reliable mushroom seed, and modern growing solutions. Our mission is to create better livelihoods, healthier food choices, and long-term agricultural growth through mushrooms.",
  },
  {
    icon: MdOutlineVisibility,
    title: "Our Vision",
    text: "To become a trusted leader in mushroom farming, functional foods, and farmer-led rural transformation. We envision a future where mushroom cultivation drives nutrition, entrepreneurship, and sustainable income across rural and urban communities. Our goal is to build one of India’s most respected mushroom brands known for quality, impact, and innovation.",
  },
];

export const commitment = {
  heading: "Shaping a Sustainable Future Together",
  text: "We are committed to empowering farmers, promoting healthy living, and driving innovation in the mushroom industry.",
};

export const leadership = {
  eyebrow: "Our Leadership",
  heading: "Cultivators of Innovation",
  intro: "A dedicated team combining research, business, agriculture, and execution to shape the future of mushroom farming.",
  members: [
    {
      image: enespaSinghImage,
      alt: "Portrait of Dr. Enespa Singh",
      name: "Dr. Enespa Singh",
      role: "Founder",
      bio: "Expert in spore genetics with 15 years in agricultural biotech.",
    },
    {
      image: premChandraImage,
      alt: "Portrait of Dr. Prem Singh",
      name: "Dr. Prem Chandra",
      role: "Co-Founder",
      bio: "Supply chain wizard optimizing farm-to-table logistics.",
    },
    {
      image: surjeetSinghImage,
      alt: "Portrait of Surjeet Singh",
      name: "Surjeet Singh",
      role: "Marketing Head",
      bio: "Ensuring our zero-waste promise is kept in every process.",
    },
    {
      image: ayushKumarImage,
      alt: "Portrait of Ayush Kumar",
      name: "Ayush Kumar",
      role: "Tech Expert",
      bio: "Built and manages the company’s website and digital infrastructure.",
    },
  ],
};

export const aboutCta = {
  heading: "Ready to grow with us?",
  text: "Whether you are looking for premium products, mushroom training, dealership opportunities, or sustainable farming partnerships, we would love to connect.",
  button: { label: "Partner with Us", to: "/contact" },
};

// --- Footer -------------------------------------------------------------------

export const newsletter = {
  heading: "Stay Updated",
  text: "Subscribe to our newsletter for the latest in agritech.",
  placeholder: "Enter your email",
  submitIcon: IoMdArrowForward,
  submitLabel: "Subscribe", // read by screen readers; the button shows only the arrow
  messages: {
    created: "Subscribed successfully!", // 201
    exists: "You're already subscribed.", // 200
  },
};
