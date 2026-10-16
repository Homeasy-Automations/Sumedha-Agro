// Single source of truth for all visible site copy.
// Client-supplied text below must stay EXACTLY as written (spelling, punctuation,
// capitalisation). Edit layout in the components, not the words here.

import heroImage from "../assets/m1.webp";
import buttonImage from "../assets/m2.webp";
import milkyImage from "../assets/m3.webp";
import bulkImage from "../assets/Bulk.webp";
import labImage from "../assets/live-from-lab.webp";
import shiitakeImage from "../assets/shiitake.webp";
import oysterImage from "../assets/m7.webp";
import spawnImage from "../assets/Seeds.jpg";
import trainingImage from "../assets/hero.jpg";
import aboutTrainingImage from "../assets/Aboutpage training.jpeg";
import homeTrainingImage from "../assets/home training image.jpeg";
// Smaller copies for the home hero collage's small tiles (picked by the browser via srcset).
import heroImageSmall from "../assets/m1-256.webp";
import buttonImageSmall from "../assets/m2-256.webp";
import milkyImageSmall from "../assets/m3-256.webp";
import bulkImageSmall from "../assets/Bulk-480.webp";
import labImageSmall from "../assets/live-from-lab-256.webp";
import shiitakeImageSmall from "../assets/shiitake-480.webp";

const contact = {
  heading: "Contact us",
  address:
    "982 Village Andpurdev, Banthra, Sarojni Nagar, Lucknow 226401, Uttar Pradesh, India",
  phonePrefix: "Mob. ",
  phones: ["+91 9473896285", "+91 9125591178"],
  emailPrefix: "E-mailID-",
  emails: ["info@sumedhaagro.com"],
  webPrefix: "Web. ",
  web: "www.sumedhaagro.com",
  webUrl: "https://www.sumedhaagro.com",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1135.3949008647573!2d80.81553268106272!3d26.712050608067102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bf9ed1fb228ab%3A0x78ecca2da48580d!2sSumedha%20Agro!5e0!3m2!1sen!2sin!4v1791981556950!5m2!1sen!2sin",
  mapTitle: "Map: 982 Village Andpurdev, Banthra, Sarojni Nagar, Lucknow 226401, Uttar Pradesh, India",
  mapLinkUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1135.3949008647573!2d80.81553268106272!3d26.712050608067102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bf9ed1fb228ab%3A0x78ecca2da48580d!2sSumedha%20Agro!5e0!3m2!1sen!2sin!4v1791981556950!5m2!1sen!2sin",
  mapLinkLabel: "Google Maps",
};

const nav = {
  home: { label: "Home", to: "/" },
  about: { label: "About Us", to: "/about" },
  training: { label: "Training", to: "/training" },
  spawnBooking: { label: "Spawn Booking", to: "/spawn-booking" },
  news: { label: "News & Announcements", to: "/news" },
  contact: { label: "Contact Us", to: "/contact" },
  // Sections of other pages (the old /incubation, /value-added and /media URLs redirect here).
  incubation: { label: "Incubation", to: "/training#incubation" },
  valueAdded: { label: "Value Added Products", to: "/spawn-booking#value-added" },
  media: { label: "Media", to: "/news#media" },
  shop: { label: "Shop", to: "/shop" },
  apply: { label: "Apply for Training", to: "/training/apply" },
};

