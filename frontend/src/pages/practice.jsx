import React, { useState } from "react";

export default function Practice() {
  const [section, setSection] = useState(1);

  return (
    <section className="h-screen flex items-center justify-center">
      
      {section === 1 && (
        <div className="w-56 border p-4">
          first section {section}
          <input type="text" className="border w-full my-2" />
          <button onClick={() => setSection(2)}>next</button>
        </div>
      )}

      {section === 2 && (
        <div className="w-56 border p-4">
          second section
          <input type="text" className="border w-full my-2" />
          <button onClick={() => setSection(3)}>next</button>
          <button onClick={() => setSection(1)}>previous</button>
        </div>
      )}

      {section === 3 && (
        <div className="w-56 border p-4">
          third section
          <input type="text" className="border w-full my-2" />
          <button onClick={() => setSection(2)}>previous</button>
        </div>
      )}

    </section>
  );
}