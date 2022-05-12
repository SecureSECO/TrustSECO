/* eslint-disable no-await-in-loop */
import { parentPort } from 'worker_threads';
import { addTrustFact, getRandomJob } from './dlt-service';
import { runJob } from './spider-service';

let active = false;

parentPort.on('message', (message) => {
    switch (message) {
        case 'start':
            startSpider();
            break;
        case 'stop':
            stopSpider();
            break;
        default:
            break;
    }
});

async function startSpider() {
    active = true;
    while (active) {
        // Get job from DLT
        // Send to spider
        // Upload result to DLT
        const job = await getRandomJob();

        parentPort.postMessage(`Got random job for package ${job.package}`);

        const data = await runJob(job);

        await addTrustFact(data);

        parentPort.postMessage(`Submitted data for package ${job.package}`);
    }
}

function stopSpider() {
    active = false;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
