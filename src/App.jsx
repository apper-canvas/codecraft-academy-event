import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import CourseCatalog from "@/components/pages/CourseCatalog";
import CourseDetail from "@/components/pages/CourseDetail";
import LessonView from "@/components/pages/LessonView";
import ProgressDashboard from "@/components/pages/ProgressDashboard";
import CodePlayground from "@/components/pages/CodePlayground";
import HelpCenter from "@/components/pages/HelpCenter";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-background">
                <Header />
                
                <Routes>
                    <Route path="/" element={<CourseCatalog />} />
                    <Route path="/courses" element={<CourseCatalog />} />
                    <Route path="/course/:courseId" element={<CourseDetail />} />
                    <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
                    <Route path="/progress" element={<ProgressDashboard />} />
                    <Route path="/playground" element={<CodePlayground />} />
                    <Route path="/help" element={<HelpCenter />} />
                </Routes>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    style={{ zIndex: 9999 }}
                />
            </div>
        </Router>
    );
}

export default App;