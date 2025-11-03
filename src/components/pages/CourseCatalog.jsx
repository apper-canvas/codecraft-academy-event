import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import CourseGrid from "@/components/organisms/CourseGrid";
import courseService from "@/services/api/courseService";
import progressService from "@/services/api/progressService";

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [userProgress, setUserProgress] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const languages = ["all", "javascript", "python", "html", "css", "react"];
    const difficulties = ["all", "beginner", "intermediate", "advanced"];

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const [coursesData, progressData] = await Promise.all([
                courseService.getAll(),
                progressService.getAll()
            ]);
            
            setCourses(coursesData);
            
            // Convert progress array to object for easy lookup
            const progressMap = {};
            progressData.forEach(progress => {
                progressMap[progress.courseId] = progress;
            });
            setUserProgress(progressMap);
            
        } catch (err) {
            setError(err.message);
            toast.error("Failed to load courses");
        } finally {
            setIsLoading(false);
        }
    };

    const filterCourses = () => {
        let filtered = courses;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.language.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Language filter
        if (selectedLanguage !== "all") {
            filtered = filtered.filter(course =>
                course.language.toLowerCase() === selectedLanguage.toLowerCase()
            );
        }

        // Difficulty filter
        if (selectedDifficulty !== "all") {
            filtered = filtered.filter(course =>
                course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
            );
        }

        setFilteredCourses(filtered);
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Set initial search from URL params
        const urlSearch = searchParams.get("search");
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        filterCourses();
    }, [courses, searchQuery, selectedLanguage, selectedDifficulty]);

    const handleCourseClick = (course) => {
        navigate(`/course/${course.id}`);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        // Update URL without navigation
        const newParams = new URLSearchParams(searchParams);
        if (query) {
            newParams.set("search", query);
        } else {
            newParams.delete("search");
        }
        window.history.replaceState({}, "", `${window.location.pathname}?${newParams}`);
    };

    const getContinuingCourses = () => {
        return Object.entries(userProgress)
            .filter(([_, progress]) => progress.completionPercentage > 0 && progress.completionPercentage < 100)
            .map(([courseId, progress]) => {
                const course = courses.find(c => c.id === courseId);
                return course ? { course, progress } : null;
            })
            .filter(Boolean);
    };

    const getCompletedCount = () => {
        return Object.values(userProgress).filter(progress => progress.completionPercentage === 100).length;
    };

    const continuingCourses = getContinuingCourses();

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <motion.h1 
                        className="text-4xl font-bold text-gray-900 mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Learn Programming Languages
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-gray-600"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Master coding through interactive lessons and hands-on practice
                    </motion.p>
                </div>

                {/* Stats */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl text-white">
                        <h3 className="text-2xl font-bold">{courses.length}</h3>
                        <p className="text-primary-100">Available Courses</p>
                    </div>
                    <div className="bg-gradient-to-br from-success to-emerald-600 p-6 rounded-2xl text-white">
                        <h3 className="text-2xl font-bold">{getCompletedCount()}</h3>
                        <p className="text-success-100">Completed</p>
                    </div>
                    <div className="bg-gradient-to-br from-warning to-amber-500 p-6 rounded-2xl text-white">
                        <h3 className="text-2xl font-bold">{continuingCourses.length}</h3>
                        <p className="text-warning-100">In Progress</p>
                    </div>
                </motion.div>

                {/* Continue Learning Section */}
                {continuingCourses.length > 0 && (
                    <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Learning</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {continuingCourses.map(({ course, progress }) => (
                                <motion.div 
                                    key={course.id}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
                                    onClick={() => handleCourseClick(course)}
                                    whileHover={{ y: -2 }}
                                >
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                                            <ApperIcon name="Code2" className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                                            <p className="text-sm text-gray-600">{Math.round(progress.completionPercentage)}% complete</p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                                            style={{ width: `${progress.completionPercentage}%` }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Search and Filters */}
                <motion.div 
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSearch={handleSearch}
                            className="w-full"
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-gray-700 py-2">Language:</span>
                            {languages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize",
                                        selectedLanguage === lang
                                            ? "bg-primary text-white"
                                            : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                                    )}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-gray-700 py-2">Level:</span>
                            {difficulties.map(difficulty => (
                                <button
                                    key={difficulty}
                                    onClick={() => setSelectedDifficulty(difficulty)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize",
                                        selectedDifficulty === difficulty
                                            ? "bg-primary text-white"
                                            : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                                    )}
                                >
                                    {difficulty}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Results Info */}
                {!isLoading && (
                    <motion.div 
                        className="mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-gray-600">
                            {searchQuery ? (
                                <>Showing {filteredCourses.length} results for <strong>"{searchQuery}"</strong></>
                            ) : (
                                <>Showing {filteredCourses.length} of {courses.length} courses</>
                            )}
                        </p>
                    </motion.div>
                )}

                {/* Course Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <CourseGrid
                        courses={filteredCourses}
                        isLoading={isLoading}
                        error={error}
                        onCourseClick={handleCourseClick}
                        onRetry={loadData}
                        searchQuery={searchQuery}
                        userProgress={userProgress}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default CourseCatalog;