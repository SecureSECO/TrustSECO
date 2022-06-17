/* eslint-disable no-await-in-loop */
import {
    addJob, addPackageData, encodeJob, getAllFacts, getMinimumBounty,
} from './dlt-service';
import { CodaJob, PackageData } from '../types';
import { getKeys, signMessage } from '../keys';

export default async function addAllJobs(packageData: PackageData) {
    await addPackageData(packageData);

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
                bounty: '1000',
            };

            const encoded = await encodeJob(data);

            const keys = await getKeys();

            const signature = await signMessage(encoded, keys.id);

            await addJob({
                data,
                signature,
            });
        }
    }
}
