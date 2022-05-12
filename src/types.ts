export interface Job {
    package: string,
    source: string,
    fact: string,
}

export interface Tokens {
    github_token?: string,
    libraries_io_token?: string
}
