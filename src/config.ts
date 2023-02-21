export const OPEN_AI_KEY = "";

export const AZURE: string = "azure";
export const OPENAI: string = "openai";

export interface ApiKey {
    default: true | false,
    name: string,
    key: string,
    service: typeof AZURE | typeof OPENAI,
    instance: string | null
}

/* To configure ApiKeys in code follow instructions in README.md */

export const ApiKeys: Array<ApiKey> = []