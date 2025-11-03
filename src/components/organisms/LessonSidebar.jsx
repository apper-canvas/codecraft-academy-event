import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const LessonSidebar = ({ 
    course,
    currentLessonId,
    completedLessons = [],
    onLessonClick,
    isOpen = true,
    onToggle,
    className 
}) => {
    if (!course) return null;

    const getTotalLessons = () => {
        return course.chapters?.reduce((total, chapter) => total + chapter.lessons.length, 0) || 0;
    };

    const getCompletedCount = () => {
        return completedLessons.length;
    };

    const isLessonCompleted = (lessonId) => {
        return completedLessons.includes(lessonId);
    };

const isLessonCurrent = (lessonId) => {
        return currentLessonId === lessonId;
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.div
                className={cn(
                    "fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 shadow-lg overflow-y-auto z-40 hidden lg:block",
                    isOpen ? "w-80" : "w-16",
                    className
                )}
                animate={{ width: isOpen ? 320 : 64 }}
                transition={{ duration: 0.3 }}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                        {isOpen && (
                            <div className="flex-1 mr-3">
                                <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                                    {course.title}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {getCompletedCount()}/{getTotalLessons()} completed
                                </p>
                            </div>
                        )}
                        <button
                            onClick={onToggle}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ApperIcon 
                                name={isOpen ? "ChevronLeft" : "ChevronRight"} 
                                className="w-5 h-5 text-gray-600" 
                            />
                        </button>
                    </div>

                    {isOpen && (
                        <div className="space-y-4">
                            {course.chapters?.map((chapter, chapterIndex) => (
                                <div key={chapter.id} className="space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-700 px-2">
                                        Chapter {chapterIndex + 1}: {chapter.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {chapter.lessons?.map((lesson, lessonIndex) => {
                                            const isCompleted = isLessonCompleted(lesson.id);
                                            const isCurrent = isLessonCurrent(lesson.id);
                                            
                                            return (
                                                <motion.button
                                                    key={lesson.id}
                                                    onClick={() => onLessonClick(lesson)}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-3",
                                                        isCurrent
                                                            ? "bg-primary text-white shadow-md"
                                                            : isCompleted
                                                            ? "bg-success/10 text-success hover:bg-success/20"
                                                            : "text-gray-600 hover:bg-gray-100"
                                                    )}
                                                    whileHover={{ x: isCurrent ? 0 : 4 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="w-6 h-6 flex items-center justify-center">
                                                        {isCompleted ? (
                                                            <ApperIcon name="Check" className="w-4 h-4" />
                                                        ) : isCurrent ? (
                                                            <ApperIcon name="Play" className="w-4 h-4" />
                                                        ) : (
                                                            <span className="text-xs font-medium">
                                                                {lessonIndex + 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="flex-1 text-sm font-medium line-clamp-1">
                                                        {lesson.title}
                                                    </span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Mobile Overlay Sidebar */}
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 lg:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onToggle}
                    />
                    <motion.div
                        className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        {course.title}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {getCompletedCount()}/{getTotalLessons()} completed
                                    </p>
                                </div>
                                <button
                                    onClick={onToggle}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {course.chapters?.map((chapter, chapterIndex) => (
                                    <div key={chapter.id} className="space-y-2">
                                        <h3 className="text-sm font-semibold text-gray-700 px-2">
                                            Chapter {chapterIndex + 1}: {chapter.title}
                                        </h3>
                                        <div className="space-y-1">
                                            {chapter.lessons?.map((lesson, lessonIndex) => {
                                                const isCompleted = isLessonCompleted(lesson.id);
                                                const isCurrent = isLessonCurrent(lesson.id);
                                                
                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => {
                                                            onLessonClick(lesson);
                                                            onToggle();
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3",
                                                            isCurrent
                                                                ? "bg-primary text-white"
                                                                : isCompleted
                                                                ? "bg-success/10 text-success"
                                                                : "text-gray-600 hover:bg-gray-100"
                                                        )}
                                                    >
                                                        <div className="w-6 h-6 flex items-center justify-center">
                                                            {isCompleted ? (
                                                                <ApperIcon name="Check" className="w-4 h-4" />
                                                            ) : isCurrent ? (
                                                                <ApperIcon name="Play" className="w-4 h-4" />
                                                            ) : (
                                                                <span className="text-xs font-medium">
                                                                    {lessonIndex + 1}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="flex-1 text-sm font-medium">
                                                            {lesson.title}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

export default LessonSidebar;