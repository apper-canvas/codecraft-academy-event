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
        const lesson = lessonsData.find(l => parseInt(l.id) === parseInt(id));
        if (!lesson) {
            throw new Error("Lesson not found");
        }
        return { ...lesson };
    },

async getByCourseId(courseId) {
        await delay(250);
        const course = coursesData.find(c => parseInt(c.id) === parseInt(courseId));
        if (!course) {
            throw new Error("Course not found");
        }
        
        const courseLessons = [];
        course.chapters?.forEach(chapter => {
            chapter.lessons?.forEach(lesson => {
                const fullLesson = lessonsData.find(l => parseInt(l.id) === parseInt(lesson.id));
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
        
        coursesData.forEach(course => {
            const chapter = course.chapters?.find(c => parseInt(c.id) === parseInt(chapterId));
            if (chapter) {
                chapter.lessons?.forEach(lesson => {
                    const fullLesson = lessonsData.find(l => parseInt(l.id) === parseInt(lesson.id));
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
        const index = lessonsData.findIndex(l => parseInt(l.id) === parseInt(id));
        if (index === -1) {
            throw new Error("Lesson not found");
        }
        lessonsData[index] = { ...lessonsData[index], ...updateData };
        return { ...lessonsData[index] };
    },

async delete(id) {
        await delay(300);
        const index = lessonsData.findIndex(l => parseInt(l.id) === parseInt(id));
        if (index === -1) {
            throw new Error("Lesson not found");
        }
        const deletedLesson = { ...lessonsData[index] };
        lessonsData.splice(index, 1);
        return deletedLesson;
    }
};

export default lessonService;