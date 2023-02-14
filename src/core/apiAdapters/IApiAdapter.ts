import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";

export interface IApiAdapter {

    completions(queryProfile: IQueryProfile): Promise<IQuery>; 
    models(): Promise<any>;
    name(): string;
}