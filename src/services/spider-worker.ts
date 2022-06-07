/* eslint-disable no-await-in-loop */
import { parentPort } from 'worker_threads';
import { addTrustFact, getRandomJob } from './dlt-service';
import { runJob, stopSpider } from './spider-service';

let running = true;

(async () => {
    parentPort.on('message', (value) => {
        if (value.exit) {
            running = false;
        }
    });

    const loopCount = 0;

    while (running) {
        // Get job from DLT
        // Send to spider
        // Upload result to DLT

        await sleep(5000);

        const job = await getRandomJob();

        parentPort.postMessage(`job : ${job}`);
        parentPort.postMessage(`Got random job for package ${job.package}`);

        const data = await runJob(job);

        await addTrustFact(data);

        parentPort.postMessage(`Submitted data for package ${job.package}`);

        await stopSpider();

        /* parentPort.postMessage(`Got random job for package Numpy ${loopCount}`);

        await sleep(5000);

        parentPort.postMessage(`Submitted data for package Numpy ${loopCount}`);

        await sleep(20000);

        loopCount += 1; */
    }

    process.exit(0);
})();

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
