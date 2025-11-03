import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import lessonService from "@/services/api/lessonService";
import courseService from "@/services/api/courseService";
import progressService from "@/services/api/progressService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/atoms/ProgressBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { cn } from "@/utils/cn";

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    const [course, setCourse] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCourse = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const [courseData, progressData] = await Promise.all([
                courseService.getById(courseId),
                progressService.getByCourseId(courseId)
            ]);
            
            setCourse(courseData);
            setUserProgress(progressData);
            
        } catch (err) {
            setError(err.message);
            toast.error("Failed to load course details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            loadCourse();
        }
    }, [courseId]);

    const handleStartCourse = () => {
        if (!course.chapters?.length) {
            toast.error("This course doesn't have any lessons yet");
            return;
        }
        
        const firstLesson = course.chapters[0]?.lessons[0];
        if (firstLesson) {
            navigate(`/course/${courseId}/lesson/${firstLesson.id}`);
        }
    };

    const handleContinueCourse = () => {
        if (userProgress?.lastAccessedLesson) {
            navigate(`/course/${courseId}/lesson/${userProgress.lastAccessedLesson}`);
        } else {
            handleStartCourse();
        }
    };

const handleLessonClick = (lesson) => {
        // Validate lesson exists - handle both Id and id fields for compatibility
        const lessonId = lesson?.Id || lesson?.id;
        if (!lesson || !lessonId) {
            toast.error('Invalid lesson selected');
            return;
        }

        // Navigate to lesson - let LessonView handle lesson loading and validation
        navigate(`/course/${courseId}/lesson/${lessonId}`);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <Error message={error} onRetry={loadCourse} type="course" />;
    }

    if (!course) {
        return <Error message="Course not found" type="course" />;
    }

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
    const completedLessons = userProgress?.completedLessons?.length || 0;
    const progressPercentage = userProgress?.completionPercentage || 0;
    const hasStarted = userProgress && progressPercentage > 0;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Course Info */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                                    <ApperIcon 
                                        name={getLanguageIcon(course.language)} 
                                        className="w-10 h-10 text-white" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
                                        <Badge 
                                            variant={getDifficultyColor(course.difficulty)}
                                            size="lg"
                                            className="capitalize"
                                        >
                                            {course.difficulty}
                                        </Badge>
                                    </div>
                                    <p className="text-xl text-gray-600 leading-relaxed">{course.description}</p>
                                </div>
                            </div>

                            {/* Course Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{totalLessons}</div>
                                    <div className="text-sm text-gray-600">Lessons</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{course.estimatedHours}h</div>
                                    <div className="text-sm text-gray-600">Duration</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-success">{completedLessons}</div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-warning">{Math.round(progressPercentage)}%</div>
                                    <div className="text-sm text-gray-600">Progress</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {hasStarted && (
                                <div className="mb-8">
                                    <ProgressBar
                                        value={progressPercentage}
                                        label="Course Progress"
                                        showValue
                                        variant="success"
                                        size="lg"
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {hasStarted ? (
                                    <Button
                                        size="lg"
                                        onClick={handleContinueCourse}
                                        icon="Play"
                                        className="flex-1 sm:flex-none"
                                    >
                                        Continue Learning
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        onClick={handleStartCourse}
                                        icon="Play"
                                        className="flex-1 sm:flex-none"
                                    >
                                        Start Course
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => navigate("/")}
                                    icon="ChevronLeft"
                                >
                                    Back to Courses
                                </Button>
                            </div>
                        </div>

                        {/* Course Preview */}
                        <div className="lg:w-96">
                            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll learn</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start space-x-3">
                                        <ApperIcon name="Check" className="w-5 h-5 text-success mt-0.5" />
                                        <span className="text-gray-700">Master {course.language} fundamentals</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <ApperIcon name="Check" className="w-5 h-5 text-success mt-0.5" />
                                        <span className="text-gray-700">Build real-world projects</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <ApperIcon name="Check" className="w-5 h-5 text-success mt-0.5" />
                                        <span className="text-gray-700">Practice with interactive exercises</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <ApperIcon name="Check" className="w-5 h-5 text-success mt-0.5" />
                                        <span className="text-gray-700">Test knowledge with quizzes</span>
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </motion.div>

                {/* Course Syllabus */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Course Syllabus</h2>
                    
                    <div className="space-y-6">
                        {course.chapters?.map((chapter, chapterIndex) => (
                            <Card key={chapter.id} className="overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Chapter {chapterIndex + 1}: {chapter.title}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {chapter.lessons?.length || 0} lessons
                                    </p>
                                </div>
                                
                                <div className="p-6">
<div className="space-y-3">
{chapter.lessons?.map((lesson, lessonIndex) => {
const lessonId = lesson?.id;
                                            const isCompleted = userProgress?.completedLessons?.includes(lessonId);
                                            const isCurrent = userProgress?.lastAccessedLesson === lesson.id;
                                            
                                            // Validate lesson data
                                            if (!lesson || !lesson.id || !lesson.title) {
                                                return null; // Skip invalid lessons
                                            }
                                            
                                            return (
                                                <motion.button
key={lesson?.id}
                                                    onClick={() => handleLessonClick(lesson)}
                                                    className={cn(
                                                        "w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center space-x-4 group",
                                                        isCurrent
                                                            ? "bg-primary text-white shadow-lg"
                                                            : isCompleted
                                                            ? "bg-success/10 text-success hover:bg-success/20"
                                                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                    )}
                                                    whileHover={{ x: 4 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="w-8 h-8 flex items-center justify-center">
                                                        {isCompleted ? (
                                                            <ApperIcon name="Check" className="w-5 h-5" />
                                                        ) : isCurrent ? (
                                                            <ApperIcon name="Play" className="w-5 h-5" />
                                                        ) : (
                                                            <span className="text-sm font-medium">
                                                                {lessonIndex + 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{lesson.title}</h4>
{!lesson?.id && (
                                                            <span className="text-xs text-gray-400">
                                                                Coming soon
                                                            </span>
                                                        )}
                                                    </div>
                                                    <ApperIcon 
                                                        name="ChevronRight" 
                                                        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                                                    />
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CourseDetail;