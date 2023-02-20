import IImageQueryProfile from "./IImageQueryProfile";

export default interface IImageQuery {
    id: string;
    queryProfile: IImageQueryProfile;
    date: string;
    ms: number;
    result: Array<any>;
    errors: any;
    cost: number | string;
    api: string;
}