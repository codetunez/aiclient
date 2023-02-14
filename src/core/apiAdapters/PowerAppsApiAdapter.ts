import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";
import { IApiAdapter } from "./IApiAdapter";

export class PowerAppsApiAdapter implements IApiAdapter {
    completions(queryProfile: IQueryProfile): Promise<IQuery> {
        throw new Error("Method not implemented.");
    }
    models(): Promise<any> {
        throw new Error("Method not implemented.");
    }
   
}