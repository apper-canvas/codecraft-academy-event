import coursesData from "@/services/mockData/courses.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const courseService = {
    async getAll() {
        await delay(300);
        return [...coursesData];
    },

    async getById(id) {
        await delay(200);
        const course = coursesData.find(c => c.id === id);
        if (!course) {
            throw new Error("Course not found");
        }
        return { ...course };
    },

    async getByLanguage(language) {
        await delay(250);
        return coursesData.filter(c => c.language.toLowerCase() === language.toLowerCase());
    },

    async getByDifficulty(difficulty) {
        await delay(250);
        return coursesData.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    },

    async search(query) {
        await delay(300);
        const lowercaseQuery = query.toLowerCase();
        return coursesData.filter(course =>
            course.title.toLowerCase().includes(lowercaseQuery) ||
            course.description.toLowerCase().includes(lowercaseQuery) ||
            course.language.toLowerCase().includes(lowercaseQuery)
        );
    },

    async create(courseData) {
        await delay(400);
        const newCourse = {
            ...courseData,
            id: String(Math.max(...coursesData.map(c => parseInt(c.id))) + 1)
        };
        coursesData.push(newCourse);
        return { ...newCourse };
    },

    async update(id, updateData) {
        await delay(350);
        const index = coursesData.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error("Course not found");
        }
        coursesData[index] = { ...coursesData[index], ...updateData };
        return { ...coursesData[index] };
    },

    async delete(id) {
        await delay(300);
        const index = coursesData.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error("Course not found");
        }
        const deletedCourse = { ...coursesData[index] };
        coursesData.splice(index, 1);
        return deletedCourse;
    }
};

export default courseService;