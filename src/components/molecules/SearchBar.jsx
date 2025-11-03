import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
    placeholder = "Search courses...",
    onSearch,
    className,
    value: controlledValue,
    onChange: controlledOnChange,
    autoFocus = false
}) => {
    const [internalValue, setInternalValue] = useState("");
    
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    
    const handleChange = (e) => {
        const newValue = e.target.value;
        
        if (isControlled) {
            controlledOnChange?.(newValue);
        } else {
            setInternalValue(newValue);
        }
        
        onSearch?.(newValue);
    };

    const handleClear = () => {
        if (isControlled) {
            controlledOnChange?.("");
        } else {
            setInternalValue("");
        }
        onSearch?.("");
    };

    return (
        <div className={cn("relative max-w-md", className)}>
            <div className="relative">
                <ApperIcon 
                    name="Search" 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                />
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-0 transition-colors duration-200 bg-white"
                />
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ApperIcon name="X" className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;