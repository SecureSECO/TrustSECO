export interface Job {
    package: string,
    source: string,
    fact: string,
}

export interface Tokens {
    github_token?: string,
    libraries_token?: string
}

export interface Keys {
    publicKey: string,
    privateKey: string
}
