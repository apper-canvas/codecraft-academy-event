import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import LessonSidebar from "@/components/organisms/LessonSidebar";
import LessonContent from "@/components/organisms/LessonContent";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import courseService from "@/services/api/courseService";
import lessonService from "@/services/api/lessonService";
import progressService from "@/services/api/progressService";

const LessonView = () => {
const { courseId: courseIdParam, lessonId: lessonIdParam } = useParams();
    const courseId = parseInt(courseIdParam);
    const lessonId = parseInt(lessonIdParam);
    const navigate = useNavigate();
    
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const [courseData, lessonData, progressData] = await Promise.all([
                courseService.getById(parseInt(courseId)),
                lessonService.getById(parseInt(lessonId)),
                progressService.getByCourseId(parseInt(courseId))
            ]);
            
            if (!lessonData) {
                throw new Error("Lesson not found");
            }
            
            setCourse(courseData);
            setCurrentLesson(lessonData);
            setUserProgress(progressData);
            
        } catch (err) {
            setError(err.message || "Failed to load lesson");
            toast.error("Failed to load lesson");
        } finally {
            setIsLoading(false);
        }
    };

    const updateProgress = async (completedLessonId) => {
        try {
            await progressService.updateProgress(courseId, completedLessonId);
            
            // Reload progress data
            const updatedProgress = await progressService.getByCourseId(courseId);
            setUserProgress(updatedProgress);
            
            toast.success("Lesson completed!");
        } catch (err) {
            toast.error("Failed to save progress");
        }
    };

useEffect(() => {
        if (courseId && lessonId) {
            loadData();
        }
}, [courseId, lessonId, loadData]);

    const getAllLessons = () => {
        if (!course?.chapters) return [];
        
        return course.chapters.reduce((allLessons, chapter) => {
            return [...allLessons, ...chapter.lessons];
        }, []);
    };

    const getCurrentLessonIndex = () => {
        const allLessons = getAllLessons();
        return allLessons.findIndex(lesson => lesson.id === lessonId);
};

    const getNextLesson = () => {
        const allLessons = getAllLessons();
        const currentIndex = getCurrentLessonIndex();
        return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
    };

    const getPreviousLesson = () => {
        const allLessons = getAllLessons();
        const currentIndex = getCurrentLessonIndex();
        return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    };

    const handleLessonClick = (lesson) => {
        navigate(`/course/${courseId}/lesson/${lesson.id}`);
    };

    const handleComplete = (lessonId) => {
        updateProgress(lessonId);
    };

    const handleNext = () => {
        const nextLesson = getNextLesson();
        if (nextLesson) {
            navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
        }
    };

    const handlePrevious = () => {
        const previousLesson = getPreviousLesson();
        if (previousLesson) {
            navigate(`/course/${courseId}/lesson/${previousLesson.id}`);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (isLoading) {
        return <Loading type="lesson" />;
    }

    if (error) {
        return <Error message={error} onRetry={loadData} type="lesson" />;
    }

    if (!course || !currentLesson) {
        return <Error message="Lesson not found" type="lesson" />;
    }

    const isLessonCompleted = userProgress?.completedLessons?.includes(lessonId);
    const hasNext = getNextLesson() !== null;
    const hasPrevious = getPreviousLesson() !== null;

    return (
        <div className="flex h-screen bg-background pt-16">
            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="sm"
                className="fixed top-20 left-4 z-50 lg:hidden"
                onClick={toggleSidebar}
                icon="Menu"
            />

            {/* Sidebar */}
            <LessonSidebar
                course={course}
                currentLessonId={lessonId}
                completedLessons={userProgress?.completedLessons || []}
                onLessonClick={handleLessonClick}
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
            />

            {/* Main Content */}
            <LessonContent
                lesson={currentLesson}
                course={course}
                onComplete={handleComplete}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isCompleted={isLessonCompleted}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                sidebarOpen={sidebarOpen}
            />
        </div>
    );
};

export default LessonView;