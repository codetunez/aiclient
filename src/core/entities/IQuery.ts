import IQueryProfile from "./IQueryProfile";

export default interface IQuery {
    id: string;
    queryProfile: IQueryProfile;
    date: string;
    ms: number;
    result: any;
    errors: any;
    format: string;
    tokens: number;
    api: string;
}