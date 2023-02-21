import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";
import IImageQuery from "../entities/IImageQuery";
import IImageQueryProfile from "../entities/IImageQueryProfile";

export interface IApiAdapter {
    completions(queryProfile: IQueryProfile, apiKey: string, modelUrl: string): Promise<IQuery>;
    completionsImages(queryProfile: IImageQueryProfile, apiKey: string, modelUrl: string): Promise<IImageQuery>;
    models(apiKey: string, modelUrl: string): Promise<any>;
}