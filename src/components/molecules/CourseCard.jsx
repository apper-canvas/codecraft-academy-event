import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";

const CourseCard = ({ 
    course,
    progress = 0,
    onClick,
    className 
}) => {
    const getLanguageIcon = (language) => {
        const iconMap = {
            javascript: "FileText",
            python: "Code2",
            html: "Globe",
            css: "Palette",
            react: "Atom",
            nodejs: "Server"
        };
        return iconMap[language.toLowerCase()] || "Code";
    };

    const getDifficultyColor = (difficulty) => {
        const colorMap = {
            beginner: "success",
            intermediate: "warning", 
            advanced: "error"
        };
        return colorMap[difficulty.toLowerCase()] || "default";
    };

    const totalLessons = course.chapters?.reduce((sum, chapter) => sum + chapter.lessons.length, 0) || 0;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card 
                hover 
                className={cn("cursor-pointer group", className)}
                onClick={() => onClick?.(course)}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <ApperIcon 
                            name={getLanguageIcon(course.language)} 
                            className="w-8 h-8 text-white" 
                        />
                    </div>
                    <Badge 
                        variant={getDifficultyColor(course.difficulty)}
                        className="capitalize"
                    >
                        {course.difficulty}
                    </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                </p>

                <div className="space-y-4">
                    {progress > 0 && (
                        <ProgressBar
                            value={progress}
                            label="Progress"
                            showValue
                            variant="success"
                        />
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <ApperIcon name="BookOpen" className="w-4 h-4" />
                            <span>{totalLessons} lessons</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <ApperIcon name="Clock" className="w-4 h-4" />
                            <span>{course.estimatedHours}h</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default CourseCard;