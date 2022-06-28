import { apiClient, transactions } from '@liskhq/lisk-client';
import { RegisteredModule } from '@liskhq/lisk-api-client/dist-node/types';
import { APIClient } from '@liskhq/lisk-api-client';
import fs from 'fs';
import {
    CodaJob, Job, RandomJobResult,
} from '../types';
import 'dotenv/config';
import { getKeys } from '../keys';
import { addToHeap } from './queue-service';

const DLT_ENDPOINT = 'ws://dlt:8080/ws';
export const getPassphrase = () => 'wat het nu is ofzo maakt me echt niet uit';

let clientCache: APIClient;
const registeredTransactions: { [name: string]: { moduleID: number, assetID: number } } = {};

export const getClient = async () => {
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

    const module = registeredTransactions['accounts:AccountsAdd'];
    const transaction = {
        moduleID: module.moduleID,
        assetID: module.assetID,
        fee: BigInt(10000000),
        asset: {
            url: link,
        },
    };

    addToHeap({
        transaction,
        name: 'AccountsAdd',
        priority: 5,
        created_at: performance.now(),
    });
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
    const { id } = await getKeys();
    console.log(id);
    const client = await getClient();
    return client.invoke('coda:getRandomJob', {
        uid: id,
    });
}

export async function getTrustFacts(packageName: string): Promise<unknown> {
    const client = await getClient();
    return client.invoke('trustfacts:getPackageFacts', {
        packageName,
    });
}

export function getModule(name: string) {
    return registeredTransactions[name];
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

export async function getAllFacts() : Promise<string[]> {
    const client = await getClient();
    const facts: any[] = await client.invoke('coda:getAllFacts');
    return facts.flatMap((o) => o.facts);
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

export async function encodeFact(data) : Promise<string> {
    const client = await getClient();
    return client.invoke('trustfacts:encodeTrustFact', data);
}

export async function getMinimumBounty() : Promise<string> {
    const client = await getClient();
    return client.invoke('coda:getMinimumRequiredBounty');
}

export async function getTrustScore(packageName, version) : Promise<number> {
    const client = await getClient();
    return client.invoke('trustfacts:calculateTrustScore', {
        packageName,
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

export async function runTransaction(transaction: Record<string, unknown>) {
    const client = await getClient();
    await client.transaction.send(transaction);
}

export async function getMinFee(transaction) {
    const client = await getClient();
    // eslint-disable-next-line no-param-reassign
    transaction.fee = BigInt(transactions.convertLSKToBeddows('1'));
    const signedTxWithSomeFee = await client.transaction.create(transaction, getPassphrase());
    return client.transaction.computeMinFee(signedTxWithSomeFee);
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

/* This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences) */