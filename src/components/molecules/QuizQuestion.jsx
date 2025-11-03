import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const QuizQuestion = ({ 
    question,
    onAnswer,
    showResult = false,
    userAnswer = null,
    className 
}) => {
    const [selectedOption, setSelectedOption] = useState(userAnswer);
    const [hasSubmitted, setHasSubmitted] = useState(showResult);

    const handleSubmit = () => {
        if (selectedOption !== null) {
            setHasSubmitted(true);
            onAnswer(selectedOption);
        }
    };

    const handleTryAgain = () => {
        setSelectedOption(null);
        setHasSubmitted(false);
    };

    const isCorrect = selectedOption === question.correctAnswer;

    return (
        <Card className={cn("max-w-2xl mx-auto", className)}>
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {question.prompt}
                </h3>
                
                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedOption === option;
                        const isCorrectOption = option === question.correctAnswer;
                        
                        let optionClasses = "w-full p-4 text-left border-2 rounded-xl transition-all duration-200";
                        
                        if (hasSubmitted) {
                            if (isCorrectOption) {
                                optionClasses += " border-success bg-success/10 text-success";
                            } else if (isSelected && !isCorrectOption) {
                                optionClasses += " border-error bg-error/10 text-error";
                            } else {
                                optionClasses += " border-gray-200 bg-gray-50 text-gray-500";
                            }
                        } else {
                            if (isSelected) {
                                optionClasses += " border-primary bg-primary/10 text-primary";
                            } else {
                                optionClasses += " border-gray-200 hover:border-primary hover:bg-primary/5 text-gray-700";
                            }
                        }

                        return (
                            <motion.button
                                key={index}
                                className={optionClasses}
                                onClick={() => !hasSubmitted && setSelectedOption(option)}
                                disabled={hasSubmitted}
                                whileHover={!hasSubmitted ? { scale: 1.01 } : undefined}
                                whileTap={!hasSubmitted ? { scale: 0.99 } : undefined}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex-1">{option}</span>
                                    {hasSubmitted && isCorrectOption && (
                                        <ApperIcon name="Check" className="w-5 h-5 text-success ml-2" />
                                    )}
                                    {hasSubmitted && isSelected && !isCorrectOption && (
                                        <ApperIcon name="X" className="w-5 h-5 text-error ml-2" />
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {hasSubmitted && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "p-4 rounded-xl mb-4",
                        isCorrect ? "bg-success/10 border border-success/20" : "bg-error/10 border border-error/20"
                    )}
                >
                    <div className="flex items-start space-x-3">
                        <ApperIcon 
                            name={isCorrect ? "Check" : "X"} 
                            className={cn("w-5 h-5 mt-0.5", isCorrect ? "text-success" : "text-error")} 
                        />
                        <div>
                            <p className={cn("font-medium mb-1", isCorrect ? "text-success" : "text-error")}>
                                {isCorrect ? "Correct!" : "Not quite right."}
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {question.explanation}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="flex justify-between items-center">
                {hasSubmitted ? (
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={handleTryAgain}
                            icon="RotateCcw"
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="primary"
                            icon="ChevronRight"
                            iconPosition="right"
                        >
                            Next Question
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={selectedOption === null}
                        icon="Check"
                    >
                        Submit Answer
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default QuizQuestion;