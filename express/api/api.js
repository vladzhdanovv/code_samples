import axios from "axios";
import {loadConfig} from "./envConfig.js";

loadConfig()

export const vhApiInstance = axios.create({
    baseURL: process.env.VEHICLE_API
});
