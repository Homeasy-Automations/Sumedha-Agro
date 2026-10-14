import React, { useState } from "react";
import FormOne from "../components/FormOne";
import FormSecond from "../components/FormSecond";
import FormThird from "../components/FormThird";
import FormFour from "../components/FormFour";
import { useLocation } from "react-router-dom";

export default function GetQuote() {

  const [step, setStep] = useState(0);
  const [scrollTarget, setScrollTarget] = useState(null);
  const location = useLocation();
  const emailFromProducts = location.state?.email || "";

  // 🔥 Central Form State
  const initialFormState = {
    // Step 1
    product: "",
    volume: "",
    packaging: "",
    frequency: "",
    company: "",
    gst: "",
    name: "",
    email: emailFromProducts,
    notes: "",

    // Step 2
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    shippingMethod: "",
    deliveryDate: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [referenceId, setReferenceId] = useState(null);

  const next = () => setStep(prev => prev + 1);
  const prev = () => setStep(prev => prev - 1);
  const goToStep = (number, section = null) => {
  setStep(number);
  setScrollTarget(section);
};


const handleSubmit = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      setReferenceId(data.referenceId);
      setStep(3); // ✅ correct
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  return (
    <section>

      {step === 0 && (
        <FormOne
          handleNext={next}
          formData={formData}
          setFormData={setFormData}
          scrollTo={scrollTarget}
        />
      )}

      {step === 1 && (
        <FormSecond
          handlePrev={prev}
          handleNext={next}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {step === 2 && (
        <FormThird
          handlePrevious={prev}
          handleSubmit={handleSubmit}
          goToStep={goToStep}
          formData={formData}
        />
      )}

      {step === 3 && (
        <FormFour
          referenceId={referenceId}
          email={formData.email}
        />
      )}

    </section>
  );
}