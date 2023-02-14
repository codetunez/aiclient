import * as React from 'react';
import { OpenAIApiAdapter } from '../core/apiAdapters/OpenAIApiAdapter';
import { IApiAdapter } from '../core/apiAdapters/IApiAdapter';

export const GptContext = React.createContext({});

interface QueryProfile {
    model: string,
    prompt: string,
    temperature: number,
    max_tokens: number
}

export interface Query {
    id: string;
    queryProfile: QueryProfile;
    date: string;
    ms: number;
    result: any;
    errors: any;
    format: string;
    tokens: number;
}

export class GptProvider extends React.PureComponent<any> {

    private defaultQueryProfile: QueryProfile = { "prompt": "", "model": "text-davinci-003", "temperature": 0, "max_tokens": 1000 }
    
    constructor(props: any) {
        super(props)
        const payload: any = localStorage.getItem("gpt_history");
        const apiAdapter: IApiAdapter = new OpenAIApiAdapter();

        apiAdapter.models().then(res => {
            this.setState({ currentModel: "text-davinci-003", loading: false, models: res, queryHistory: JSON.parse(payload || "[]") });
        }).catch((err: any) => {
            this.setState({ loading: false, error: "failed to load models. check API key" })
        });
    }

    newQuery = () => {
        this.setState({
            currentPrompt: "",
            currentModel: "text-davinci-003",
            currentFormat: "text",
            currentQuery: {}
        });
    }

    executeQuery = async () => {

        const apiAdapter: IApiAdapter = new OpenAIApiAdapter();

        this.setState({ loading: true });

        // set up the initial query
        const completionRequest = Object.assign({}, this.defaultQueryProfile, { prompt: this.state.currentPrompt }, { model: this.state.currentModel });
        
        const query = await apiAdapter.completions(completionRequest);

        const newHistory = this.state.queryHistory.slice();
        newHistory.push(query);
        localStorage.setItem("gpt_history", JSON.stringify(newHistory));

        const index = newHistory.length - 1;
        this.setState({
            queryHistory: newHistory,
            currentQuery: Object.assign({}, newHistory[index]),
            loading: false
        })
    }

    setCurrentPrompt = (prompt: string) => {
        this.setState({ currentPrompt: prompt });
    }

    setCurrentModel = (model: string) => {
        this.setState({ currentModel: model });
    }

    setCurrentFormat = (format: string) => {

        const q = this.state.currentQuery;
        const index = this.state.queryHistory.findIndex((x: Query) => x.id === q.id) /* not server safe */
        if (index === -1) { this.setState({ currentFormat: format }); return; }

        const newHistory = this.state.queryHistory.slice();
        newHistory[index].format = format;
        localStorage.setItem("gpt_history", JSON.stringify(newHistory));

        this.setState({
            queryHistory: newHistory,
            currentQuery: Object.assign({}, newHistory[index]),
            currentFormat: format
        })
    }

    setCurrentQuery = (query: Query) => {
        this.setState({
            currentPrompt: query.queryProfile.prompt,
            currentModel: query.queryProfile.model,
            currentFormat: query.format,
            currentQuery: Object.assign({}, query)
        });
    }

    setQueryProfile(model: string, temperature: number, maxTokens: number) {
        this.defaultQueryProfile.model = model;
        this.defaultQueryProfile.temperature = temperature;
        this.defaultQueryProfile.max_tokens = maxTokens;
    }

    clearHistory = () => {
        localStorage.setItem("gpt_history", JSON.stringify([]));

        this.setState({
            queryHistory: [],
            currentQuery: {},
            currentPrompt: "",
        })
    }

    importHistory = (data: string) => {
        localStorage.setItem("gpt_history", data);
        this.setState({
            queryHistory: JSON.parse(data)
        });
    }

    state: any = {
        models: [],
        newQuery: this.newQuery,
        setCurrentPrompt: this.setCurrentPrompt,
        setCurrentModel: this.setCurrentModel,
        setCurrentFormat: this.setCurrentFormat,
        executeQuery: this.executeQuery,
        setCurrentQuery: this.setCurrentQuery,
        clearHistory: this.clearHistory,
        importHistory: this.importHistory,
        currentQuery: {},
        currentPrompt: "",
        currentModel: "",
        currentFormat: "text",
        queryHistory: [],
        loading: true
    }

    render() {
        return (
            <GptContext.Provider value={this.state}>
                {this.props.children}
            </GptContext.Provider>
        )
    }
}