import progressData from "@/services/mockData/progress.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const progressService = {
    async getAll() {
        await delay(300);
        return [...progressData];
    },

    async getById(id) {
        await delay(200);
        const progress = progressData.find(p => p.id === id);
        if (!progress) {
            throw new Error("Progress not found");
        }
        return { ...progress };
    },

    async getByCourseId(courseId) {
        await delay(250);
        const progress = progressData.find(p => p.courseId === courseId);
        return progress ? { ...progress } : null;
    },

    async getByUserId(userId) {
        await delay(300);
        return progressData.filter(p => p.userId === userId);
    },

    async updateProgress(courseId, completedLessonId) {
        await delay(350);
        
        let existingProgress = progressData.find(p => p.courseId === courseId);
        
        if (!existingProgress) {
            // Create new progress record
            const newProgress = {
                id: String(Math.max(...progressData.map(p => parseInt(p.id))) + 1),
                userId: "user-1",
                courseId: courseId,
                completedLessons: [completedLessonId],
                quizScores: {},
                lastAccessedLesson: completedLessonId,
                startedAt: new Date().toISOString(),
                completionPercentage: 0
            };
            
            // Calculate completion percentage (simplified - would need course data in real implementation)
            newProgress.completionPercentage = Math.min(Math.round((newProgress.completedLessons.length / 20) * 100), 100);
            
            progressData.push(newProgress);
            return { ...newProgress };
        } else {
            // Update existing progress
            const index = progressData.findIndex(p => p.id === existingProgress.id);
            
            if (!existingProgress.completedLessons.includes(completedLessonId)) {
                existingProgress.completedLessons.push(completedLessonId);
            }
            
            existingProgress.lastAccessedLesson = completedLessonId;
            existingProgress.completionPercentage = Math.min(Math.round((existingProgress.completedLessons.length / 20) * 100), 100);
            
            progressData[index] = existingProgress;
            return { ...existingProgress };
        }
    },

    async updateQuizScore(courseId, lessonId, score) {
        await delay(300);
        
        let existingProgress = progressData.find(p => p.courseId === courseId);
        
        if (existingProgress) {
            const index = progressData.findIndex(p => p.id === existingProgress.id);
            existingProgress.quizScores[lessonId] = score;
            progressData[index] = existingProgress;
            return { ...existingProgress };
        }
        
        throw new Error("Progress record not found");
    },

    async create(progressInfo) {
        await delay(400);
        const newProgress = {
            ...progressInfo,
            id: String(Math.max(...progressData.map(p => parseInt(p.id))) + 1),
            startedAt: new Date().toISOString(),
            completionPercentage: 0
        };
        progressData.push(newProgress);
        return { ...newProgress };
    },

    async update(id, updateData) {
        await delay(350);
        const index = progressData.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error("Progress not found");
        }
        progressData[index] = { ...progressData[index], ...updateData };
        return { ...progressData[index] };
    },

    async delete(id) {
        await delay(300);
        const index = progressData.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error("Progress not found");
        }
        const deletedProgress = { ...progressData[index] };
        progressData.splice(index, 1);
        return deletedProgress;
    }
};

export default progressService;