import axios from 'axios';
import { Worker } from 'worker_threads';
import {
    Job, RandomJobResult, SpiderJob, Tokens,
} from '../types';

const SPIDER_ENDPOINT = 'http://spider:5000/';
const spider = axios.create({
    baseURL: SPIDER_ENDPOINT,
});

let worker: Worker;
let workerRunning = false;

export async function setTokens(tokens: Tokens): Promise<string> {
    const { data } = await spider.post('set_tokens', tokens);
    return data;
}

export async function getTokens(): Promise<Tokens> {
    const { data } = await spider.get('get_tokens');
    return data;
}

export async function runJob(job: RandomJobResult): Promise<unknown> {
    const spiderJob: SpiderJob = {
        project_info: {
            project_platform: job.packagePlatform,
            project_owner: job.packageOwner,
            project_name: job.packageName,
            project_release: job.version,
        },
    };

    switch (job.fact.split('_')[0]) {
        case 'cve':
            spiderJob.cve_data_points = [job.fact];
            break;
        case 'so':
            spiderJob.so_data_points = [job.fact];
            break;
        case 'lib':
            spiderJob.lib_data_points = [job.fact];
            break;
        case 'gh':
            spiderJob.gh_data_points = [job.fact];
            break;
        default:
            break;
    }

    const { data } = await spider.post('get_data', spiderJob);
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
