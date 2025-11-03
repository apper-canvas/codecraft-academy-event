import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
    className, 
    variant = "default",
    hover = false,
    children, 
    ...props 
}, ref) => {
    const baseClasses = "bg-white rounded-2xl shadow-lg border border-gray-100";
    
    const variants = {
        default: "p-6",
        compact: "p-4",
        spacious: "p-8",
        flush: "p-0"
    };
    
    const hoverClasses = hover 
        ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        : "";

    return (
        <div
            className={cn(
                baseClasses,
                variants[variant],
                hoverClasses,
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = "Card";

export default Card;