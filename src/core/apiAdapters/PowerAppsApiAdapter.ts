import { IApiAdapter } from "./IApiAdapter";
import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";
import { v4 as uuidv4 } from 'uuid';
import { Configuration, OpenAIApi } from "openai";
import { estimateCost, estimateImageCost } from "../entities/costGenerator";
import IImageQuery from "../entities/IImageQuery";
import IImageQueryProfile from "../entities/IImageQueryProfile";
import { AZURE } from "../../config";

export class PowerAppsApiAdapter implements IApiAdapter {

    async completions(queryProfile: IQueryProfile, key: string, modelUrl: string): Promise<IQuery> {

        const configuration = new Configuration({ basePath: modelUrl });
        const openai = new OpenAIApi(configuration);

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
            api: AZURE
        }

        const start = Date.now();

        try {
            const res = await openai.createCompletion(queryProfile, { params: { 'api-version': '2022-12-01' }, headers: { 'api-key': key } });
            const choice = res.data.choices[0];
            query.result = (choice.text as string).replace('\n\n', "");
            query.tokens = res.data.usage?.total_tokens ?? 0;
            query.cost = estimateCost(query.tokens, res.data.model);
        }
        catch (err) {
            console.error('PowerAppsApiAdapter::completions', err);
            query.errors = err;
        }
        finally {
            query.ms = Date.now() - start;
        }

        return query;
    }

    async models(key: string, modelUrl: string): Promise<any> {
        console.log('Azure requests are model based. No models to load')
    }

    async completionsImages(queryProfile: IImageQueryProfile, key: string, modelUrl: string): Promise<IImageQuery> {

        const configuration = new Configuration({ basePath: modelUrl});
        const openai = new OpenAIApi(configuration);

        const query: IImageQuery = {
            id: uuidv4(),
            queryProfile,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            ms: 0,
            result: [],
            errors: null,
            cost: 0,
            api: AZURE
        }

        const start = Date.now();

        try {
            const res = await openai.createImage(queryProfile, { params: { 'api-version': '2022-12-01' }, headers: { 'api-key': key } });
            query.result = res.data.data;
            query.cost = estimateImageCost(query.queryProfile.size, query.queryProfile.n);
        }
        catch (err) {
            console.error('PowerAppsApiAdapter::completionsImage', err);
            query.errors = err;
        }
        finally {
            query.ms = Date.now() - start;
        }

        return query;
    }
}