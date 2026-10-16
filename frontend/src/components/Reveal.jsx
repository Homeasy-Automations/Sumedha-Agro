import { useRef } from "react";
import useInView from "../hooks/useInView";

// Fade/slide-in on scroll, matching the motion used elsewhere on the site. The animation is
// CSS (.reveal in index.css, off for visitors who prefer reduced motion); this only marks the
// element once 15% of it is in view.
export default function Reveal({ delay = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null);
  const shown = useInView(ref);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-shown={shown || undefined}
      style={delay ? { ...style, "--reveal-delay": `${delay}s` } : style}
      {...rest}
    >
      {children}
    </div>
  );
}
