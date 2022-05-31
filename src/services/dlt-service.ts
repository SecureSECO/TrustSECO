import { apiClient } from '@liskhq/lisk-client';
import { RegisteredModule } from '@liskhq/lisk-api-client/dist-node/types';
import { APIClient } from '@liskhq/lisk-api-client';
import fs from 'fs';
import { Job } from '../types';
import 'dotenv/config';

const DLT_ENDPOINT = process.env.NODE_ENV === 'development' ? 'ws://localhost:8080/ws' : 'ws://dlt:8080/ws';
const passphrase = 'answer shrug among flat shaft virtual ceiling exit false arena type shoulder';

let clientCache: APIClient;
const registeredTransactions: { [name: string]: { moduleID: number, assetID: number } } = {};

const getClient = async () => {
    if (!clientCache) {
        clientCache = await apiClient.createWSClient(DLT_ENDPOINT);
        // eslint-disable-next-line no-use-before-define
        await loadTransactions();
    }
    return clientCache;
};

export async function storeGitHubLink(link: string) {
    const toStore = {
        github_link: link,
    };

    await fs.promises.writeFile('storage.json', JSON.stringify(toStore), 'utf8');
}

export async function getGitHubLink() {
    const fileString = await fs.promises.readFile('storage.json', 'utf-8');
    const storage = JSON.parse(fileString);
    return storage.github_link;
}

export async function getJobs(): Promise<Job[]> {
    const client = await getClient();
    return client.invoke('coda:getJobs');
}

export async function getRandomJob(): Promise<Job> {
    const client = await getClient();
    return client.invoke('coda:getRandomJob');
}

export async function getTrustFacts(packageName: string): Promise<unknown> {
    const client = await getClient();
    return client.invoke('trustfacts:getPackageInfo', {
        packageName,
    });
}

export async function addJob(job: Job): Promise<void> {
    const client = await getClient();
    const module = registeredTransactions['coda:AddJob'];
    const transaction = await client.transaction.create({
        moduleID: module.moduleID,
        assetID: module.assetID,
        fee: BigInt(1000000),
        asset: job as unknown as Record<string, unknown>,
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
        asset: trustFact as unknown as Record<string, unknown>,
    }, passphrase);

    await client.transaction.send(transaction);
}

async function loadTransactions() {
    const client = await getClient();
    const response: RegisteredModule[] = await client.invoke('app:getRegisteredModules');

    response.forEach((module: RegisteredModule) => {
        module.transactionAssets.forEach((asset) => {
            registeredTransactions[`${module.name}:${asset.name}`] = {
                moduleID: module.id,
                assetID: asset.id,
            };
        });
    });
}
