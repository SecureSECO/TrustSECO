import axios from 'axios';
import { Job } from '../types';

const SPIDER_ENDPOINT = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/' : 'http://spider:5000/';
const axiosInstance = axios.create({
    baseURL: SPIDER_ENDPOINT,
});

export async function runJob(job: Job): Promise<void> {
    const { data } = await axiosInstance.post('get_data', job);
}
