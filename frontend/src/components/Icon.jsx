import { createElement } from "react";
import {
  BadgeCheck,
  ClipboardList,
  Coffee,
  Cog,
  Cookie,
  Flame,
  FlaskConical,
  GraduationCap,
  Leaf,
  Microscope,
  Package,
  Popcorn,
  Recycle,
  Salad,
  ShoppingBag,
  ShoppingCart,
  Soup,
  Sprout,
  Users,
} from "lucide-react";

// Icon names used in src/data/content.js, resolved to lucide-react components.
const icons = {
  BadgeCheck,
  ClipboardList,
  Coffee,
  Cog,
  Cookie,
  Flame,
  FlaskConical,
  GraduationCap,
  Microscope,
  Package,
  Popcorn,
  Recycle,
  Salad,
  ShoppingBag,
  ShoppingCart,
  Soup,
  Sprout,
  Users,
};

export default function Icon({ name, ...props }) {
  return createElement(icons[name] ?? Leaf, { "aria-hidden": "true", ...props });
}
