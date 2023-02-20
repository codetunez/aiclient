import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";
import { v4 as uuidv4 } from 'uuid';
import { Configuration, OpenAIApi } from "openai";
import { POWERAPPS_SECRET } from '../../config';
import { OpenAIApiAdapter } from "./OpenAIApiAdapter";
import { estimateCost, estimateImageCost } from "../entities/costGenerator";
import IImageQuery from "../entities/IImageQuery";
import IImageQueryProfile from "../entities/IImageQueryProfile";

export class PowerAppsApiAdapter extends OpenAIApiAdapter {
    private configuration2 = new Configuration({ basePath:"https://openai-powerapps.openai.azure.com/openai/deployments/davinci",  });
    private openai2 = new OpenAIApi(this.configuration2);

    name(): string {
        return "Power Apps Api";
    }

    async completions(queryProfile: IQueryProfile): Promise<IQuery> {
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
            api: this.name()
        }

        const start = Date.now();

        try {
            const res = await this.openai2.createCompletion(queryProfile, {params:{'api-version': '2022-12-01'}, headers:{'api-key':POWERAPPS_SECRET}});
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

    async completionsImages(queryProfile: IImageQueryProfile): Promise<IImageQuery> {
        const query: IImageQuery = {
            id: uuidv4(),
            queryProfile,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            ms: 0,
            result: [],
            errors: null,
            cost: 0,
            api: this.name()
        }

        const start = Date.now();

        try {
            const res = await this.openai2.createImage(queryProfile, { params: { 'api-version': '2022-12-01' }, headers: { 'api-key': POWERAPPS_SECRET } });
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