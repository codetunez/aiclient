import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";
import { IApiAdapter } from "./IApiAdapter";
import { v4 as uuidv4 } from 'uuid';
import { Configuration, OpenAIApi } from "openai";
import { POWERAPPS_SECRET } from '../../config';
import { OpenAIApiAdapter } from "./OpenAIApiAdapter";

export class PowerAppsApiAdapter extends OpenAIApiAdapter {
    private configuration2 = new Configuration({ basePath:"https://openai-powerapps.openai.azure.com/openai/deployments/davinci",  });
    private openai2 = new OpenAIApi(this.configuration2);
   
    async completions(queryProfile: IQueryProfile): Promise<IQuery> {
        const query: IQuery = {
            id: uuidv4(),
            queryProfile,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            ms: 0,
            result: null,
            errors: null,
            format: "text",
            tokens: 0
        }

        const start = Date.now();

        try {
            const res = await this.openai2.createCompletion(queryProfile, {params:{'api-version': '2022-12-01'}, headers:{'api-key':POWERAPPS_SECRET}});
            const choice = res.data.choices[0];
            query.result = (choice.text as string).replace('\n\n', "");
            query.tokens = res.data.usage?.total_tokens ?? 0;
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
}