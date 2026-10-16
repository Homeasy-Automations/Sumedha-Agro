// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { products } from "../data/product";

// export default function Shop() {
//   const navigate = useNavigate();

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-12">
//       <h1 className="text-3xl font-black text-text-main mb-10">
//         Mushroom Product Catalog
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             onClick={() => {
//               navigate(`/products/${product.slug}`);
//               window.scrollTo({ top: 0, behavior: "smooth" });
//             }}
//             className="cursor-pointer bg-white border border-border-light rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300"
//           >
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full h-56 object-cover"
//             />

//             <div className="p-6">
//               <h3 className="text-lg font-bold text-text-main mb-2">
//                 {product.name}
//               </h3>

//               <p className="text-sm text-text-side mb-4 line-clamp-2">
//                 {product.description}
//               </p>

//               <div className="flex justify-between items-center">
//                 <span className="font-semibold text-primary">
//                   ₹{product.price}
//                 </span>

//                 <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-primary hover:text-black hover:border-primary transition-colors">
//                   View Details
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { products } from "../data/product";
import Reveal from "../components/Reveal";
import PhotoCredits from "../components/PhotoCredits";

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialCategory = location.state?.category || "All";
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

  // 🔹 Filter by category
  const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  // 🔹 Reusable card (same UI)
  const renderProducts = (items) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((product, i) => (
        <Reveal key={product.id} delay={(i % 3) * 0.06} className="h-full">
          <div
            onClick={() => {
              navigate(`/products/${product.slug}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="h-full cursor-pointer bg-white border border-border-light rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-primary transition-all duration-300 motion-reduce:hover:translate-y-0"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-6">
              <h3 className="text-lg font-bold text-text-main mb-2">
                {product.name}
              </h3>

              <p className="text-sm text-text-side mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center">
                {/* <span className="font-semibold text-primary">
                  ₹{product.price}
                </span> */}

                <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-primary hover:text-black hover:border-primary transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black text-text-main mb-10">
        Mushroom Product Catalog
      </h1>
      <div className="flex gap-4 mb-8 flex-wrap">
        {["All", "Spawn", "Value Added", "Fresh"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium border transition ${
              selectedCategory === cat
                ? "bg-primary text-black border-primary"
                : "border-gray-300 hover:bg-primary hover:text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-14">
        <h2 className="text-2xl font-bold mb-6 text-text-main">
          {selectedCategory === "All"
            ? "All Products"
            : `${selectedCategory} Products`}
        </h2>
          {selectedCategory === "All" ? (
            <>
              <h2 className="text-xl font-bold mb-4 text-text-main">Spawn Products</h2>
              {renderProducts(products.filter(p => p.category === "Spawn"))}

              <h2 className="text-xl font-bold mb-4 text-text-main">Value Added Products</h2>
              {renderProducts(products.filter(p => p.category === "Value Added"))}

              <h2 className="text-xl font-bold mb-4 text-text-main">Fresh Products</h2>
              {renderProducts(products.filter(p => p.category === "Fresh"))}
            </>
          ) : (
            renderProducts(filteredProducts)
          )}
          <PhotoCredits items={filteredProducts} className="mt-8" />
      </div>
    </div>
  );
}