const content = {
  site: {
    name: "Sumedha Agro",
    fullName: "Sumedha Agro — Mushroom Seed (Spawn) Production Laboratory",
    subtitle: "Mushroom Seed (Spawn) Production Laboratory",
    logoAlt: "Sumedha Agro Logo",
  },

  ui: {
    readMore: "Read more",
    contactUs: "Contact us",
    photoCredits: "Photo credits",
    toBeAnnounced: "To be announced",
    more: "More",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    breadcrumb: "Breadcrumb",
    primaryNav: "Primary",
    skipToContent: "Skip to content",
    loading: "Loading",
    opensInNewTab: "(opens in a new tab)",
    playVideo: "Play video",
    watchOn: "Watch on",
    viewImage: "View image",
    close: "Close",
    previous: "Previous",
    next: "Next",
  },

  nav: {
    primary: [nav.home, nav.about, nav.training, nav.spawnBooking, nav.news, nav.contact],
    // Shown as a cart icon at the end of the header, without text (the label is read by screen readers).
    cart: nav.shop,
    // Extra links in a "More" menu (the menu is hidden while this is empty).
    more: [],
    cta: nav.apply,
    links: nav,
  },

  images: {
    // Home hero collage, in reading order (three columns of two; layout in HeroCollage.jsx).
    // width/height: the full image's pixels; small/smallWidth: the smaller copy.
    heroCollage: [
      { src: heroImage, width: 512, height: 512, small: heroImageSmall, smallWidth: 256, alt: "Cluster of oyster mushrooms on a dark background" },
      { src: bulkImage, width: 728, height: 318, small: bulkImageSmall, smallWidth: 480, alt: "Crates of fresh button and brown mushrooms ready for bulk supply" },
      { src: labImage, width: 512, height: 512, small: labImageSmall, smallWidth: 256, alt: "Close up of fresh oyster mushrooms growing in a controlled environment farm" },
      { src: shiitakeImage, width: 768, height: 512, small: shiitakeImageSmall, smallWidth: 480, alt: "Sumedha Agro shiitake mushroom spawn bag with fresh shiitake mushrooms" },
      { src: milkyImage, width: 512, height: 512, small: milkyImageSmall, smallWidth: 256, alt: "Fresh milky mushrooms on a white background" },
      { src: buttonImage, width: 512, height: 512, small: buttonImageSmall, smallWidth: 256, alt: "Basket of fresh white button mushrooms" },
    ],
    oyster: { src: oysterImage, alt: "White oyster mushrooms growing from substrate" },
    spawn: {
      src: spawnImage,
      alt: "Gloved hand holding a bag of oyster mushroom grain spawn in front of shelves of spawn bags",
    },
    training: {
      src: trainingImage,
      alt: "Trainees in white coats seated along a laboratory bench during a mushroom cultivation session",
    },
    // About page, beside "What we do".
    aboutTraining: {
      src: aboutTrainingImage,
      alt: "Trainees gathered around a pile of straw, filling bags with substrate during a hands-on mushroom cultivation session",
    },
    // Home page, Spawn Production Training section.
    homeTraining: {
      src: homeTrainingImage,
      alt: "Trainer explaining a lesson to trainees taking notes at laboratory benches set with flasks and test tubes",
    },
  },

  home: {
    quote:
      "“Edible mushrooms are a gift from nature with therapeutic properties; don't ruin this gift by using chemicals. Growing edible mushrooms protects both the environment and human health”",
  },

  about: {
    label: "About Us",
    eyebrow: "ABOUT US",
    heading: "Mushroom Seed (Spawn) Production Laboratory",
    paragraphs: [
      "The SAMSPL operated for Quality Mushroom Spawn production and training program. With a clear mission to integrate mushrooms into mainstream Indian diets and contribute to the farmer’s double income with rural and urban economy, the lab’s efforts are strategically aligned to address some of the most pressing the challenges faced by society today such as youth unemployment, malnutrition, women’s empowerment, and management of agricultural waste.",
      "For thousands of years, mushrooms—one of nature's oldest and most varied organisms—have been valued for their gastronomic, medicinal, and even cultural and spiritual qualities. Psilocybin mushrooms were referred to as Teonanácatl \"Flesh of the God\" by ancient Mesoamerican tribes such as the Maya and Aztecs, who used them in holy rites to converse with gods. The red-and-white Amanita muscaria (Glückspilz) mushroom is considered lucky in German and other European mythology.",
      "We are striving to make mushrooms generally available, economically feasible, and socially acceptable through cutting-edge facilities, community-based training, and knowledge-sharing programs. This guarantees that they can make a significant contribution to grassroots entrepreneurship as well as national and nutritional goals.",
    ],
    // Heading above the Our Mission / Our Vision cards.
    missionVisionHeading: "Our Mission & Vision",
    // Short summary under the paragraphs above, linking to the pages with the details.
    // Drafted October 2026 at the site owner's request from the site's own pages (not client-supplied text): confirm with the client.
    highlights: {
      heading: "What we do",
      items: [
        {
          icon: "FlaskConical",
          title: "Quality spawn production",
          text: "Pure culture, mother spawn and G1/G2 spawn produced in our own laboratory.",
          to: nav.spawnBooking.to,
        },
        {
          icon: "GraduationCap",
          title: "Hands-on training",
          text: "Practical courses in mushroom cultivation and spawn production for farmers and entrepreneurs.",
          to: nav.training.to,
        },
        {
          icon: "Sprout",
          title: "Incubation facilities",
          text: "On-site spawn incubation and RTF bag incubation for growers.",
          to: nav.incubation.to,
        },
        {
          icon: "ShoppingBag",
          title: "Value-added products",
          text: "Mushroom pickles, protein powder and more products that add value to every harvest.",
          to: nav.valueAdded.to,
        },
      ],
    },
    focus: {
      heading: "Our Focus Area",
      statement:
        "We focus on research; spawn production, training, conservation, and sustainable technologies to promote mushrooms as a delicious and nutritious food, income source and ecofriendly solution.",
      // `icon` is a lucide-react icon name resolved in src/components/Icon.jsx
      items: [
        {
          id: "research-and-development",
          icon: "Microscope",
          title: "Research and Development",
          body: "The lab is involved in scientific studies on mushroom biodiversity, cultivation technologies, and nutrition enhancement; it has developed complete end-to-end cultivation system for Button mushroom (Agaricus bisporus), Oyster mushrooms (Pleurotus sps.), Paddy straw mushroom (Volvariella volvacea), Milky mushroom (Calocybe indica), Reishi mushroom (Ganoderma lucidum), Shiitake mushroom (Lentinula edodes), Giant mushroom (Stropharia ruguso-annulata) and is actively researching other verities like Lion’s Mane Mushroom (Hericium erinaceus), King Oyster mushroom (Pleurotus eryngii), Beech mushroom (Hypsizygus tessulatus), and Black poplar Velvet Pioppino mushroom (Cyclocybe cylindracea).",
        },
        {
          id: "spawn-production-and-supply",
          icon: "Package",
          title: "Spawn production and supply",
          // Drafted October 2026 at the site owner's request (not client-supplied text): confirm with the client.
          body: "The lab produces quality mushroom spawn (seed) in-house, from pure tissue culture and mother spawn to G1, G2 and cultivation spawn, and supplies it to farmers, entrepreneurs and growers together with compost, ready-to-fruit (RTF) bags and growing kits. Spawn can be booked by phone or online.",
        },
        {
          id: "training-and-knowledge-sharing",
          icon: "GraduationCap",
          title: "Training and knowledge sharing",
          body: "Through entrepreneurship and training programs, this laboratory will empower youth, women and rural communities to adopt mushroom cultivation as a sustainable livelihood. Regular practical courses, hand on trainings will be organized, supported by field demonstrations and laboratory facilities.",
        },
        {
          id: "conservation-of-wild-mushroom-germplasm",
          icon: "Sprout",
          title: "Conservation of wild mushroom Germplasm",
          // Drafted October 2026 at the site owner's request (not client-supplied text): confirm with the client.
          body: "The lab collects, identifies and preserves wild mushroom strains as pure cultures, conserving mushroom biodiversity so that valuable strains remain available for research, strain improvement and future spawn production.",
        },
        {
          id: "innovation-and-mechanization",
          icon: "Cog",
          title: "Innovation & mechanization",
          // Drafted October 2026 at the site owner's request (not client-supplied text): confirm with the client.
          body: "The lab develops mechanized quality spawn production, brings solar energy into the spawn production system and turns crop waste into food, helping growers produce good spawn and mushrooms more consistently while making better use of agricultural waste.",
        },
        {
          id: "women-empowerment-through-rtf-bags",
          icon: "Users",
          title: "Women empowerment through RTF Bags",
          body: "Sumedha Agro Lab will develop the concept of ready-to-fruit (RTF) mushroom bags, which will enable more and more women to grow mushrooms at home and turn this initiative into a successful startup model for urban, rural employment and nutrition improvement.",
        },
        {
          id: "value-addition-and-nutrition",
          icon: "Salad",
          title: "Value addition and nutrition",
          body: "Excellent sources of B vitamins (B2, B3, B5, B12), vitamin D (particularly after UV exposure), C, E, potassium, phosphorus, copper, selenium, zinc, iron, and magnesium, as well as antioxidants (phenolic, flavonoids), ergothioneine, and polysaccharides (beta-glucans) with anti-inflammatory, anticancer, antiviral, and immune-boosting qualities. In order to increase shelf life and readily add nutrients to dough, drinks, soups, and supplements, mushrooms are dried (in the sun or oven) and ground into powder. To increase protein, fiber, and minerals, mushroom powder can be used in place of flour in biscuits, bread, cookies, noodles, or papads. Pickled mushrooms (with vinegar and spices) provide a tart, savory condiment with a long shelf life. Creamed soups, sauces made with mushrooms, and canned or frozen mushroom dishes. Mushrooms are perfect for plant-based burgers, sausages, and meat alternatives because of their texture and protein. Extracts for certain health benefits (heart health, immunity) that are utilized as tablets, capsules, and functional meals.",
        },
      ],
    },
  },

  training: {
    heading: "Spawn Production Training",
    sentence:
      "Pure tissue culture production, mother spawn production, G1 and G2 spawn production, cultivation spawn, spawn unit layout, mechanization of spawn production, and incorporation of solar energy into the spawn production system.",
    // The sentence above, split at each comma (one card per item).
    modules: [
      "Pure tissue culture production",
      "Mother Spawn production",
      "G1 and G2 Spawn production",
      "Cultivation Spawn",
      "Spawn unit layout",
      "Mechanization of Spawn production",
      "Incorporation of solar energy into the Spawn production system",
    ],
    scheduleHeading: "Training Schedule",
    applyLabel: "Apply for Training",
  },

  // Training Calendar section of the Training page. Batches come from src/data/trainings.js
  // (or the API); emails and phone numbers in these strings are turned into links on render.
  // notice, tables' headings/notes, notes and terms are defaults: the admin panel can replace
  // them (Training page text; see src/lib/trainingPage.js).
  trainingCalendar: {
    id: "training-calendar",
    heading: "TRAINING CALENDAR",
    notice: {
      label: "Important Instruction:",
      text: "Only Indian Citizens with valid ID Proof can apply to the training programmes",
    },
    columns: {
      sNo: "S. No.",
      programme: "Training Programme",
      date: "Date",
      registration: "Online Registration Dates",
      fee: "Training Fee",
      languageDuration: "Language & Duration",
      coordinator: "Course Coordinator",
      status: "Status",
      apply: "Apply",
    },
    applyLabel: "Apply",
    // One table per training `group`, in this order. Rows without a known group are listed
    // after them under `training.scheduleHeading`.
    tables: [
      {
        group: "cultivation",
        id: "cultivation-calendar",
        heading: "Training Programmes on Mushroom Cultivation Technology",
        languageDurationSeparator: " ",
      },
      {
        group: "spawn",
        id: "spawn-calendar",
        heading: "Training on Mushroom Spawn Production Technology (Sept-Dec 2026)",
        headingNote: "Number of seats 30 per batch",
        subLine: "Register online through the Apply button, or by email: info@sumedhaagro.com — Dr. Enespa",
        languageDurationSeparator: " - ",
      },
    ],
    // Shown under the cultivation table.
    notes: {
      query: "For training related query (9125591178, 9473896285)",
      seats: "30 seats only",
      specialNote: {
        id: "special-note",
        heading: "Special Note:",
        title: "Sept to Dec 2026 Training:",
        items: [
          {
            label: "Eligibility:",
            text: "This session is for candidates who have been applying since August 2026 or earlier but have not yet secured a seat.",
          },
          {
            label: "How to apply:",
            text: "Please email info@sumedhaagro.com your details to us by 15th August 2026 latest.",
          },
          {
            label: "Selection:",
            text: "Seats will be allocated after verification at our end, with priority given to those who have been applying the earliest.",
          },
          {
            label: "Note:",
            text: "Fresh applications will be considered only if seats remain available after the selection process. You may enquire after 13th September 2026.",
          },
        ],
      },
      howToRegister: {
        heading: "How to register:",
        // One paragraph, split into its sentences.
        sentences: [
          "To register, click the Apply button next to the respective training in the above calendar and fill in the online application form.",
          "Online registration opens at 9:30 AM on the registration dates mentioned in Column 4 for the respective training.",
          "After submitting the form, please wait for a communication mail from info@sumedhaagro.com which may take 7 working days.",
        ],
      },
    },
    terms: {
      important: {
        label: "Important:",
        text: "Online registration will be closed automatically once the seat limit is reached. For seat inquiry you may contact us at info@sumedhaagro.com",
      },
      note: {
        label: "Note:",
        items: [
          "Sumedha Agro, Lucknow is not responsible for the refund of the fee paid by the candidates if they are not able to attend the Training Programme.",
          "Candidates are also requested to ensure that payment for the training is made once. Sumedha Agro will not be responsible for the refund of over payment, if any.",
          "Attendance for all the classes in the training is compulsory. Those found absent during any lecture/practical for any reasons will not be given completion certificates.",
          "Registration fee is only for training material and training charges and it does not include the cost of travel, stay, food etc.",
          "Fee is non-refundable and non-transferable either to other persons or other training programmes.",
        ],
      },
    },
    // Status badges, computed in src/lib/trainingStatus.js.
    status: {
      opensOn: "Opens on",
      open: "Registration open",
      closed: "Registration closed",
      completed: "Completed",
      limitedSeats: "Limited Seats",
    },
  },

  // Training Details section of the Training page, after the calendar. Defaults: the admin
  // panel can replace them (Training page text).
  trainingDetails: {
    id: "training-details",
    heading: "Training Details",
    intro:
      "The Cultivation Technology of following types of Mushroom will be covered during the training course with emphasis on practical.",
    mushrooms: [
      "Cultivation Technology of White button mushroom",
      "Cultivation Technology of Oyster mushroom",
      "Cultivation Technology of Paddy straw and Milky mushrooms.",
      "Cultivation technology of Specialty mushrooms - Shiitake, Ganoderma , Flammulina, Hericium",
    ],
    aspectsIntro:
      "Besides the cultivation Technology of above mushrooms, training will cover following aspects in details:",
    aspects: [
      "Nutritional / Medicinal value of mushrooms and its relevance in healthy food",
      "Seeds/spawn preparation technique for mushrooms",
      "Substrate preparation technique for mushrooms",
      "Infrastructure requirement for setting up of a composite mushroom farm",
      "Crop raising of all above mushrooms including crop management",
      "Pest/diseases management in mushrooms",
      "Postharvest handling/value addition of mushrooms",
    ],
    closing:
      "Apart from above aspects of cultivation technology, the other important related aspects viz; economics of mushrooms cultivation, marketing, financing, management of spent compost etc. will also be covered during the training course.",
    courseHeading: "COURSE CONTENTS",
    courseSections: [
      {
        title: "(Entrepreneurs Training- Theory)",
        items: [
          "Mushrooms- An Agri-business",
          "Nutritional and medicinal value of mushrooms",
          "Culture preparation and preservation techniques in mushrooms",
          "Spawn production technology",
          "Formulations and recent advances in compost production for button mushroom",
          "Recent advances in crop management of white button mushroom",
          "Farm-design and infrastructure for a commercial mushroom growing unit",
          "Economics of button mushroom cultivation under controlled conditions",
          "Cultivation of oyster mushroom (Pleurotus spp.)",
          "Infrastructure requirement and economics of oyster mushroom",
          "Cultivation & economics of paddy straw mushroom (Volvariella spp.)",
          "Cultivation & economics of milky mushroom ( Calocybe indica )",
          "Cultivation of Shiitake Mushrooms",
          "Cultivation of speciality mushrooms like Ganoderma , Flammulina and Hericium",
          "Competitor moulds/fungal and viral diseases of mushrooms",
          "Bacterial diseases and abiotic disorders of mushrooms",
          "Insect, pests & nematodes of mushrooms and their management",
        ],
      },
    ],
  },

  spawnBooking: {
    heading: "Mushroom Seed (Spawn) Booking",
    offerings: [
      { label: "Trainings", icon: "GraduationCap" },
      { label: "Spawn", icon: "Package" },
      { label: "Compost", icon: "Recycle" },
      { label: "RTF bags", icon: "ShoppingBag" },
      { label: "Growing kits", icon: "Sprout" },
    ],
    manual: {
      id: "manual",
      icon: "ClipboardList",
      title: "Manual Spawn Booking",
    },
    online: {
      id: "online",
      icon: "ShoppingCart",
      title: "Online Spawn Booking",
      linkLabel: nav.shop.label,
      to: nav.shop.to,
    },
  },

  // Incubation, Services Offered and Mushroom Technologies are sections of the Training page.
  services: {
    id: "services",
    heading: "Services Offered",
    body: "Sumedha Agro Mushroom Seed (Spawn) Production Laboratory at Lucknow provides technical supports to farmers, training and entrepreneurs.",
  },

  technologies: {
    id: "technologies",
    heading: "Mushroom Technologies",
    items: [
      { id: "spawn-production-technologies", icon: "FlaskConical", title: "Spawn Production Technologies" },
      { id: "mushroom-licensed-technologies", icon: "BadgeCheck", title: "Mushroom Licensed Technologies" },
    ],
  },

  incubation: {
    id: "incubation",
    heading: "Incubation",
    items: [
      { id: "spawn-incubation", icon: "FlaskConical", title: "On-site spawn Production Incubation" },
      { id: "rtf-incubation", icon: "ShoppingBag", title: "On-site ready to fruit (RTF) bag production incubation" },
    ],
  },

  news: {
    heading: "News and Announcement",
    // Small heading above the latest news on the home page (beside "Mushroom Videos" and "Gallery").
    latestHeading: "Latest updates",
    // Managed in the admin panel (/admin). These static items are only shown if the API is
    // unreachable or has no news yet: { date: "YYYY-MM-DD", title, body?, link? }
    items: [],
  },

  // Section of the Spawn Booking page.
  valueAdded: {
    id: "value-added",
    heading: "Mushroom Value added Products Technologies",
    items: [
      { id: "mechanized-quality-spawn-production", icon: "Cog", title: "Mechanized Quality Spawn Production" },
      { id: "crop-waste-to-food-plate", icon: "Recycle", title: "Crop waste to food plate" },
    ],
  },

  // Section of the News & Announcements page.
  media: {
    id: "media",
    heading: "Media",
    videos: {
      id: "videos",
      title: "Mushroom Videos",
      // Managed in the admin panel (/admin). Static fallback: { title, embedUrl, thumbnailUrl? }
      items: [],
    },
    gallery: {
      id: "gallery",
      title: "Gallery",
      // Managed in the admin panel (/admin). Static fallback: { src: importedImage, alt, caption? }
      items: [],
    },
  },

  contact,

  footer: {
    tagline:
      "Sumedha Agro specializes in mushroom research, spawn production and hands-on training to promote sustainable cultivation and nutrition.",
    quickLinksHeading: "Quick Links",
    quickLinks: [nav.home, nav.about, nav.training, nav.spawnBooking, nav.news, nav.contact],
    quickLinks2: [
      { label: "On-site Spawn Incubation Facility", to: "/training#spawn-incubation" },
      { label: "On-site RTF Bag Incubation", to: "/training#rtf-incubation" },
      { label: "Spawn Production Technologies", to: "/training#spawn-production-technologies" },
      { label: "Mushroom photos and videos", to: "/news#media" },
    ],
    contactHeading: "Contact us",
    visitorCount: {
      label: "Visitor Count",
      // Shown until GET/POST /api/visitors answers (see src/hooks/useVisitorCount.js).
      fallback: 0,
    },
    copyright: "Sumedha Agro. All rights reserved.",
    legal: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/termsofservices" },
    ],
  },

  // Per-page <title>, meta description and breadcrumb name (used by src/seo). Titles get
  // " | Sumedha Agro" added unless they already name it; keep descriptions under ~160 characters.
  meta: {
    home: {
      title: "Sumedha Agro | Mushroom Spawn Production & Training, Lucknow",
      description:
        "Quality mushroom spawn, hands-on mushroom cultivation and spawn production training, and value-added mushroom products from Sumedha Agro, Lucknow.",
    },
    about: {
      title: "About Us — Mushroom Spawn Laboratory, Lucknow",
      crumb: "About Us",
      description:
        "Sumedha Agro's Mushroom Seed (Spawn) Production Laboratory (SAMSPL) in Lucknow produces quality spawn and trains farmers and entrepreneurs in mushroom growing.",
    },
    training: {
      title: "Mushroom Cultivation & Spawn Training",
      crumb: "Training",
      description:
        "Hands-on mushroom cultivation and spawn production training in Lucknow: tissue culture, mother and G1/G2 spawn, unit layout and mechanization. Dates and fees.",
    },
    trainingApply: {
      title: "Apply for Mushroom Training",
      crumb: "Apply",
      description:
        "Apply online for mushroom cultivation or spawn production training at Sumedha Agro, Lucknow: choose your batch, pay the fee by UPI and upload the receipt.",
    },
    spawnBooking: {
      title: "Mushroom Spawn (Seed) Booking",
      crumb: "Spawn Booking",
      description:
        "Book quality mushroom spawn, compost, RTF bags and growing kits from Sumedha Agro, Lucknow, online or offline, plus value-added mushroom product technologies.",
    },
    news: {
      title: "News & Announcements",
      crumb: "News & Announcements",
      description:
        "Training announcements, news, mushroom videos and the photo gallery from Sumedha Agro's mushroom spawn laboratory in Lucknow.",
    },
    contact: {
      title: "Contact Us",
      crumb: "Contact Us",
      description:
        "Contact Sumedha Agro, Banthra, Sarojni Nagar, Lucknow 226401, Uttar Pradesh. Call +91 9473896285 or e-mail info@sumedhaagro.com.",
    },
    products: {
      title: "Mushroom Spawn, Fresh & Value-Added Products",
      crumb: "Products",
      description:
        "Oyster, button, milky, shiitake and other mushroom spawn, fresh mushrooms, and value-added products such as pickle, chips, papad and protein powder.",
    },
    shop: {
      title: "Mushroom Product Catalogue",
      crumb: "Shop",
      description:
        "Browse every Sumedha Agro mushroom product by category: mushroom spawn, value-added mushroom products and fresh mushrooms.",
    },
    getQuote: {
      title: "Request a Bulk Quote",
      crumb: "Get a Quote",
      description:
        "Request a quote for bulk mushroom spawn, fresh mushrooms or value-added mushroom products from Sumedha Agro, Lucknow.",
    },
    showcase: {
      title: "Premium Organic Oyster Mushrooms",
      crumb: "Oyster Mushrooms",
      description:
        "Oyster mushrooms grown in sterile, climate-controlled conditions at Sumedha Agro: nutrition facts, varieties and recipe ideas.",
    },
    privacy: {
      title: "Privacy Policy",
      crumb: "Privacy Policy",
      description: "How Sumedha Agro collects, uses and protects the information you share through this website.",
    },
    termsofservices: {
      title: "Terms of Service",
      crumb: "Terms of Service",
      description: "The terms for using the Sumedha Agro website and its services.",
    },
    // Product pages: the product's name and description (src/data/product.js) plus this.
    productSuffix: " From Sumedha Agro, Lucknow.",
    notFound: {
      title: "Page not found",
      description: "This page doesn't exist on the Sumedha Agro website.",
    },
  },
};

export default content;
