import { useEffect, useState } from "react";

const supported = () => typeof IntersectionObserver !== "undefined";

// True once `amount` (0–1) of the element has been in view; it then stays true. Without
// IntersectionObserver (very old browsers) it is true straight away, so nothing stays hidden.
export default function useInView(ref, amount = 0.15) {
  const [inView, setInView] = useState(() => !supported());

  useEffect(() => {
    const el = ref.current;
    if (inView || !el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, amount, inView]);

  return inView;
}
