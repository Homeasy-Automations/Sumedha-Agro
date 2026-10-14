import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/product"; // adjust path if needed

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const product = products.find(item => item.slug === slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500">
          Product Not Found
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-6 py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/90"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <button
        onClick={() => {
          navigate("/products");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="mb-10 text-sm font-bold text-primary hover:underline"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="aspect-4/3 rounded-xl shadow-lg object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-black text-text-main">
            {product.name}
          </h1>

          <p className="text-lg text-text-side">
            {product.description}
          </p>

          {/* <div className="text-2xl font-bold text-primary">
            ₹{product.price}
          </div> */}

          <button
            onClick={() => navigate("/get-quote")}
            className="mt-4 px-8 py-4 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Request Bulk Quote
          </button>
        </div>
      </div>
    </div>
  );
}
