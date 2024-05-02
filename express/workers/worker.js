import {parentPort} from 'worker_threads';
import {stackListLib} from "../libs/stackList/index.js";
import {sendPostingStatus} from "../helpers/index.js";
import {handleError} from "../api/handleError.js";

const executeTask = async (item) => {
    let closeBrowser = null
    try {
        const makerId = item.profile['maker_id']
        const {page, closeBrowser: cb} = await stackListLib.auth();
        closeBrowser = cb
        const {link, postId} = await stackListLib.ad(page, item);
        await closeBrowser()
        await sendPostingStatus(true, item.id, {link, postId})
    } catch (err) {
        closeBrowser && await closeBrowser()
        await sendPostingStatus(false, item.id)
        handleError({
            itemId: item?.id,
            description: 'Error in worker.js',
            error: err?.message
        })
    }
}

parentPort.on('message', executeTask);
