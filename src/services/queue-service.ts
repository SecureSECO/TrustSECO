import Heap from 'heap-js';
import Emitter from 'node:events';
import { QueueTransaction } from '../types';
import {
    getAccount,
    getClient, getMinFee, getPassphrase, runTransaction,
} from './dlt-service';

const heap = new Heap<QueueTransaction>(comparator);
const emitter = new Emitter();

export function addToHeap(transaction: QueueTransaction) {
    heap.add(transaction);
    emitter.emit('pushed', heap.size());
}

export function getQueueEmitter() {
    return emitter;
}

export function getHeapSize() {
    return heap.size();
}

export function clearQueue() {
    heap.clear();
}

export async function startQueue() {
    const client = await getClient();

    client.subscribe('app:block:new', async (event) => {
        await consumeFromHeap(client);
    });
}

async function consumeFromHeap(client) {
    if (heap.isEmpty()) {
        return;
    }

    const queueTransaction = heap.pop();

    console.log(`Running transaction: ${queueTransaction.name}`);

    try {
        // @ts-ignore
        const bounty = queueTransaction.transaction.asset?.bounty;
        const { slingers } = await getAccount();

        if (bounty > slingers) {
            console.log('Not enough tokens to run this transaction, skipping...');
            await consumeFromHeap(client);
            return;
        }

        const minFee = await getMinFee(queueTransaction.transaction);
        queueTransaction.transaction.fee = minFee;
        const transaction = await client.transaction.create(queueTransaction.transaction, getPassphrase());
        await runTransaction(transaction);
    } catch (e) {
        console.log('Encountered error, if you believe this was a mistake, please run task again.');
    }
}

function comparator(a: QueueTransaction, b: QueueTransaction) {
    const now = performance.now();
    const sinceA = a.created_at - now;
    const sinceB = b.created_at - now;

    return (a.priority + sinceA) - (b.priority + sinceB);
}

/* This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences) */