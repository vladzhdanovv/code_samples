import {Worker} from 'worker_threads';
import schedule from 'node-schedule';
import {DateTime} from "luxon";
import url from "url";
import path from "path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let jobs = {}

const addTaskToQueue = (item) => {
    const pathToWorker = path.join(__dirname, 'worker.js')
    const worker = new Worker(pathToWorker);
    worker.postMessage(item);
};

export const createTasks = async (data) => {

    if (!data.length) return

    data.forEach((item) => {

        const id = item?.id

        if (!jobs[id]) {
            const dateTimeInBoise = DateTime.fromISO(
                `${item.date_UTC}T${item.time_UTC}`,
                {zone: "UTC"}
            ).setZone(item.time_zone);

            const localTime = dateTimeInBoise.toLocal();
            const nowInTimeZone = DateTime.now().setZone(item.time_zone);

            if (localTime > nowInTimeZone) {
                const job = schedule.scheduleJob(localTime.toJSDate(), () => addTaskToQueue(item));

                jobs = {
                    ...jobs,
                    [item.id]: {
                        date: localTime.toJSDate(),
                        job
                    }
                }
            }
        }
    });
}
