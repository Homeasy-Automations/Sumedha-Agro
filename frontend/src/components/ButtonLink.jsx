import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-primary text-[#0d1b0d] shadow-lg shadow-primary/20 hover:bg-green-400 hover:shadow-primary/40",
  outline:
    "border border-[#0d1b0d]/15 text-[#0d1b0d] hover:border-text-side hover:text-text-side",
  light:
    "border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-primary hover:text-primary",
};

export default function ButtonLink({ to, variant = "primary", icon: Icon, className = "", children }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition duration-200 active:scale-[0.98] ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      {Icon && <Icon size={18} aria-hidden="true" />}
    </Link>
  );
}
