import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
    className, 
    variant = "default",
    size = "md",
    children, 
    ...props 
}, ref) => {
    const baseClasses = "inline-flex items-center font-medium rounded-full";
    
    const variants = {
        default: "bg-gray-100 text-gray-800",
        primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
        success: "bg-gradient-to-r from-success/10 to-emerald-100 text-success border border-success/20",
        warning: "bg-gradient-to-r from-warning/10 to-amber-100 text-warning border border-warning/20",
        error: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
        info: "bg-gradient-to-r from-info/10 to-blue-100 text-info border border-info/20"
    };
    
    const sizes = {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base"
    };

    return (
        <span
            className={cn(
                baseClasses,
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </span>
    );
});

Badge.displayName = "Badge";

export default Badge;