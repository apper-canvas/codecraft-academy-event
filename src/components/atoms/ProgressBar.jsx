import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const ProgressBar = forwardRef(({ 
    className, 
    value = 0,
    max = 100,
    variant = "primary",
    size = "md",
    label,
    showValue = false,
    ...props 
}, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const variants = {
        primary: "bg-gradient-to-r from-primary to-secondary",
        success: "bg-gradient-to-r from-success to-emerald-600",
        warning: "bg-gradient-to-r from-warning to-amber-500",
        error: "bg-gradient-to-r from-error to-red-600"
    };
    
    const sizes = {
        sm: "h-2",
        md: "h-3",
        lg: "h-4"
    };

    return (
        <div className="w-full" ref={ref} {...props}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2">
                    {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
                    {showValue && <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>}
                </div>
            )}
            <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizes[size], className)}>
                <div
                    className={cn("transition-all duration-500 ease-out rounded-full", sizes[size], variants[variant])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;