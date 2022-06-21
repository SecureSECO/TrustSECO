// three Priority queueu met comparer type van transactie, trustfacts voorrang en tijd
import Heap from 'heap-js';
import Emitter from 'node:events';
import { QueueTransaction } from '../types';
import {
    getClient, getMinFee, getPassphrase, runTransaction,
} from './dlt-service';

const heap = new Heap<QueueTransaction>(comparator);
const emitter = new Emitter();

export function addToHeap(transaction: QueueTransaction) {
    heap.add(transaction);
    emitter.emit('pushed', heap.size());
}

export function getEmitter() {
    return emitter;
}

export function getHeapSize() {
    return heap.size();
}

export async function startQueue() {
    const client = await getClient();

    client.subscribe('app:block:new', async (event) => {
        if (heap.isEmpty()) {
            return;
        }

        const queueTransaction = heap.pop();

        console.log(`Running transaction: ${queueTransaction.name}`);

        try {
            // @ts-ignore
            const minFee = getMinFee(queueTransaction.transaction);
            queueTransaction.transaction.fee = minFee;
            // @ts-ignore
            const transaction = await client.transaction.create(queueTransaction.transaction, getPassphrase());
            await runTransaction(transaction);
        } catch (e) {
            console.log('Encountered error, adding to back of queue');
            heap.add(queueTransaction);
        }
    });
}

function comparator(a: QueueTransaction, b: QueueTransaction) {
    const now = performance.now();
    const sinceA = a.created_at - now;
    const sinceB = b.created_at - now;

    return (a.priority + sinceA) - (b.priority + sinceB);
}
