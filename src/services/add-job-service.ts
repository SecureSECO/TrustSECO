/* eslint-disable no-await-in-loop */
import { passphrase } from '@liskhq/lisk-client';
import {
    encodeJob,
    getAllFacts,
    getClient,
    getMinimumBounty,
    getModule,
    getPackageData,
    getPassphrase,
} from './dlt-service';
import { CodaJob, PackageData } from '../types';
import { getKeys, signMessage } from '../keys';
import { addToHeap } from './queue-service';

// @ts-ignore
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
    return this.toString();
};

export default async function addAllJobs(packageData: PackageData) {
    const packageModule = getModule('packagedata:AddPackageData');
    const packageTransaction = {
        moduleID: packageModule.moduleID,
        assetID: packageModule.assetID,
        fee: BigInt(1000000),
        asset: packageData as unknown as Record<string, unknown>,
    };

    addToHeap({
        name: 'AddPackage',
        created_at: performance.now(),
        priority: 10,
        transaction: packageTransaction,
    });

    const facts = await getAllFacts();

    for (let j = 0; j < packageData.packageReleases.length; j += 1) {
        const version = packageData.packageReleases[j];

        for (let i = 0; i < facts.length; i += 1) {
            const fact = facts[i];
            console.log(`Adding for version:${version} with fact:${fact}`);

            const bounty = await getMinimumBounty();

            const data: CodaJob = {
                package: packageData.packageName,
                version,
                fact,
                bounty: BigInt(bounty),
            };

            const encoded = await encodeJob(data);

            const keys = await getKeys();

            const signature = await signMessage(encoded, keys.id);

            const job = {
                data,
                signature,
            };

            const module = getModule('coda:AddJob');
            const transaction = {
                moduleID: module.moduleID,
                assetID: module.assetID,
                fee: BigInt(10000000),
                asset: job as unknown as Record<string, unknown>,
            };

            addToHeap({
                name: 'AddJob',
                created_at: performance.now(),
                priority: 100,
                transaction,
            });
        }
    }
}

/* This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences) */