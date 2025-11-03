import coursesData from "@/services/mockData/courses.json";
import lessonsData from "@/services/mockData/lessons.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const lessonService = {
    async getAll() {
        await delay(300);
        return [...lessonsData];
    },

async getById(id) {
        await delay(200);
        
        // Validate input
        if (!id) {
            throw new Error("Lesson ID is required");
        }
        
        // Convert to integer for consistent comparison
        const lessonId = parseInt(id, 10);
        if (isNaN(lessonId)) {
            throw new Error(`Invalid lesson ID format: ${id}. Expected a valid number.`);
        }
        
        // Find lesson with detailed validation - use Id field to match lesson data structure
        const lesson = lessonsData.find(l => {
            const currentLessonId = parseInt(l.Id, 10);
            return currentLessonId === lessonId;
        });
        
        if (!lesson) {
            // Provide detailed error information for debugging
            const availableIds = lessonsData.map(l => l.Id).join(', ');
            throw new Error(`Lesson with ID ${lessonId} not found. Available lesson IDs: [${availableIds}]`);
        }
        
        return { ...lesson };
    },

async getByCourseId(courseId) {
        await delay(250);
        
        const parsedCourseId = parseInt(courseId, 10);
        if (isNaN(parsedCourseId)) {
            throw new Error(`Invalid course ID format: ${courseId}. Expected a valid number.`);
        }
        
        const course = coursesData.find(c => parseInt(c.id) === parseInt(courseId));
        if (!course) {
            throw new Error(`Course with ID ${courseId} not found. Please check if the course exists.`);
        }
        
        const courseLessons = [];
        course.chapters?.forEach(chapter => {
            chapter.lessons?.forEach(lesson => {
const fullLesson = lessonsData.find(l => {
                    const lessonDataId = parseInt(l.id, 10);
                    const chapterLessonId = parseInt(lesson.id, 10);
                    return lessonDataId === chapterLessonId;
                });
                if (fullLesson) {
                    courseLessons.push(fullLesson);
                }
            });
        });
        
        return courseLessons;
    },

async getByChapterId(chapterId) {
        await delay(250);
        let chapterLessons = [];
        
const parsedChapterId = parseInt(chapterId, 10);
        if (isNaN(parsedChapterId)) {
            throw new Error(`Invalid chapter ID format: ${chapterId}. Expected a valid number.`);
        }
        
        coursesData.forEach(course => {
            const chapter = course.chapters?.find(c => parseInt(c.id) === parsedChapterId);
            if (chapter) {
                chapter.lessons?.forEach(lesson => {
const fullLesson = lessonsData.find(l => {
                        const lessonDataId = parseInt(l.id, 10);
                        const chapterLessonId = parseInt(lesson.id, 10);
                        return lessonDataId === chapterLessonId;
                    });
                    if (fullLesson) {
                        chapterLessons.push(fullLesson);
                    }
                });
            }
        });
        
        return chapterLessons;
    },

    async create(lessonData) {
        await delay(400);
        const newLesson = {
            ...lessonData,
            id: String(Math.max(...lessonsData.map(l => parseInt(l.id))) + 1)
        };
        lessonsData.push(newLesson);
        return { ...newLesson };
    },

async update(id, updateData) {
await delay(350);
        
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            throw new Error(`Invalid lesson ID format: ${id}. Expected a valid number.`);
        }
        const index = lessonsData.findIndex(l => parseInt(l.id) === parseInt(id));
        if (index === -1) {
            throw new Error("Lesson not found");
        }
        lessonsData[index] = { ...lessonsData[index], ...updateData };
        return { ...lessonsData[index] };
    },

async delete(id) {
        await delay(300);
const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            throw new Error(`Invalid lesson ID format: ${id}. Expected a valid number.`);
        }
        
        const index = lessonsData.findIndex(l => parseInt(l.id) === parsedId);
        if (index === -1) {
            throw new Error("Lesson not found");
        }
        const deletedLesson = { ...lessonsData[index] };
        lessonsData.splice(index, 1);
        return deletedLesson;
    }
};

export default lessonService;