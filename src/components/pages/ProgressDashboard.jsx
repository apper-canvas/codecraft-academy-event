import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import courseService from "@/services/api/courseService";
import progressService from "@/services/api/progressService";

const ProgressDashboard = () => {
    const navigate = useNavigate();
    
    const [courses, setCourses] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const [coursesData, progressDataResponse] = await Promise.all([
                courseService.getAll(),
                progressService.getAll()
            ]);
            
            setCourses(coursesData);
            setProgressData(progressDataResponse);
            
        } catch (err) {
            setError(err.message);
            toast.error("Failed to load progress data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getProgressStats = () => {
        const totalCourses = courses.length;
        const startedCourses = progressData.length;
        const completedCourses = progressData.filter(p => p.completionPercentage === 100).length;
        const inProgressCourses = progressData.filter(p => p.completionPercentage > 0 && p.completionPercentage < 100).length;
        
        const totalLessonsCompleted = progressData.reduce((sum, p) => sum + p.completedLessons.length, 0);
        const averageProgress = startedCourses > 0 
            ? progressData.reduce((sum, p) => sum + p.completionPercentage, 0) / startedCourses 
            : 0;
        
        return {
            totalCourses,
            startedCourses,
            completedCourses,
            inProgressCourses,
            totalLessonsCompleted,
            averageProgress
        };
    };

    const getCourseProgress = (courseId) => {
        return progressData.find(p => p.courseId === courseId);
    };

    const getRecentActivity = () => {
        return progressData
            .filter(p => p.lastAccessedLesson)
            .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
            .slice(0, 5);
    };

    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    const handleContinueLesson = (courseId, lessonId) => {
        navigate(`/course/${courseId}/lesson/${lessonId}`);
    };

    const handleBrowseCourses = () => {
        navigate("/");
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <Error message={error} onRetry={loadData} />;
    }

    const stats = getProgressStats();
    const recentActivity = getRecentActivity();
    const startedCourses = progressData.map(progress => {
        const course = courses.find(c => c.id === progress.courseId);
        return course ? { course, progress } : null;
    }).filter(Boolean);

    if (!startedCourses.length) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Empty 
                    type="progress" 
                    onAction={handleBrowseCourses}
                    actionText="Browse Courses"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Progress</h1>
                    <p className="text-xl text-gray-600">Track your learning journey and achievements</p>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-4 lg:p-6 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
                        <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">{stats.startedCourses}</div>
                        <div className="text-xs lg:text-sm text-gray-600">Started</div>
                    </Card>
                    <Card className="p-4 lg:p-6 text-center bg-gradient-to-br from-success/5 to-emerald-100">
                        <div className="text-2xl lg:text-3xl font-bold text-success mb-1">{stats.completedCourses}</div>
                        <div className="text-xs lg:text-sm text-gray-600">Completed</div>
                    </Card>
                    <Card className="p-4 lg:p-6 text-center bg-gradient-to-br from-warning/5 to-amber-100">
                        <div className="text-2xl lg:text-3xl font-bold text-warning mb-1">{stats.inProgressCourses}</div>
                        <div className="text-xs lg:text-sm text-gray-600">In Progress</div>
                    </Card>
                    <Card className="p-4 lg:p-6 text-center bg-gradient-to-br from-info/5 to-blue-100">
                        <div className="text-2xl lg:text-3xl font-bold text-info mb-1">{stats.totalLessonsCompleted}</div>
                        <div className="text-xs lg:text-sm text-gray-600">Lessons</div>
                    </Card>
                    <Card className="p-4 lg:p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 col-span-2">
                        <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">{Math.round(stats.averageProgress)}%</div>
                        <div className="text-xs lg:text-sm text-gray-600">Average Progress</div>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Course Progress */}
                    <motion.div
                        className="xl:col-span-2 space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
                        
                        <div className="space-y-4">
                            {startedCourses.map(({ course, progress }) => {
                                const totalLessons = course.chapters?.reduce((sum, chapter) => sum + chapter.lessons.length, 0) || 0;
                                const completedLessons = progress.completedLessons?.length || 0;
                                
                                return (
                                    <Card key={course.id} className="p-6 hover:shadow-xl transition-shadow cursor-pointer" hover>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                                                    <ApperIcon name="Code2" className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                                                    <p className="text-gray-600 line-clamp-2">{course.description}</p>
                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                        <span>{completedLessons}/{totalLessons} lessons</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{course.difficulty}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge 
                                                variant={progress.completionPercentage === 100 ? "success" : "primary"}
                                            >
                                                {progress.completionPercentage === 100 ? "Completed" : "In Progress"}
                                            </Badge>
                                        </div>

                                        <div className="mb-4">
                                            <ProgressBar
                                                value={progress.completionPercentage}
                                                showValue
                                                variant={progress.completionPercentage === 100 ? "success" : "primary"}
                                            />
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                Started {format(new Date(progress.startedAt), "MMM d, yyyy")}
                                            </span>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleCourseClick(course.id)}
                                                >
                                                    View Course
                                                </Button>
                                                {progress.lastAccessedLesson && progress.completionPercentage < 100 && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleContinueLesson(course.id, progress.lastAccessedLesson)}
                                                        icon="Play"
                                                    >
                                                        Continue
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                        
                        <Card className="p-6">
                            {recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.map((progress) => {
                                        const course = courses.find(c => c.id === progress.courseId);
                                        if (!course) return null;
                                        
                                        return (
                                            <div key={progress.courseId} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                                    <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 text-sm">{course.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {progress.completionPercentage}% complete
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCourseClick(course.id)}
                                                    icon="ExternalLink"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ApperIcon name="Activity" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600">No recent activity</p>
                                    <p className="text-sm text-gray-500 mt-1">Start a lesson to see your activity here</p>
                                </div>
                            )}
                        </Card>

                        {/* Quick Actions */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button
                                    variant="primary"
                                    className="w-full justify-start"
                                    onClick={handleBrowseCourses}
                                    icon="Search"
                                >
                                    Browse More Courses
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate("/playground")}
                                    icon="Code2"
                                >
                                    Open Code Playground
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProgressDashboard;