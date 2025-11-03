import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const navigation = [
        { name: "Courses", href: "/", icon: "BookOpen" },
        { name: "My Progress", href: "/progress", icon: "TrendingUp" },
        { name: "Playground", href: "/playground", icon: "Code2" },
        { name: "Help", href: "/help", icon: "HelpCircle" }
    ];

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            navigate(`/?search=${encodeURIComponent(query)}`);
        } else {
            navigate("/");
        }
    };

    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/" || location.pathname === "/courses";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <motion.div
                            className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ApperIcon name="Code2" className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            CodeCraft Academy
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                                    isActive(item.href)
                                        ? "text-primary bg-primary/10"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                <ApperIcon name={item.icon} className="w-4 h-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden lg:block">
                        <SearchBar
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSearch={handleSearch}
                            className="w-64"
                        />
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        icon={isMobileMenuOpen ? "X" : "Menu"}
                    />
                </div>

                {/* Mobile Search (when menu is closed) */}
                <div className="lg:hidden pb-4">
                    <SearchBar
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white border-t border-gray-200"
                >
                    <nav className="px-4 py-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200",
                                    isActive(item.href)
                                        ? "text-primary bg-primary/10"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                <ApperIcon name={item.icon} className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </motion.div>
            )}
        </header>
    );
};

export default Header;