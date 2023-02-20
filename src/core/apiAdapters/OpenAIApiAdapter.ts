import { IApiAdapter } from "./IApiAdapter";
import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from 'uuid';
import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";
import { estimateCost, estimateImageCost } from "../entities/costGenerator";
import IImageQuery from "../entities/IImageQuery";
import IImageQueryProfile from "../entities/IImageQueryProfile";
import { OPENAI } from "../../config";

export class OpenAIApiAdapter implements IApiAdapter {

    async completions(queryProfile: IQueryProfile, key: string): Promise<IQuery> {

        const configuration: Configuration = new Configuration({ apiKey: key });
        const openai: OpenAIApi = new OpenAIApi(configuration);

        const query: IQuery = {
            id: uuidv4(),
            queryProfile,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            ms: 0,
            result: null,
            errors: null,
            format: "text",
            tokens: 0,
            cost: 0,
            api: OPENAI
        }

        const start = Date.now();

        try {
            const res = await openai.createCompletion(queryProfile);
            const choice = res.data.choices[0];
            query.result = (choice.text as string).replace('\n\n', "");
            query.tokens = res.data.usage?.total_tokens ?? 0;
            query.cost = estimateCost(query.tokens, res.data.model);
        }
        catch (err) {
            console.error('OpenAIApiAdapter::completions', err);
            query.errors = err;
        }
        finally {
            query.ms = Date.now() - start;
        }

        return query;
    }

    async models(key: string): Promise<any> {
        const configuration: Configuration = new Configuration({ apiKey: key });
        const openai: OpenAIApi = new OpenAIApi(configuration);

        try {
            const res = await openai.listModels();
            return res.data.data.sort((a, b) => {
                return a.id > b.id ? 1 : -1;
            });
        }
        catch (err) {
            console.error('OpenAIApiAdapter::models', err);
            throw err;
        }
    }

    async completionsImages(queryProfile: IImageQueryProfile, key: string): Promise<IImageQuery> {

        const configuration: Configuration = new Configuration({ apiKey: key });
        const openai: OpenAIApi = new OpenAIApi(configuration);

        const query: IImageQuery = {
            id: uuidv4(),
            queryProfile,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            ms: 0,
            result: [],
            errors: null,
            cost: 0,
            api: OPENAI
        }

        const start = Date.now();

        try {
            const res: any = await openai.createImage(queryProfile);
            query.result = res.data.data;
            query.cost = estimateImageCost(query.queryProfile.size, query.queryProfile.n);
        }
        catch (err) {
            console.error('OpenAIApiAdapter::completionsImage', err);
            query.errors = err;
        }
        finally {
            query.ms = Date.now() - start;
        }

        return query;
    }
}