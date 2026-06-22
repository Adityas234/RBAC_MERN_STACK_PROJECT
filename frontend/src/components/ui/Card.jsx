import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  animate = false,
  glass = false,
  onClick,
  ...props
}) {
  const CardComponent = onClick || animate ? motion.div : "div";

  const baseStyles = `rounded-2xl border border-slate-100 bg-white p-6 shadow-premium transition-all duration-300`;
  const glassStyles = `glass border-white/40 p-6 shadow-premium`;

  const motionProps = animate || onClick
    ? {
        whileHover: onClick || animate ? { y: -4, boxShadow: "0 12px 30px -4px rgba(15, 23, 42, 0.08)" } : {},
        whileTap: onClick ? { scale: 0.99 } : {},
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }
    : {};

  return (
    <CardComponent
      onClick={onClick}
      className={`${glass ? glassStyles : baseStyles} ${onClick ? "cursor-pointer" : ""} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
}
