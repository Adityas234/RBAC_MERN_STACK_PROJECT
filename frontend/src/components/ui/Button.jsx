import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  icon: Icon,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-light focus:ring-primary shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-white hover:bg-secondary-light focus:ring-secondary shadow-lg shadow-secondary/15",
    accent: "bg-accent text-white hover:bg-accent-light focus:ring-accent shadow-lg shadow-accent/25",
    outline: "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-400",
    danger: "bg-danger text-white hover:bg-red-600 focus:ring-danger shadow-lg shadow-danger/20",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5"
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="h-4 w-4 text-current" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}
