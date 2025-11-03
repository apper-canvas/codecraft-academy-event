import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "default" }) => {
    const getErrorContent = () => {
        switch (type) {
            case "course":
                return {
                    icon: "BookX",
                    title: "Course Not Found",
                    description: "The course you're looking for doesn't exist or has been removed."
                };
            case "lesson":
                return {
                    icon: "FileX",
                    title: "Lesson Error",
                    description: "Unable to load this lesson. Please try again or contact support."
                };
            case "network":
                return {
                    icon: "WifiOff",
                    title: "Connection Error",
                    description: "Please check your internet connection and try again."
                };
            default:
                return {
                    icon: "AlertTriangle",
                    title: "Oops! Something went wrong",
                    description: message
                };
        }
    };

    const errorContent = getErrorContent();

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[400px] px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="w-24 h-24 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <ApperIcon name={errorContent.icon} className="w-12 h-12 text-error" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {errorContent.title}
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                {errorContent.description}
            </p>
            
            {onRetry && (
                <motion.button
                    onClick={onRetry}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ApperIcon name="RefreshCw" className="w-4 h-4" />
                    <span>Try Again</span>
                </motion.button>
            )}
        </motion.div>
    );
};

export default Error;