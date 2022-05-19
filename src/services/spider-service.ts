import axios from 'axios';
import { Worker } from 'worker_threads';
import { Job, Tokens } from '../types';

const SPIDER_ENDPOINT = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/' : 'http://spider:5000/';
const spider = axios.create({
    baseURL: SPIDER_ENDPOINT,
});

let worker: Worker;
let workerRunning = false;

export async function setTokens(tokens: Tokens): Promise<string> {
    const { data } = await spider.post('set_tokens', tokens);
    return data;
}

export async function runJob(job: Job): Promise<unknown> {
    const { data } = await spider.post('get_data', job);
    return data;
}

export function startSpider(): void {
    workerRunning = true;
    worker = new Worker(`${__dirname}/spider-worker.js`);

    worker.on('message', (result) => {
        console.log(result);
    });

    worker.on('error', (error) => {
        console.error(error);
    });

    worker.on('exit', (exitCode) => {
        console.log(`It exited with code ${exitCode}`);
    });
}

export function stopSpider(): void {
    workerRunning = false;
    worker.postMessage({ exit: true });
}

export function isRunning(): boolean {
    return workerRunning;
}

export function getWorker(): Worker {
    return worker;
}
