import React, {useState} from "react";
import { IoFilter } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import m7 from "../assets/m7.webp";
import m2 from "../assets/m2.webp";
import m3 from "../assets/m3.webp";
import oysterMushroomSpawnImage from "../assets/products/oyster-mushroom-spawn.webp";
import buttonMushroomSpawnImage from "../assets/products/button-mushroom-spawn.webp";
import milkyMushroomSpawnImage from "../assets/products/milky-mushroom-spawn.webp";
import spicyMushroomPickleImage from "../assets/products/spicy-mushroom-pickle.webp";
import mushroomProteinPowderImage from "../assets/products/mushroom-protein-powder.webp";
import productsHeroImage from "../assets/pages/products-hero.webp";
import { valueAddedProducts } from "../data/product";
import PhotoCredits from "../components/PhotoCredits";

// Card for a value added product from src/data/product.js, in the same style as the cards below.
function ValueAddedCard({ product, onDetails }) {
  return (
    <div className="group flex flex-col bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
      <div className="aspect-4/3 w-full bg-gray-100 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-text-main mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-text-side text-sm line-clamp-2 mb-4">{product.description}</p>
        <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-end">
          <button
            onClick={onDetails}
            className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            Details
            <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
}
export default function Products() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

const handleSubmit = () => {
  if (email.trim() === "") {
    setError("Email is required");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address");
    return;
  }

  setError(""); // clear error
  navigate("/get-quote", { state: { email } });

};
  return (
    <main>
        {/* <!-- Hero Section --> */}
        <div
          style={{
            backgroundImage:
              `url(${productsHeroImage})`,
          }}
          className="relative w-full bg-cover bg-center bg-no-repeat"
          data-alt="Dark green textured background representing agriculture"
        >
          <div className="w-full max-w[1440px] mx-auto px-4 lg:px-10 py-16 md:py-20 flex flex-col justify-center min-h-300px">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-4">
              Premium Mushroom Catalog
            </h1>
            <p className="text-white/90 text-base md:text-lg font-normal max-w-2xl">
              Explore our scientifically developed spawn, fresh organic produce,
              and value-added mushroom products designed for modern agriculture
              and healthy living.
            </p>
          </div>
        </div>
        {/* <!-- Main Content Layout --> */}
        <div className="flex flex-col lg:flex-row gap-8 max-w[1440px] mx-auto w-full px-4 lg:px-10 py-12 flex-1">
          {/* <!-- Sidebar Filters --> */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-text-main">
                  <IoFilter size={20} />
                </span>
                <h3 className="text-text-main text-lg font-bold">
                  Categories
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                <label className="group cursor-pointer flex items-center gap-4 rounded-lg border border-solid border-border-active bg-white p-[15px] hover:border-primary transition-colors">
                  <input
                    className="h-5 w-5 border-2 border-border-active bg-transparent text-transparent checked:border-primary checked:bg-primary checked:focus:border-primary focus:ring-0 focus:ring-offset-0 radio-checked-bg"
                    name="category"
                    type="radio"
                    value="all"
                    checked={selectedCategory === "all"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <div className="flex grow flex-col">
                    <p className="text-text-main text-sm font-medium leading-normal group-hover:text-primary transition-colors">
                      All Products
                    </p>
                    <p className="text-text-side text-xs font-normal leading-normal">
                      View full catalog
                    </p>
                  </div>
                </label>
                <label className="group cursor-pointer flex items-center gap-4 rounded-lg border border-solid border-border-active bg-white p-[15px] hover:border-primary transition-colors"
                   onClick={() => {
                   navigate("/products");
                   window.scrollTo({ top: 0, behavior: "smooth" });
                  }}>
                  <input
                    className="h-5 w-5 border-2 border-border-active bg-transparent text-transparent checked:border-primary checked:bg-primary checked:focus:border-primary focus:ring-0 focus:ring-offset-0 radio-checked-bg"
                    name="category"
                    type="radio"
                    value="seeds"
                    checked={selectedCategory === "seeds"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <div className="flex grow flex-col">
                    <p className="text-text-main text-sm font-medium leading-normal group-hover:text-primary transition-colors">
                      Seeds / Spawn
                    </p>
                    <p className="text-text-side text-xs font-normal leading-normal">
                      Oyster, Milky, Button
                    </p>
                  </div>
                </label>
                <label className="group cursor-pointer flex items-center gap-4 rounded-lg border border-solid border-border-active bg-white p-[15px] hover:border-primary transition-colors"
                   onClick={() => {
                   navigate("/products");
                   window.scrollTo({ top: 0, behavior: "smooth" });
                  }}>
                  <input
                    className="h-5 w-5 border-2 border-border-active bg-transparent text-transparent checked:border-primary checked:bg-primary checked:focus:border-primary focus:ring-0 focus:ring-offset-0 radio-checked-bg"
                    name="category"
                    type="radio"
                    value="value"
                    checked={selectedCategory === "value"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <div className="flex grow flex-col">
                    <p className="text-text-main text-sm font-medium leading-normal group-hover:text-primary transition-colors">
                      Value-Added
                    </p>
                    <p className="text-text-side text-xs font-normal leading-normal">
                      Pickles, Powders, Chips & more
                    </p>
                  </div>
                </label>
                <label className="group cursor-pointer flex items-center gap-4 rounded-lg border border-solid border-border-active bg-white p-[15px] hover:border-primary transition-colors"
                onClick={() => {
                   navigate("/products");
                   window.scrollTo({ top: 0, behavior: "smooth" });
                  }}>
                  <input
                    className="h-5 w-5 border-2 border-border-active bg-transparent text-transparent checked:border-primary checked:bg-primary checked:focus:border-primary focus:ring-0 focus:ring-offset-0 radio-checked-bg"
                    name="category"
                    type="radio"
                    value="fresh"
                    checked={selectedCategory === "fresh"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <div className="flex grow flex-col">
                    <p className="text-text-main text-sm font-medium leading-normal group-hover:text-primary transition-colors">
                      Fresh Produce
                    </p>
                    <p className="text-text-side text-xs font-normal leading-normal">
                      Farm fresh harvest
                    </p>
                  </div>
                </label>
              </div>
              <div className="mt-9 p-8 bg-primary/10 rounded-xl border border-primary/20">
                <h4 className="font-bold text-text-main mb-2">
                  Need Custom Orders?
                </h4>
                <p className="text-sm text-text-side mb-4">
                  We handle bulk requests for commercial farming.
                </p>
                <a href="/contact">
                <button className="w-full py-2 px-4 bg-white border border-primary text-primary font-bold rounded-lg text-sm hover:bg-primary hover:text-text-main transition-colors">
                  Contact Sales
                </button>
                </a>
              </div>
            </div>
          </aside>
          {/* <!-- Product Grid Area --> */}
          <main className="flex-1 flex flex-col gap-10">
            {/* <!-- Section 1: Seeds --> */}
            {(selectedCategory === "all" || selectedCategory === "seeds") && (
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-border-light pb-2">
                <h2 className="text-text-main text-2xl font-bold leading-tight">
                  Quality Seeds (Spawn)
                </h2>
                <a
                  className="text-sm font-bold text-primary hover:underline hidden sm:block"
                  onClick={() =>
                    navigate("/shop", { state: { category: "Spawn" } })
                  }
                >
                  View All Seeds
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* <!-- Product Card 1 --> */}
                <div className="group flex flex-col bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="aspect-4/3 w-full bg-gray-100 relative overflow-hidden">
                    <div
                      style={{
                        backgroundImage:
                          `url(${oysterMushroomSpawnImage})`,
                      }}
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      data-alt="Close up of white oyster mushrooms growing"
                    ></div>
                    <div className="absolute top-3 left-3 bg-primary text-text-main text-xs font-bold px-2 py-1 rounded-full">
                      High Yield
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                        Oyster Mushroom Spawn (Pleurotus spp.)
                      </h3>
                    </div>
                    <p className="text-text-side text-sm line-clamp-2 mb-4">
                      Laboratory certified, contamination-free spawn suitable
                      for all seasons. Fast colonization rate.
                    </p>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-2 rounded">
                        Organic
                      </span>
                      <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-2 rounded">
                        Lab Tested
                      </span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between">
                      <span className="text-sm font-medium text-text-main">
                        1kg Pack
                      </span>
                      <button 
                        onClick={() => navigate("/products/oyster-mushroom-spawn")}
                        className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all ml-auto">
                        Details
                          <FaArrowRightLong />
                      </button>
                    </div>
                  </div>
                </div>
                {/* <!-- Product Card 2 --> */}
                <div className="group flex flex-col bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="aspect-4/3 w-full bg-gray-100 relative overflow-hidden">
                    <div
                      style={{
                        backgroundImage:
                          `url(${buttonMushroomSpawnImage})`,
                      }}
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      data-alt="Close up of white button mushrooms in soil"
                    ></div>
                    <div className="absolute top-3 left-3 bg-white/90 text-text-main text-xs font-bold px-2 py-1 rounded-full">
                      Commercial Grade
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      Button Mushroom Spawn (Agaricus bisporus)
                    </h3>
                    <p className="text-text-side text-sm line-clamp-2 mb-4">
                      Premium Agaricus bisporus strains designed for controlled
                      environment agriculture. Excellent shelf life.
                    </p>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-2 rounded">
                        High Protein
                      </span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between">
                      <span className="text-sm font-medium text-text-main">
                        Bulk Only
                      </span>
                      <button 
                        onClick={() => navigate("/products/button-mushroom-spawn")}
                        className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Details
                        <span className="material-symbols-outlined text-lg">
                          <FaArrowRightLong />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* <!-- Product Card 3 --> */}
                <div className="group flex flex-col bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="aspect-4/3 w-full bg-gray-100 relative overflow-hidden">
                    <div
                      style={{
                        backgroundImage:
                          `url(${milkyMushroomSpawnImage})`,
                      }}
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      data-alt="Large white milky mushrooms"
                    ></div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-text-main mb-2 group-hover:text-primary transition-colors">
                      Milky Mushroom Spawn (Calocybe indica)
                    </h3>
                    <p className="text-text-side text-sm line-clamp-2 mb-4">
                      Ideal for tropical climates. Robust growth and large
                      fruiting bodies with extended keeping quality.
                    </p>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-2 rounded">
                        Heat Tolerant
                      </span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between">
                      <span className="text-sm font-medium text-text-main">
                        500g Pack
                      </span>
                      <button 
                        onClick={() => navigate("/products/milky-mushroom-spawn")}
                        className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Details
                        <span className="material-symbols-outlined text-lg">
                          <FaArrowRightLong />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            )}
            {/* <!-- Section 2: Value Added --> */}
            {(selectedCategory === "all" || selectedCategory === "value") && (
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-border-light pb-2">
                <h2 className="text-text-main text-2xl font-bold leading-tight">
                  Value-Added Products
                </h2>
                <a
                  className="text-sm font-bold text-primary hover:underline hidden sm:block"
                  onClick={() =>
                    navigate("/shop", { state: { category: "Value Added" } })
                  }
                >
                  View All Value-Added
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* <!-- Product Card 4 --> */}
                <div className="group flex flex-col bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="aspect-4/3 w-full bg-gray-100 relative overflow-hidden">
                    <div
                      style={{
                        backgroundImage:
                          `url(${spicyMushroomPickleImage})`,
                      }}
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      data-alt="Jar of spicy red pickle"
                    ></div>
                    <div className="absolute top-3 left-3 bg-primary text-text-main text-xs font-bold px-2 py-1 rounded-full">
                      Bestseller
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-text-main mb-2 group-hover:text-primary transition-colors">
                      Spicy Mushroom Pickle
                    </h3>
                    <p className="text-text-side text-sm line-clamp-2 mb-4">
                      A tangy and spicy blend of oyster mushrooms and
                      traditional spices. No artificial preservatives.
                    </p>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-2 rounded">
                        Ready to Eat
                      </span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between">
                      <span className="text-sm font-medium text-text-main">
                        250g Jar
                      </span>
                      <button 
                        onClick={() => navigate("/products/spicy-mushroom-pickle")}
                        className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Details
                        <span className="material-symbols-outlined text-lg">
                          <FaArrowRightLong />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* <!-- Product Card 5 --> */}
                <div className="group flex flex-col bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="aspect-4/3 w-full bg-gray-100 relative overflow-hidden">
                    <div
                      style={{
                        backgroundImage:
                          `url(${mushroomProteinPowderImage})`,
                      }}
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      data-alt="Spoonful of protein powder"
                    ></div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-text-main mb-2 group-hover:text-primary transition-colors">
                      Mushroom Protein Powder
                    </h3>
                    <p className="text-text-side text-sm line-clamp-2 mb-4">
                      100% vegan protein supplement made from dried mushrooms.
                      Great for soups and smoothies.
                    </p>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-2 rounded">
                        Vegan
                      </span>
                      <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-2 rounded">
                        Gluten Free
                      </span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between">
                      <span className="text-sm font-medium text-text-main">
                        500g Pack
                      </span>
                      <button 
                        onClick={() => navigate("/products/mushroom-protein-powder")}
                        className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Details
                        <span className="material-symbols-outlined text-lg">
                          <FaArrowRightLong />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                {valueAddedProducts.map((product) => (
                  <ValueAddedCard key={product.slug} product={product} onDetails={() => navigate(`/products/${product.slug}`)} />
                ))}
              </div>
              <PhotoCredits items={valueAddedProducts} className="mt-4" />
            </section>
            )}
              {/* <!-- Section 3: Fresh --> */}
              {(selectedCategory === "all" || selectedCategory === "fresh") && (
              <section>
                {/* .... Fresh value ke product cards ka code .... */}
                  <div className="flex items-center justify-between mb-6 border-b border-border-light pb-2">
                    <h2 className="text-text-main text-2xl font-bold leading-tight">
                      Fresh Farm Produce
                    </h2>
                    <a
                      className="text-sm font-bold text-primary hover:underline hidden sm:block"
                      onClick={() =>
                        navigate("/shop", { state: { category: "Fresh" } })
                      }
                    >
                      View All Fresh
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {/* CARD 6 */}
                    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-border-light bg-white/80 backdrop-blur-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-500">

                      {/* IMAGE */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <div
                          style={{
                            backgroundImage: `url(${m7})`,
                          }}
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                        {/* badge */}
                        <span className="absolute top-3 left-3 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                          Fresh Today
                        </span>

                        {/* availability */}
                        <span className="absolute top-3 right-3 bg-white/90 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                          In Stock
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                          Fresh Oyster Mushrooms (Pleurotus spp.)
                        </h3>

                        <p className="text-text-side text-sm mt-2 mb-4">
                          Harvested within 24 hours. Naturally grown, chemical-free, and rich in nutrients.
                        </p>

                        {/* tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-1 rounded">
                            Organic
                          </span>
                          <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-1 rounded">
                            Farm Fresh
                          </span>
                        </div>

                        {/* footer */}
                        <div className="mt-auto flex items-center justify-between border-t pt-4 border-border-light">
                          <span className="text-sm font-semibold text-text-main">
                             500g
                          </span>

                          <button
                            onClick={() => navigate("/products/fresh-oyster-mushroom")}
                            className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all ml-auto"
                          >
                            Details
                            <FaArrowRightLong />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CARD 2 */}
                    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-border-light bg-white/80 backdrop-blur-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-500">

                      <div className="relative aspect-[4/3] overflow-hidden">
                        <div
                          style={{
                            backgroundImage:
                              `url(${m2})`,
                          }}
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                        <span className="absolute top-3 left-3 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                          Premium
                        </span>

                        <span className="absolute top-3 right-3 bg-white/90 text-yellow-600 text-xs font-bold px-3 py-1 rounded-full">
                          Limited
                        </span>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                          Fresh Button Mushrooms (Agaricus bisporus)
                        </h3>

                        <p className="text-text-side text-sm mt-2 mb-4">
                          Clean, white, and firm mushrooms ideal for cooking, salads, and commercial kitchens.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-1 rounded">
                            High Quality
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t pt-4 border-border-light">
                          <span className="text-sm font-semibold text-text-main">
                             500g
                          </span>

                          <button
                            onClick={() => navigate("/products/fresh-button-mushroom")}
                            className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all ml-auto"
                          >
                            Details
                            <FaArrowRightLong />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CARD 3 */}
                    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-border-light bg-white/80 backdrop-blur-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-500">

                      <div className="relative aspect-[4/3] overflow-hidden">
                        <div
                          style={{
                            backgroundImage:
                              `url(${m3})`,
                          }}
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                        <span className="absolute top-3 left-3 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                          Tropical
                        </span>
                        <span className="absolute top-3 right-3 bg-white/90 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                          In Stock
                        </span>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                          Fresh Milky Mushrooms (Calocybe indica)
                        </h3>

                        <p className="text-text-side text-sm mt-2 mb-4">
                          Thick, juicy mushrooms perfect for Indian climate and long shelf life.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-primary/10 text-text-main text-[10px] uppercase font-bold px-3 py-1 rounded">
                            Heat Resistant
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t pt-4 border-border-light">
                          <span className="text-sm font-semibold text-text-main">
                             500g
                          </span>

                          <button
                            onClick={() => navigate("/products/fresh-milky-mushrooms")}
                            className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all ml-auto"
                          >
                            Details
                            <FaArrowRightLong />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
              </section>
             )}  
          </main>
        </div>
        {/* <!-- Lead Generation / Footer Section --> */}
        <div className="bg-[#eefcee] border-t border-primary/20 mt-auto">
          <div className="max-w-960px mx-auto px-4 py-16 flex flex-col items-center text-center">
            <span className="bg-white text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase mb-4">
              Partner With Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
              Interested in Bulk Orders?
            </h2>
            <p className="text-text-side max-w-lg mb-8 text-lg">
              Get a customized quote for commercial farming spawn or wholesale
              product distribution.
            </p>
            <form className="w-full max-w-lg bg-white p-2 rounded-xl shadow-lg border border-border-light flex flex-col sm:flex-row gap-2">
              <input
              type="email"
               value={email}
               onChange={(e) => {
                setEmail(e.target.value);
              setError("");
                  }}
                className="flex-1 bg-transparent border-none focus:ring-0 text-text-main placeholder:text-gray-400 px-4 py-3"
                placeholder="Enter your email address"
              />
              <button
                 onClick={handleSubmit}
                 type="button"
                  className="bg-primary text-text-main font-bold rounded-lg px-6 py-3 hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Request Quote
              </button>
            </form>
            {error && (
           <p className="text-red-500 text-sm mt-2">
             {error}
             </p>
               )}
            <p className="mt-4 text-l text-text-side">
              We respect your privacy. No spam.
            </p>
          </div>
        </div>
    </main>
  );
}
