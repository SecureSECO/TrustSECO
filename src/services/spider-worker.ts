/* eslint-disable no-await-in-loop,no-continue */
import { parentPort } from 'worker_threads';
import {
    addTrustFact, encodeFact, getRandomJob,
} from './dlt-service';
import { runJob, stopSpider } from './spider-service';
import { getKeys, signMessage } from '../keys';
import spider from '../api/spider';

let running = true;

(async () => {
    parentPort.on('message', (value) => {
        if (value.exit) {
            running = false;
        }
    });

    while (running) {
        const job = await getRandomJob();

        if (job.packageName === undefined) {
            parentPort.postMessage('Currently no jobs available, waiting 30 seconds.');
            await sleep(30 * 1000);
            continue;
        }

        parentPort.postMessage(`Got random job for package ${job.packageName} with fact ${job.fact}`);

        const spiderResult = await runJob(job);

        const keys = await getKeys();

        const data = {
            jobID: job.jobID,
            factData: JSON.stringify(spiderResult),
        };

        const encoded = await encodeFact(data);

        const signature = await signMessage(encoded, keys.id);

        await addTrustFact({
            data,
            signature,
        });

        parentPort.postMessage(`Submitted data for package ${job.packageName}`);
    }

    process.exit(0);
})();

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
