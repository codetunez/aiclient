export const AZURE: string = "azure";
export const OPENAI: string = "openai";

export interface ApiKey {
    default: true | false,
    name: string,
    key: string,
    service: typeof AZURE | typeof OPENAI
}

/* Sample configuration object
    {
         default: true,
         name: "Open AI #1",
         key: "sk-7fh398fhd959dl295kf34kfzdsjfk32jfk25ddnndf445344",
         service: OPENAI
    }
*/

export const ApiKeys: Array<ApiKey> = []
