import { createElement } from "react";
import {
  BadgeCheck,
  ClipboardList,
  Cog,
  FlaskConical,
  GraduationCap,
  Leaf,
  Microscope,
  Package,
  Recycle,
  Salad,
  ShoppingBag,
  ShoppingCart,
  Sprout,
  Users,
} from "lucide-react";

// Icon names used in src/data/content.js, resolved to lucide-react components.
const icons = {
  BadgeCheck,
  ClipboardList,
  Cog,
  FlaskConical,
  GraduationCap,
  Microscope,
  Package,
  Recycle,
  Salad,
  ShoppingBag,
  ShoppingCart,
  Sprout,
  Users,
};

export default function Icon({ name, ...props }) {
  return createElement(icons[name] ?? Leaf, { "aria-hidden": "true", ...props });
}
