import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ type = "default", onAction, actionText = "Get Started" }) => {
    const getEmptyContent = () => {
        switch (type) {
            case "courses":
                return {
                    icon: "BookOpen",
                    title: "No Courses Available",
                    description: "There are no programming courses available at the moment. Check back soon for new content!",
                    actionText: "Browse All Courses"
                };
            case "progress":
                return {
                    icon: "TrendingUp",
                    title: "Start Your Learning Journey",
                    description: "You haven't started any courses yet. Choose a programming language and begin your coding adventure!",
                    actionText: "Browse Courses"
                };
            case "search":
                return {
                    icon: "Search",
                    title: "No Results Found",
                    description: "We couldn't find any courses matching your search. Try different keywords or browse all available courses.",
                    actionText: "View All Courses"
                };
            case "lessons":
                return {
                    icon: "FileText",
                    title: "No Lessons Available",
                    description: "This course doesn't have any lessons yet. Content may be coming soon!",
                    actionText: "Back to Courses"
                };
            default:
                return {
                    icon: "Code2",
                    title: "Ready to Start Coding?",
                    description: "Your programming journey begins here. Choose a course and start building amazing things!",
                    actionText: actionText
                };
        }
    };

    const emptyContent = getEmptyContent();

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[400px] px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mb-8"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                <ApperIcon name={emptyContent.icon} className="w-16 h-16 text-primary" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {emptyContent.title}
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md text-lg leading-relaxed">
                {emptyContent.description}
            </p>
            
            {onAction && (
                <motion.button
                    onClick={onAction}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ApperIcon name="Play" className="w-5 h-5" />
                    <span>{emptyContent.actionText}</span>
                </motion.button>
            )}
        </motion.div>
    );
};

export default Empty;