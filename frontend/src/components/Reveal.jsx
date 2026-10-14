import { motion } from "framer-motion";

const MotionDiv = motion.div;

const variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

// Fade/slide-in on scroll, matching the motion used elsewhere on the site.
export default function Reveal({ delay = 0, className = "", children, ...rest }) {
  return (
    <MotionDiv
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionDiv>
  );
}
