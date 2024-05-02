import {createTasks, jobs} from "../../workers/main.js";

export const stackListService = {
    createTasks: async (data) => await createTasks(data),
    cancelJob: async (itemId) => {
        if (itemId && jobs[itemId]) await jobs[itemId].job.cancelJob()
    }
};
