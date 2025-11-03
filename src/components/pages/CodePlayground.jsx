import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import CodeEditor from "@/components/molecules/CodeEditor";

const CodePlayground = () => {
    const [activeLanguage, setActiveLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [savedSnippets, setSavedSnippets] = useState({});

    const languages = [
        { 
            id: "javascript", 
            name: "JavaScript", 
            icon: "FileText",
            template: "// Welcome to JavaScript Playground\nconsole.log('Hello, World!');\n\n// Try some basic operations\nconst number = 42;\nconst string = 'CodeCraft Academy';\nconst array = [1, 2, 3, 4, 5];\n\nconsole.log('Number:', number);\nconsole.log('String:', string);\nconsole.log('Array:', array);"
        },
        { 
            id: "python", 
            name: "Python", 
            icon: "Code2",
            template: "# Welcome to Python Playground\nprint('Hello, World!')\n\n# Try some basic operations\nnumber = 42\nstring = 'CodeCraft Academy'\narray = [1, 2, 3, 4, 5]\n\nprint('Number:', number)\nprint('String:', string)\nprint('List:', array)"
        },
        { 
            id: "html", 
            name: "HTML", 
            icon: "Globe",
            template: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>CodeCraft Academy</title>\n</head>\n<body>\n    <h1>Welcome to HTML Playground</h1>\n    <p>Start building amazing web pages!</p>\n    \n    <div class=\"container\">\n        <h2>Features</h2>\n        <ul>\n            <li>Interactive learning</li>\n            <li>Real-time feedback</li>\n            <li>Hands-on practice</li>\n        </ul>\n    </div>\n</body>\n</html>"
        },
        { 
            id: "css", 
            name: "CSS", 
            icon: "Palette",
            template: "/* Welcome to CSS Playground */\nbody {\n    font-family: 'Inter', sans-serif;\n    background: linear-gradient(135deg, #6366f1, #8b5cf6);\n    color: white;\n    margin: 0;\n    padding: 20px;\n}\n\n.container {\n    max-width: 800px;\n    margin: 0 auto;\n    text-align: center;\n}\n\nh1 {\n    font-size: 3rem;\n    margin-bottom: 1rem;\n    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}\n\np {\n    font-size: 1.2rem;\n    opacity: 0.9;\n}"
        }
    ];

    // Load saved snippets from localStorage on component mount
    useEffect(() => {
        const saved = localStorage.getItem("playground-snippets");
        if (saved) {
            try {
                const parsedSnippets = JSON.parse(saved);
                setSavedSnippets(parsedSnippets);
                
                // Set initial code if exists for current language
                if (parsedSnippets[activeLanguage]) {
                    setCode(parsedSnippets[activeLanguage]);
                }
            } catch (err) {
                console.error("Failed to load saved snippets:", err);
            }
        }
    }, []);

    // Set template when language changes
    useEffect(() => {
        const language = languages.find(lang => lang.id === activeLanguage);
        if (language) {
            const savedCode = savedSnippets[activeLanguage];
            setCode(savedCode || language.template);
        }
    }, [activeLanguage, savedSnippets]);

    const handleLanguageChange = (languageId) => {
        // Save current code before switching
        if (code.trim() !== "" && code !== getCurrentLanguageTemplate()) {
            const newSnippets = { ...savedSnippets, [activeLanguage]: code };
            setSavedSnippets(newSnippets);
            localStorage.setItem("playground-snippets", JSON.stringify(newSnippets));
        }
        
        setActiveLanguage(languageId);
    };

    const getCurrentLanguageTemplate = () => {
        const language = languages.find(lang => lang.id === activeLanguage);
        return language?.template || "";
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        
        // Auto-save to localStorage (debounced)
        if (newCode.trim() !== "") {
            const newSnippets = { ...savedSnippets, [activeLanguage]: newCode };
            setSavedSnippets(newSnippets);
            localStorage.setItem("playground-snippets", JSON.stringify(newSnippets));
        }
    };

    const handleSave = () => {
        if (code.trim() === "") {
            toast.warning("Nothing to save!");
            return;
        }
        
        const newSnippets = { ...savedSnippets, [activeLanguage]: code };
        setSavedSnippets(newSnippets);
        localStorage.setItem("playground-snippets", JSON.stringify(newSnippets));
        toast.success(`${getCurrentLanguage()?.name} code saved!`);
    };

    const handleReset = () => {
        const language = getCurrentLanguage();
        if (language) {
            setCode(language.template);
            toast.info("Code reset to template");
        }
    };

    const handleClear = () => {
        setCode("");
        const newSnippets = { ...savedSnippets };
        delete newSnippets[activeLanguage];
        setSavedSnippets(newSnippets);
        localStorage.setItem("playground-snippets", JSON.stringify(newSnippets));
        toast.info("Code cleared");
    };

    const getCurrentLanguage = () => {
        return languages.find(lang => lang.id === activeLanguage);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Code Playground</h1>
                    <p className="text-xl text-gray-600">Experiment with code in a safe, interactive environment</p>
                </motion.div>

                {/* Language Selector */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex flex-wrap gap-3">
                        {languages.map((language) => (
                            <button
                                key={language.id}
                                onClick={() => handleLanguageChange(language.id)}
                                className={cn(
                                    "flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200",
                                    activeLanguage === language.id
                                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                                        : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary hover:shadow-md"
                                )}
                            >
                                <ApperIcon name={language.icon} className="w-4 h-4" />
                                <span>{language.name}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="primary"
                            size="sm"
                            icon="Save"
                            onClick={handleSave}
                        >
                            Save Code
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            icon="RotateCcw"
                            onClick={handleReset}
                        >
                            Reset to Template
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={handleClear}
                        >
                            Clear All
                        </Button>
                    </div>
                </motion.div>

                {/* Code Editor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-0 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <ApperIcon name={getCurrentLanguage()?.icon || "Code"} className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {getCurrentLanguage()?.name} Editor
                                    </h2>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <ApperIcon name="Zap" className="w-4 h-4" />
                                    <span>Interactive Mode</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <CodeEditor
                                initialCode={code}
                                language={activeLanguage}
                                onCodeChange={handleCodeChange}
                                className="min-h-[500px]"
                            />
                        </div>
                    </Card>
                </motion.div>

                {/* Tips Section */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="p-6 bg-gradient-to-br from-info/5 to-primary/5 border-info/20">
                        <div className="flex items-start space-x-3">
                            <ApperIcon name="Lightbulb" className="w-6 h-6 text-info mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Playground Tips</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start space-x-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                                        <span>Your code is automatically saved as you type</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                                        <span>Click "Run" to see your code output in real-time</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                                        <span>Switch between languages to experiment with different syntax</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                                        <span>Use this space to practice concepts from your courses</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default CodePlayground;