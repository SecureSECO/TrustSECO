import { apiClient } from '@liskhq/lisk-client';
import { RegisteredModule } from '@liskhq/lisk-api-client/dist-node/types';
import { APIClient } from '@liskhq/lisk-api-client';
import fs from 'fs';
import {
    CodaJob, Job, PackageData, RandomJobResult,
} from '../types';
import 'dotenv/config';
import { getKeys } from '../keys';

const DLT_ENDPOINT = 'ws://dlt:8080/ws';
const passphrase = 'clinic dial armor leopard card cake letter matter planet erosion primary march';

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
    await registerAccount(link);
}

export async function getGitHubLink() {
    if (!fs.existsSync('storage.json')) {
        return '';
    }

    const fileString = await fs.promises.readFile('storage.json', 'utf-8');
    const storage = JSON.parse(fileString);
    return storage.github_link;
}

export async function getJobs(): Promise<Job[]> {
    const client = await getClient();
    return client.invoke('coda:getJobs');
}

export async function getRandomJob(): Promise<RandomJobResult> {
    const client = await getClient();
    return client.invoke('coda:getRandomJob');
}

export async function getTrustFacts(packageName: string): Promise<unknown> {
    const client = await getClient();
    return client.invoke('trustfacts:getPackageFacts', {
        packageName,
    });
}

export async function addJob(job): Promise<void> {
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

export async function getPackageData(packageName): Promise<string> {
    const client = await getClient();
    return client.invoke('packagedata:getPackageInfo', {
        packageName,
    });
}

export async function getPackagesData(): Promise<any> {
    const client = await getClient();
    return client.invoke('packagedata:getAllPackages');
}

export async function addPackageData(packageData: PackageData) : Promise<void> {
    const client = await getClient();
    const module = registeredTransactions['packagedata:AddPackageData'];
    const transaction = await client.transaction.create({
        moduleID: module.moduleID,
        assetID: module.assetID,
        fee: BigInt(1000000),
        asset: packageData as unknown as Record<string, unknown>,
    }, passphrase);

    await client.transaction.send(transaction);
}

export async function getAllFacts() : Promise<string[]> {
    const client = await getClient();
    return client.invoke('coda:listAllFacts');
}

export async function getMetrics() {
    const { packages } = await getPackagesData();
    const packageCount = packages.length;

    const client = await getClient();
    const nodeInfo = await client.node.getNodeInfo();
    const blockHeight = nodeInfo.height;

    const info = await client.node.getNetworkStats();
    const peerInfo = {
        connected: info.totalConnectedPeers,
        disconnected: info.totalDisconnectedPeers,
        banned: info.banning.count,
    };

    return {
        package_count: packageCount,
        block_height: blockHeight,
        peer_info: peerInfo,
    };
}

export async function encodeJob(codaJob: CodaJob) : Promise<string> {
    const client = await getClient();
    return client.invoke('coda:encodeCodaJob', {
        ...codaJob,
    });
}

export async function encodeFact(factData, jobID) : Promise<string> {
    const client = await getClient();
    return client.invoke('coda:encodeCodaJob', {
        factData: JSON.stringify(factData),
        jobID,
    });
}

export async function getMinimumBounty() : Promise<bigint> {
    const client = await getClient();
    return client.invoke('coda:getMinimumRequiredBounty');
}

export async function registerAccount(githubUrl) {
    const client = await getClient();
    const module = registeredTransactions['accounts:AccountsAdd'];
    const transaction = await client.transaction.create({
        moduleID: module.moduleID,
        assetID: module.assetID,
        fee: BigInt(1000000),
        asset: {
            url: githubUrl,
        },
    }, passphrase);

    await client.transaction.send(transaction);
}

export async function getTrustScore(id, version) : Promise<number> {
    const client = await getClient();
    return client.invoke('trustfacts:getScore', {
        id,
        version,
    });
}

export async function getAccount() : Promise<any> {
    const { id } = await getKeys();
    const client = await getClient();
    return client.invoke('accounts:getAccount', {
        uid: id,
    });
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
