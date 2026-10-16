import m1 from "../assets/m1.webp";
import m2 from "../assets/m2.webp";
import m3 from "../assets/m3.webp";
import oysterMushroomSpawnImage from "../assets/products/oyster-mushroom-spawn.webp";
import buttonMushroomSpawnImage from "../assets/products/button-mushroom-spawn.webp";
import milkyMushroomSpawnImage from "../assets/products/milky-mushroom-spawn.webp";
import spicyMushroomPickleImage from "../assets/products/spicy-mushroom-pickle.webp";
import mushroomProteinPowderImage from "../assets/products/mushroom-protein-powder.webp";
import milkyMushroomCalocybeImage from "../assets/products/milky-mushroom-calocybe.webp";
import pleurotusOstreatusImage from "../assets/products/pleurotus-ostreatus.webp";
import whiteOysterFloridaImage from "../assets/products/white-oyster-florida.jpg";
import kingOysterEryngiiImage from "../assets/products/king-oyster-eryngii.webp";
import pinkOysterDjamorImage from "../assets/products/pink-oyster-djamor.webp";
import elmOysterUlmariusImage from "../assets/products/elm-oyster-ulmarius.webp";
import lionsManeHericiumImage from "../assets/products/lions-mane-hericium.webp";
import shiitakeEdodesImage from "../assets/products/shiitake-edodes.webp";
import mushroomChipsImage from "../assets/value-added/mushroom-chips.webp";
import mushroomPapadImage from "../assets/value-added/mushroom-papad.webp";
import mushroomDriedPacksImage from "../assets/value-added/mushroom-dried-packs.webp";
import mushroomKetchupImage from "../assets/value-added/mushroom-ketchup.webp";
import mushroomTeaCoffeeImage from "../assets/value-added/mushroom-tea-and-coffee.webp";
import mushroomJerkyImage from "../assets/value-added/mushroom-jerky-crisps.webp";

