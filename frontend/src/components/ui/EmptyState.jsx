import { motion } from "framer-motion";
import Button from "./Button";
import { HelpCircle } from "lucide-react";

export default function EmptyState({
  title = "No items found",
  description = "Get started by creating a new item.",
  actionText,
  onAction,
  icon: Icon = HelpCircle,
  className = ""
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-premium max-w-lg mx-auto ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 mb-6 shadow-inner">
        <Icon className="h-8 w-8" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2 font-sans">
        {title}
      </h3>
      
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}
