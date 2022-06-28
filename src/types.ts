import { Transaction } from '@liskhq/lisk-api-client/dist-node/transaction';

export interface Job {
    packageName: string,
    packagePlatform: string,
    packageOwner: string,
    packageRelease: string,
    fact: string,
    jobID: string,
}

export interface PackageData {
    packageName: string,
    packagePlatform: string,
    packageOwner: string,
    packageReleases: string[],
}

export interface CodaJob {
    package: string,
    version: string,
    fact: string,
    bounty: bigint,
}

export interface RandomJobResult {
    package: string,
    version: string,
    fact: string,
    date: string,
    jobID: string,
    bounty: string,
    account: {
        uid: string,
    },
    packageName: string,
    packagePlatform: string,
    packageOwner: string,
    packageReleases: string[],
}

export interface SpiderJob {
    project_info: {
        project_platform: string,
        project_owner: string,
        project_name: string,
        project_release: string,
    },
    cve_data_points?: string[],
    so_data_points?: string[],
    lib_data_points?: string[],
    gh_data_points?: string[],
}

export interface Tokens {
    github_token?: string,
    libraries_token?: string
}

export interface Keys {
    id: string,
    publicKey: string,
    privateKey: string
}

export interface QueueTransaction {
    name?: string,
    priority: number,
    created_at: number,
    transaction: Record<string, unknown>
}

/* This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences) */