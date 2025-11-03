import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
    className, 
    variant = "primary", 
    size = "md", 
    icon,
    iconPosition = "left",
    loading = false,
    disabled = false,
    children, 
    ...props 
}, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white shadow-md hover:shadow-lg",
        outline: "border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary bg-white hover:bg-primary/5",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        success: "bg-gradient-to-r from-success to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
        danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
    };
    
    const sizes = {
        sm: "px-3 py-2 text-sm min-h-[36px]",
        md: "px-6 py-3 text-base min-h-[44px]",
        lg: "px-8 py-4 text-lg min-h-[52px]",
        xl: "px-10 py-5 text-xl min-h-[60px]"
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-7 h-7"
    };

    const renderIcon = (iconName, position) => {
        if (!iconName) return null;
        
        const spacing = position === "left" ? "mr-2" : "ml-2";
        return (
            <ApperIcon 
                name={iconName} 
                className={cn(iconSizes[size], spacing)} 
            />
        );
    };

    return (
        <button
            className={cn(
                baseClasses,
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <ApperIcon 
                    name="Loader2" 
                    className={cn(iconSizes[size], "mr-2 animate-spin")} 
                />
            )}
            {!loading && iconPosition === "left" && renderIcon(icon, "left")}
            {children}
            {!loading && iconPosition === "right" && renderIcon(icon, "right")}
        </button>
    );
});

Button.displayName = "Button";

export default Button;