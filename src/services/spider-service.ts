import {Job} from "../types";
import axios from "axios";

const spider_endpoint = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/' : 'http://spider:5000/';

export async function runJob(job: Job): Promise<void> {
    const {data} = await axios.post(`${spider_endpoint}/get_data`, job);

}
