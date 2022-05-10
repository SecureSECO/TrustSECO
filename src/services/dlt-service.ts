import {apiClient} from '@liskhq/lisk-client';
import {RegisteredModule} from '@liskhq/lisk-api-client/dist-node/types';
import {APIClient} from '@liskhq/lisk-api-client';
import {Job} from "../types";

const dlt_endpoint = process.env.NODE_ENV === 'development' ? 'ws://localhost:8080/ws' : 'ws://dlt:8080/ws';
const passphrase = 'answer shrug among flat shaft virtual ceiling exit false arena type shoulder';

let clientCache: APIClient;
let registeredTransactions: { [name: string]: { moduleID: number, assetID: number } } = {};

const getClient = async () => {
    if (!clientCache) {
        clientCache = await apiClient.createWSClient(dlt_endpoint);
        await loadTransactions();
    }
    return clientCache;
}

export async function getJobs(): Promise<Job[]> {
    const client = await getClient();
    return await client.invoke('coda:getJobs');
}

export async function getRandomJob(): Promise<Job> {
    const client = await getClient();
    return await client.invoke('coda:getRandomJob');
}

export async function getTrustFacts(): Promise<any> {
    const client = await getClient();
    return await client.invoke('trustfacts:getFacts');
}

export async function addJob(job: Job): Promise<void> {
    const client = await getClient();
    const module = registeredTransactions['coda:AddJob'];
    const transaction = await client.transaction.create({
        moduleID: module.moduleID,
        assetID: module.assetID,
        fee: BigInt(1000000),
        asset: job as unknown as Record<string, unknown>
    }, passphrase);

    await client.transaction.send(transaction);
}

export async function addTrustFact(trustFact): Promise<void> {
    const client = await getClient();
    const module = registeredTransactions['trustfacts:AddFacts'];
    const transaction = await client.transaction.create({
        moduleID: module.moduleID,
        assetID: module.assetID,
        fee: BigInt(1000000),
        asset: trustFact as unknown as Record<string, unknown>
    }, passphrase);

    await client.transaction.send(transaction);
}

async function loadTransactions() {
    const client = await getClient();
    const response: RegisteredModule[] = await client.invoke('app:getRegisteredModules');

    response.forEach((module: RegisteredModule) => {
        module.transactionAssets.forEach(asset => {
            registeredTransactions[`${module.name}:${asset.name}`] = {
                moduleID: module.id,
                assetID: asset.id,
            }
        });
    });
}
