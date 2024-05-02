import {stackListService} from "../services/stackList.service.js";
import {stackListLib} from "../../libs/stackList/index.js";

export const stackListController = {
    createTasks: async (req, res, next) => {
        try {
            await stackListService.createTasks(req.body)
            return res.status(200).json('ok');
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    cancelJob: async (req, res, next) => {
        try {
            const {itemId} = req.params;
            await stackListService.cancelJob(itemId)
            return res.status(200).json('ok')
        } catch (err) {
            next(err)
        }
    },
    deletePost: async (req, res, next) => {
        try {
            const {ids} = req.query;
            const rawIds = ids.split(',')
            const result = await stackListLib.deletePosts(rawIds);
            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }
};
