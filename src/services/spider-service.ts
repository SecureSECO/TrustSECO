/* eslint-disable no-await-in-loop */
import axios from 'axios';
import {
    Job, RandomJobResult, SpiderJob, Tokens,
} from '../types';
import { encodeFact, getModule, getRandomJob } from './dlt-service';
import { getKeys } from '../keys';
import { addToHeap } from './queue-service';

const SPIDER_ENDPOINT = 'http://spider:5000/';
const spider = axios.create({
    baseURL: SPIDER_ENDPOINT,
});

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

let running = false;

export async function startSpider() {
    running = true;
    while (running) {
        const job = await getRandomJob();

        if (job.packageName === undefined) {
            await sleep(30 * 1000);
            // eslint-disable-next-line no-continue
            continue;
        }

        const spiderResult = await runJob(job);

        const dataPoint = spiderResult[job.fact];

        const keys = await getKeys();

        const data = {
            jobID: job.jobID,
            factData: JSON.stringify(dataPoint),
        };

        const encoded = await encodeFact(data);

        const trustFact = {
            data,
            signature: '--',
        };

        // const signature = await signMessage(encoded, keys.id);

        const module = getModule('trustfacts:AddFacts');
        const transaction = {
            moduleID: module.moduleID,
            assetID: module.assetID,
            fee: BigInt(100000000),
            asset: trustFact as unknown as Record<string, unknown>,
        };

        addToHeap({
            transaction,
            created_at: performance.now(),
            priority: 200,
        });

        await sleep(1200000);
    }
}

export function stopSpider() {
    running = false;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function isRunning(): boolean {
    return running;
}
