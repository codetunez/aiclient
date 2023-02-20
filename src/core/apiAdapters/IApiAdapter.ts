import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";
import IImageQuery from "../entities/IImageQuery";
import IImageQueryProfile from "../entities/IImageQueryProfile";

export interface IApiAdapter {
    completions(queryProfile: IQueryProfile, apiKey: string): Promise<IQuery>;
    completionsImages(queryProfile: IImageQueryProfile, apiKey: string): Promise<IImageQuery>;
    models(apiKey: string): Promise<any>;
}