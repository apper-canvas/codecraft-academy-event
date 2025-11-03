import { motion } from "framer-motion";
import CourseCard from "@/components/molecules/CourseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const CourseGrid = ({ 
    courses = [],
    isLoading = false,
    error = null,
    onCourseClick,
    onRetry,
    searchQuery = "",
    userProgress = {}
}) => {
    if (isLoading) {
        return <Loading type="courses" />;
    }

    if (error) {
        return <Error message={error} onRetry={onRetry} type="network" />;
    }

    if (!courses.length) {
        const emptyType = searchQuery ? "search" : "courses";
        return <Empty type={emptyType} onAction={onRetry} />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
            {courses.map((course) => {
                const progress = userProgress[course.id]?.completionPercentage || 0;
                
                return (
                    <motion.div key={course.id} variants={itemVariants}>
                        <CourseCard
                            course={course}
                            progress={progress}
                            onClick={onCourseClick}
                        />
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default CourseGrid;