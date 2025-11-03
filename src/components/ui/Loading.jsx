import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
    if (type === "courses") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-lg"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl mb-4 opacity-30"></div>
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="flex items-center space-x-4">
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    if (type === "lesson") {
        return (
            <motion.div
                className="flex h-screen"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <div className="w-1/2 bg-white p-8">
                    <div className="h-8 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className={`h-4 bg-gray-200 rounded ${index % 3 === 2 ? 'w-2/3' : 'w-full'}`}></div>
                        ))}
                    </div>
                    <div className="mt-8 h-32 bg-gray-100 rounded-lg"></div>
                </div>
                <div className="w-1/2 bg-gray-50 p-8">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-white rounded-lg border-2 border-gray-200"></div>
                    <div className="mt-4 h-10 bg-primary rounded-lg opacity-30"></div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="flex items-center justify-center h-64">
            <motion.div
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            ></motion.div>
        </div>
    );
};

export default Loading;