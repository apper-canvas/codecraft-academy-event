import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CodeEditor = ({ 
    initialCode = "",
    language = "javascript",
    onCodeChange,
    onRun,
    readOnly = false,
    className 
}) => {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        setCode(newCode);
        onCodeChange?.(newCode);
    };

    const handleRun = async () => {
        setIsRunning(true);
        setError("");
        setOutput("");
        
        try {
            // Simulate code execution
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (language === "javascript") {
                try {
                    // Simple evaluation for demo purposes
                    const result = eval(code);
                    setOutput(result !== undefined ? String(result) : "Code executed successfully");
                } catch (err) {
                    setError(err.message);
                }
            } else {
                setOutput("Code executed successfully!\nOutput will be shown here in a real implementation.");
            }
            
            onRun?.(code);
        } catch (err) {
            setError("Execution failed: " + err.message);
        } finally {
            setIsRunning(false);
        }
    };

    const handleReset = () => {
        setCode(initialCode);
        setOutput("");
        setError("");
        onCodeChange?.(initialCode);
    };

    return (
        <div className={cn("bg-white rounded-xl border-2 border-gray-200 overflow-hidden", className)}>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <ApperIcon name="Code2" className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 capitalize">{language}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleReset}
                        icon="RotateCcw"
                        disabled={readOnly}
                    >
                        Reset
                    </Button>
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={handleRun}
                        icon={isRunning ? "Loader2" : "Play"}
                        loading={isRunning}
                        disabled={readOnly}
                    >
                        Run
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                <div className="flex-1 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 border-r border-gray-200 flex flex-col text-xs text-gray-500">
                        {code.split('\n').map((_, index) => (
                            <div key={index} className="px-2 py-1 text-right min-h-[1.5rem] leading-6">
                                {index + 1}
                            </div>
                        ))}
                    </div>
                    <textarea
                        value={code}
                        onChange={handleCodeChange}
                        readOnly={readOnly}
                        className="w-full h-64 lg:h-80 pl-14 pr-4 py-3 font-mono text-sm leading-6 resize-none border-none outline-none bg-white text-gray-900 code-editor"
                        spellCheck={false}
                        placeholder={readOnly ? "" : "Write your code here..."}
                    />
                </div>

                <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50">
                    <div className="px-4 py-2 border-b border-gray-200 bg-gray-100">
                        <div className="flex items-center space-x-2">
                            <ApperIcon name="Terminal" className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Output</span>
                        </div>
                    </div>
                    <div className="h-60 lg:h-[18rem] p-4 overflow-auto">
                        {isRunning ? (
                            <motion.div
                                className="flex items-center space-x-2 text-primary"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Running code...</span>
                            </motion.div>
                        ) : error ? (
                            <div className="text-error">
                                <div className="flex items-center space-x-2 mb-2">
                                    <ApperIcon name="AlertCircle" className="w-4 h-4" />
                                    <span className="text-sm font-medium">Error</span>
                                </div>
                                <pre className="text-xs whitespace-pre-wrap font-mono">{error}</pre>
                            </div>
                        ) : output ? (
                            <div className="text-success">
                                <div className="flex items-center space-x-2 mb-2">
                                    <ApperIcon name="Check" className="w-4 h-4" />
                                    <span className="text-sm font-medium">Success</span>
                                </div>
                                <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700">{output}</pre>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">
                                Click "Run" to execute your code and see the output here.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;