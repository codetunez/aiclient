import { IApiAdapter } from "./IApiAdapter";
import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from 'uuid';
import IQuery from "../entities/IQuery";
import IQueryProfile from "../entities/IQueryProfile";
import { OPEN_AI_KEY } from '../../config';


export class OpenAIApiAdapter implements IApiAdapter {
    private configuration: Configuration = new Configuration({ apiKey: OPEN_AI_KEY });
    private openai: OpenAIApi = new OpenAIApi(this.configuration);

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
            const res = await this.openai.createCompletion(queryProfile);
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

    async models(): Promise<any> {

        try {
            const res = await this.openai.listModels();
            return res.data.data.sort((a, b) => {
                return a.id > b.id ? 1 : -1;
            });
        }
        catch (err) {
            console.error('OpenAIApiAdapter::models', err);
            throw err;
        }
    }
    
}