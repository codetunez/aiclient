import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";
import IImageQuery from "../entities/IImageQuery";
import IImageQueryProfile from "../entities/IImageQueryProfile";

export interface IApiAdapter {

    completions(queryProfile: IQueryProfile): Promise<IQuery>;
    completionsImages(queryProfile: IImageQueryProfile): Promise<IImageQuery>;
    models(): Promise<any>;
    name(): string;
}