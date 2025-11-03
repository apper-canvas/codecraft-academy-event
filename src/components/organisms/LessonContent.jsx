import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CodeEditor from "@/components/molecules/CodeEditor";
import QuizQuestion from "@/components/molecules/QuizQuestion";
import ProgressBar from "@/components/atoms/ProgressBar";

const LessonContent = ({ 
    lesson,
    course,
    onComplete,
    onNext,
    onPrevious,
    isCompleted = false,
    hasNext = false,
    hasPrevious = false,
    sidebarOpen = true,
    className 
}) => {
    const [currentCode, setCurrentCode] = useState(lesson?.codeExample || "");
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});

useEffect(() => {
        if (lesson) {
            setCurrentCode(lesson.codeExample || "");
            setShowQuiz(false);
            setQuizCompleted(false);
            setCurrentQuestionIndex(0);
            setUserAnswers({});
        }
}, [lesson?.Id]);

    if (!lesson) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <ApperIcon name="BookOpen" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">Select a lesson to start learning</h3>
                </div>
            </div>
        );
    }

    const handleCodeRun = (code) => {
        console.log("Running code:", code);
    };

    const handleStartQuiz = () => {
        setShowQuiz(true);
    };

    const handleQuizAnswer = (questionId, answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));

        // Move to next question or complete quiz
        if (currentQuestionIndex < lesson.quiz.questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 2000);
        } else {
            setTimeout(() => {
                setQuizCompleted(true);
                if (!isCompleted) {
                    onComplete?.(lesson.id);
                }
            }, 2000);
        }
    };

    const renderContent = (content) => {
        return { __html: content.replace(/\n/g, '<br />') };
    };

    const currentQuestion = lesson.quiz?.questions?.[currentQuestionIndex];
    const quizProgress = lesson.quiz?.questions ? ((currentQuestionIndex + 1) / lesson.quiz.questions.length) * 100 : 0;

    return (
        <div className={cn(
            "flex-1 bg-white transition-all duration-300",
            sidebarOpen ? "lg:ml-80" : "lg:ml-16",
            className
        )}>
            {!showQuiz ? (
                <div className="flex flex-col lg:flex-row h-full">
                    {/* Content Panel */}
                    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-4xl">
                            <div className="mb-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    {isCompleted && (
                                        <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                                            <ApperIcon name="Check" className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
                                </div>
                                <p className="text-gray-600 text-lg">{course?.title}</p>
                            </div>

                            <div className="lesson-content prose prose-lg max-w-none">
                                <div dangerouslySetInnerHTML={renderContent(lesson.content)} />
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
                                <div className="flex items-center space-x-3">
                                    {hasPrevious && (
                                        <Button
                                            variant="outline"
                                            onClick={onPrevious}
                                            icon="ChevronLeft"
                                        >
                                            Previous
                                        </Button>
                                    )}
                                </div>

                                <div className="flex items-center space-x-3">
                                    {lesson.quiz?.questions?.length > 0 && !isCompleted && (
                                        <Button
                                            variant="secondary"
                                            onClick={handleStartQuiz}
                                            icon="HelpCircle"
                                        >
                                            Take Quiz
                                        </Button>
                                    )}
                                    
                                    {hasNext && (
                                        <Button
                                            variant="primary"
                                            onClick={onNext}
                                            icon="ChevronRight"
                                            iconPosition="right"
                                        >
                                            Next Lesson
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Code Editor Panel */}
                    {lesson.codeExample && (
                        <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 p-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Try it yourself</h3>
                                <p className="text-sm text-gray-600">Edit and run the code to see how it works</p>
                            </div>
                            <CodeEditor
                                initialCode={lesson.codeExample}
                                language={course?.language || "javascript"}
                                onCodeChange={setCurrentCode}
                                onRun={handleCodeRun}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Quiz: {lesson.title}
                                </h1>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowQuiz(false)}
                                    icon="X"
                                    size="sm"
                                />
                            </div>
                            <ProgressBar
                                value={quizProgress}
                                label={`Question ${currentQuestionIndex + 1} of ${lesson.quiz?.questions?.length || 0}`}
                                showValue
                                variant="primary"
                            />
                        </div>

                        {quizCompleted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-success to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ApperIcon name="Trophy" className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Quiz Completed!
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Great job! You've successfully completed this lesson.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowQuiz(false)}
                                        icon="BookOpen"
                                    >
                                        Review Lesson
                                    </Button>
                                    {hasNext && (
                                        <Button
                                            variant="primary"
                                            onClick={onNext}
                                            icon="ChevronRight"
                                            iconPosition="right"
                                        >
                                            Next Lesson
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ) : currentQuestion ? (
                            <QuizQuestion
                                question={currentQuestion}
                                onAnswer={(answer) => handleQuizAnswer(currentQuestion.id, answer)}
                            />
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonContent;