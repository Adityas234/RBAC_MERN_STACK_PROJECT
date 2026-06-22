import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(({
  label,
  error,
  type = "text",
  placeholder = "",
  className = "",
  helperText,
  icon: Icon,
  rows,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const baseInputStyles = `w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${Icon ? "pl-11" : ""}`;
  const textareaStyles = `w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 pl-0.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <span className="absolute left-4 text-slate-400 pointer-events-none">
            <Icon className="h-4.5 w-4.5" />
          </span>
        )}
        
        {rows ? (
          <textarea
            ref={ref}
            rows={rows}
            placeholder={placeholder}
            className={`${textareaStyles} ${error ? "border-danger focus:ring-danger" : ""}`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            className={`${baseInputStyles} ${error ? "border-danger focus:ring-danger" : ""} ${isPassword ? "pr-11" : ""}`}
            {...props}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p className="text-xs text-danger font-medium pl-0.5 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 pl-0.5 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
