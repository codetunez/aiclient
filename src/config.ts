export const AZURE: string = "azure";
export const OPENAI: string = "openai";

export interface ApiKey {
    default: true | false,
    name: string,
    key: string,
    service: typeof AZURE | typeof OPENAI,
    modelUrl: string | null
}

/* To configure ApiKeys in code follow instructions in README.md */

export const ApiKeys: Array<ApiKey> = []