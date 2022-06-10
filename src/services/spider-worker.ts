/* eslint-disable no-await-in-loop */
import { parentPort } from 'worker_threads';
import { addTrustFact, encode, getRandomJob } from './dlt-service';
import { runJob, stopSpider } from './spider-service';
import { getKeys, signMessage } from '../setup';

let running = true;

(async () => {
    parentPort.on('message', (value) => {
        if (value.exit) {
            running = false;
        }
    });

    while (running) {
        const job = await getRandomJob();

        parentPort.postMessage(`Got random job for package ${job.packageName} with fact ${job.fact}`);

        const spiderResult = await runJob(job);

        const keys = await getKeys();

        const data = {
            jobID: job.jobID,
            factData: JSON.stringify(spiderResult),
        };

        const encoded = await encode(data, job.jobID);

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
