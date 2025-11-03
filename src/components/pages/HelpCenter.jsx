import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import SearchBar from "@/components/molecules/SearchBar";

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [expandedFaq, setExpandedFaq] = useState(null);

    const categories = [
        { id: "all", name: "All Topics", icon: "HelpCircle" },
        { id: "getting-started", name: "Getting Started", icon: "Play" },
        { id: "courses", name: "Courses", icon: "BookOpen" },
        { id: "technical", name: "Technical Issues", icon: "AlertTriangle" },
        { id: "account", name: "Account", icon: "User" },
        { id: "features", name: "Features", icon: "Zap" }
    ];

    const faqs = [
        {
            id: 1,
            category: "getting-started",
            question: "How do I start my first course?",
            answer: "Browse the course catalog on the homepage, select a course that interests you, and click 'Start Course'. We recommend beginning with 'Beginner' level courses if you're new to programming."
        },
        {
            id: 2,
            category: "getting-started",
            question: "What programming languages can I learn?",
            answer: "Currently, we offer courses in JavaScript, Python, HTML, CSS, React, and Node.js. Each course is designed with interactive lessons and hands-on coding exercises."
        },
        {
            id: 3,
            category: "courses",
            question: "How do I track my progress?",
            answer: "Visit the 'My Progress' page to see your completion status for all started courses. You can view completed lessons, quiz scores, and overall progress percentages."
        },
        {
            id: 4,
            category: "courses",
            question: "Can I skip lessons or jump around in a course?",
            answer: "Yes! Click on any lesson in the course sidebar to jump directly to it. However, we recommend following the sequential order for the best learning experience."
        },
        {
            id: 5,
            category: "technical",
            question: "The code editor isn't working properly. What should I do?",
            answer: "Try refreshing the page first. If the issue persists, check your browser's JavaScript is enabled and try using a different browser. Chrome, Firefox, and Safari work best."
        },
        {
            id: 6,
            category: "technical",
            question: "My quiz answers aren't saving. How can I fix this?",
            answer: "Make sure you're clicking 'Submit Answer' after selecting your choice. If problems persist, check your internet connection and try refreshing the lesson page."
        },
        {
            id: 7,
            category: "features",
            question: "How does the Code Playground work?",
            answer: "The Code Playground lets you experiment with code outside of structured lessons. Your code is automatically saved as you type, and you can switch between different programming languages."
        },
        {
            id: 8,
            category: "features",
            question: "Can I download my code from the playground?",
            answer: "Currently, code is saved in your browser's local storage. You can copy and paste your code to save it elsewhere. We're working on adding export functionality."
        },
        {
            id: 9,
            category: "account",
            question: "Is my progress saved automatically?",
            answer: "Yes! Your lesson progress and quiz scores are automatically saved as you complete them. Your progress is stored locally and persists across browser sessions."
        },
        {
            id: 10,
            category: "technical",
            question: "The website is loading slowly. Any suggestions?",
            answer: "Slow loading can be caused by internet connectivity or browser cache. Try refreshing the page, clearing your browser cache, or switching to a faster internet connection."
        }
    ];

    const quickActions = [
        {
            title: "Browse Courses",
            description: "Explore our programming courses",
            icon: "BookOpen",
            action: () => window.location.href = "/"
        },
        {
            title: "Code Playground",
            description: "Practice coding in real-time",
            icon: "Code2",
            action: () => window.location.href = "/playground"
        },
        {
            title: "View Progress",
            description: "Check your learning progress",
            icon: "TrendingUp",
            action: () => window.location.href = "/progress"
        }
    ];

    const getFilteredFaqs = () => {
        let filtered = faqs;

        if (selectedCategory !== "all") {
            filtered = filtered.filter(faq => faq.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(faq => 
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    const toggleFaq = (faqId) => {
        setExpandedFaq(expandedFaq === faqId ? null : faqId);
    };

    const filteredFaqs = getFilteredFaqs();

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
                    <p className="text-xl text-gray-600 mb-8">Find answers to common questions and get help with CodeCraft Academy</p>
                    
                    <div className="max-w-md mx-auto">
                        <SearchBar
                            placeholder="Search for help..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                            autoFocus
                        />
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <Card
                                key={index}
                                className="p-6 text-center cursor-pointer group"
                                hover
                                onClick={action.action}
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                                    <ApperIcon name={action.icon} className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                                <p className="text-gray-600">{action.description}</p>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={cn(
                                    "flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200",
                                    selectedCategory === category.id
                                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                                        : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary hover:shadow-md"
                                )}
                            >
                                <ApperIcon name={category.icon} className="w-4 h-4" />
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* FAQs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {searchQuery ? `Search Results (${filteredFaqs.length})` : "Frequently Asked Questions"}
                        </h2>
                        {filteredFaqs.length > 0 && (
                            <span className="text-sm text-gray-600">
                                Showing {filteredFaqs.length} of {faqs.length} questions
                            </span>
                        )}
                    </div>

                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-4">
                            {filteredFaqs.map((faq) => (
                                <Card key={faq.id} className="overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                                {faq.question}
                                            </h3>
                                            <ApperIcon
                                                name={expandedFaq === faq.id ? "ChevronUp" : "ChevronDown"}
                                                className="w-5 h-5 text-gray-500 flex-shrink-0"
                                            />
                                        </div>
                                    </button>
                                    
                                    {expandedFaq === faq.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="px-6 pb-6"
                                        >
                                            <div className="pt-4 border-t border-gray-200">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center">
                            <ApperIcon name="Search" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchQuery 
                                    ? `No help articles match "${searchQuery}". Try different keywords or browse by category.`
                                    : "No FAQs available in this category."
                                }
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Card>
                    )}
                </motion.div>

                {/* Contact Section */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                        <ApperIcon name="MessageCircle" className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Still need help?</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            If you can't find what you're looking for, our support team is here to help you succeed in your coding journey.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button icon="Mail">
                                Contact Support
                            </Button>
                            <Button variant="outline" icon="MessageSquare">
                                Community Forum
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default HelpCenter;