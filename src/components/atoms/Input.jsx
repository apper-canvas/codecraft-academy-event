import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
    className, 
    type = "text",
    label,
    error,
    helper,
    required = false,
    ...props 
}, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                id={inputId}
                className={cn(
                    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500",
                    "focus:border-primary focus:outline-none focus:ring-0 transition-colors duration-200",
                    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
                    error && "border-error focus:border-error",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && (
                <p className="mt-2 text-sm text-error">{error}</p>
            )}
            {helper && !error && (
                <p className="mt-2 text-sm text-gray-600">{helper}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;