import {vhApiInstance} from "./api.js";

export const handleError = (data) => {
    const {description, error, itemId = 1} = data;
    vhApiInstance.post('extensionLogs', {
        source: "CLMA",
        error: typeof error === 'object'? JSON.stringify(error, null, 4) : error.toString(),
        description: typeof description === 'object'? JSON.stringify(description, null, 4) : description.toString(),
        maker_schedule_id: itemId
    })
        .then(res => console.log('handleError', res?.data) )
        .catch(err => console.log(err))
}
