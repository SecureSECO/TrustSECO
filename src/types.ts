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
    bounty: string,
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