// Creative Commons licences of the stock photos below.
const CC_BY_2 = { license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" };
const CC_BY_3 = { license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/" };

// Value added products shown as their own cards on the Products page (and in /shop and on
// /products/<slug>). Their photos are illustrative stock images (Openverse), not Sumedha Agro's
// own: `credit` is required by CC BY photos and is shown with them (PhotoCredits); CC0 needs none.
// No price: they are quoted on request.
const credit = (title, author, url, license) => ({ title, author, url, ...license });
export const valueAddedProducts = [
  {
    id: "17",
    slug: "mushroom-chips",
    name: "Mushroom Chips",
    category: "Value Added",
    image: mushroomChipsImage,
    imageAlt: "Crispy fried mushroom slices in a bowl",
    credit: credit("fried mushrooms", "bee wolf ray", "https://www.flickr.com/photos/9673663@N08/4218184594", CC_BY_2),
    description: "A crunchy, ready-to-eat mushroom snack.",
  },
  {
    id: "18",
    slug: "mushroom-papad",
    name: "Mushroom Papad",
    category: "Value Added",
    image: mushroomPapadImage,
    imageAlt: "Roasted papads stacked on a plate",
    credit: credit("Roasted Papad - Howrah 2013-11-02 4068", "Biswarup Ganguly", "https://commons.wikimedia.org/w/index.php?curid=29409079", CC_BY_3),
    description: "Papad made with mushroom, to roast or fry and serve with any meal.",
  },
  {
    id: "19",
    slug: "mushroom-dried-packs",
    name: "Mushroom Dried Packs",
    category: "Value Added",
    image: mushroomDriedPacksImage,
    imageAlt: "Open bag full of dried shiitake mushrooms",
    credit: credit("Dried Mushrooms", "cuthbert8", "https://www.flickr.com/photos/108040444@N07/14450871782", CC_BY_2),
    description: "Dried mushrooms with a long shelf life, ready to soak and cook.",
  },
  {
    id: "20",
    slug: "mushroom-ketchup",
    name: "Mushroom Ketchup",
    category: "Value Added",
    image: mushroomKetchupImage,
    imageAlt: "White bowl of thick red ketchup",
    credit: credit("Ketchup-01", "idealisms", "https://commons.wikimedia.org/w/index.php?curid=19134606", CC_BY_2),
    description: "A mushroom-based sauce for snacks and meals.",
  },
  {
    id: "21",
    slug: "mushroom-tea-and-coffee",
    name: "Mushroom Tea and Coffee",
    category: "Value Added",
    image: mushroomTeaCoffeeImage,
    // CC0 (public domain), from rawpixel: https://www.rawpixel.com/image/5902433
    imageAlt: "Cup of milky coffee on a saucer with coffee beans",
    description: "Everyday hot drinks blended with mushroom.",
  },
  {
    id: "22",
    slug: "mushroom-jerky-crisps",
    name: "Mushroom Jerky / Crisps",
    category: "Value Added",
    image: mushroomJerkyImage,
    imageAlt: "Strips of dark mushroom jerky in a bowl",
    credit: credit("Mushroom jerky", "jamesonf", "https://www.flickr.com/photos/24314126@N05/20638491308", CC_BY_2),
    description: "Chewy jerky and crispy mushroom bites for snacking.",
  },
];

export const products = [
  {
    id: "1",
    slug: "oyster-mushroom-spawn",
    name: "Oyster Mushroom Spawn (Pleurotus spp.)",
    price: 180,
    category: "Spawn",
    image: oysterMushroomSpawnImage,
    description:
      "Lab-certified high-yield oyster mushroom spawn suitable for all seasons.",
  },
  {
    id: "2",
    slug: "button-mushroom-spawn",
    name: "Button Mushroom Spawn (Agaricus bisporus)",
    price: 220,
    category: "Spawn",
    image: buttonMushroomSpawnImage,
    description:
      "Premium Agaricus bisporus spawn for commercial cultivation.",
  },
  {
    id: "3",
    slug: "milky-mushroom-spawn",
    name: "Milky Mushroom Spawn (Calocybe indica)",
    price: 200,
    category: "Spawn",
    image: milkyMushroomSpawnImage,
    description:
      "Ideal for tropical climates with strong resistance and large fruiting bodies.",
  },
  {
    id: "4",
    slug: "spicy-mushroom-pickle",
    name: "Spicy Mushroom Pickle",
    price: 150,
    category: "Value Added",
    image: spicyMushroomPickleImage,
    description:
      "Traditional spicy mushroom pickle made with organic ingredients.",
  },
  {
    id: "5",
    slug: "mushroom-protein-powder",
    name: "Mushroom Protein Powder",
    price: 450,
    category: "Value Added",
    image: mushroomProteinPowderImage,
    description:
      "100% natural vegan protein powder made from dried mushrooms.",
  },
  {
    id: "6",
    slug: "fresh-oyster-mushroom",
    name: "Fresh Oyster Mushrooms (Pleurotus spp.)",
    price: 180,
    category: "Fresh",
    image: m1,
    description:
      "Freshly harvested oyster mushrooms, rich in nutrients and flavor.",
  },
  {
    id: "7",
    slug: "fresh-button-mushroom",
    name: "Fresh Button Mushrooms (Agaricus bisporus)",
    price: 150,
    category: "Fresh",
    image: m2,
    description:
      "Clean, white button mushrooms perfect for cooking and salads.",
  },
  {
    id: "8",
    slug: "fresh-milky-mushroom",
    name: "Fresh Milky Mushrooms (Calocybe indica)",
    price: 200,
    category: "Fresh",
    image: m3,
    description:
      "Thick and juicy milky mushrooms ideal for Indian climate.",
  },
  {
    id: "9",
    slug: "milky-mushroom-calocybe",
    name: "Milky Mushroom Spawn – (Calocybe indica)",
    price: 100,
    category: "Spawn",
    image: milkyMushroomCalocybeImage,
    description: "High-quality milky mushroom spawn suitable for tropical climates.",
  },

  {
    id: "10",
    slug: "pleurotus-ostreatus",
    name: "Grey oyster mushroom spawn – (Pleurotus ostreatus)",
    price: 100,
    category: "Spawn",
    image: pleurotusOstreatusImage,
    description: "Grey oyster mushroom spawn with fast colonization and high yield.",
  },

  {
    id: "11",
    slug: "white-oyster-florida",
    name: "White Oyster Spawn  (Pleurotus florida)",
    price: 100,
    category: "Spawn",
    image: whiteOysterFloridaImage,
    description: "Popular white oyster variety with excellent growth and taste.",
  },

  {
    id: "12",
    slug: "king-oyster-eryngii",
    name: "King Oyster Spawn  (Pleurotus eryngii)",
    price: 110,
    category: "Spawn",
    image: kingOysterEryngiiImage,
    description: "Premium king oyster mushroom with thick stems and rich flavor.",
  },

  {
    id: "13",
    slug: "pink-oyster-djamor",
    name: "Pink Oyster Spawn  (Pleurotus djamor)",
    price: 100,
    category: "Spawn",
    image: pinkOysterDjamorImage,
    description: "Bright pink oyster mushrooms known for fast growth and unique color.",
  },

  {
    id: "14",
    slug: "elm-oyster-ulmarius",
    name: "Elm Oyster Spawn  (Hypsizygus ulmarius)",
    price: 100,
    category: "Spawn",
    image: elmOysterUlmariusImage,
    description: "Elm oyster mushroom with firm texture and good shelf life.",
  },

  {
    id: "15",
    slug: "lions-mane-hericium",
    name: "Lion’s Mane Spawn  (Hericium erinaceus)",
    price: 110,
    category: "Spawn",
    image: lionsManeHericiumImage,
    description: "Medicinal mushroom known for brain health and unique texture.",
  },

  {
    id: "16",
    slug: "shiitake-edodes",
    name: "Shiitake Mushroom Spawn  (Lentinula edodes)",
    price: 110,
    category: "Spawn",
    image: shiitakeEdodesImage,
    description: "Popular gourmet mushroom with strong flavor and health benefits.",
  },

  ...valueAddedProducts,
];