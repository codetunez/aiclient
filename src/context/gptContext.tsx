import * as React from 'react';
import { OpenAIApiAdapter } from '../core/apiAdapters/OpenAIApiAdapter';
import { IApiAdapter } from '../core/apiAdapters/IApiAdapter';
import IQueryProfile from '../core/entities/IQueryProfile';
import IQuery from '../core/entities/IQuery';
import { PowerAppsApiAdapter } from '../core/apiAdapters/PowerAppsApiAdapter';

export const GptContext = React.createContext({});

const apiMappings = new Map();
apiMappings.set("Public Api", new OpenAIApiAdapter());
apiMappings.set("Power Apps Api", new PowerAppsApiAdapter());

export class GptProvider extends React.PureComponent<any> {

    private defaultQueryProfile: IQueryProfile = { "prompt": "", "model": "text-davinci-003", "temperature": 0, "max_tokens": 2048 }

    constructor(props: any) {
        super(props)
        const payload: any = localStorage.getItem("gpt_history");
        const apiAdapter: IApiAdapter = new OpenAIApiAdapter();

        apiAdapter.models().then(res => {
            this.setState({ currentModel: this.defaultQueryProfile.model, loading: false, models: res, queryHistory: JSON.parse(payload || "[]"), apis: ["Public Api", "Power Apps Api"], currentApi: "Public Api" });
        }).catch((err: any) => {
            this.setState({ loading: false, error: "failed to load models. check API key" })
        });
    }

    newQuery = () => {
        this.setState({
            currentPrompt: "",
            currentModel: this.defaultQueryProfile.model,
            currentApi: "Public Api",
            currentFormat: "text",
            currentTemperature: this.defaultQueryProfile.temperature,
            currentMaxTokens: this.defaultQueryProfile.max_tokens,
            currentQuery: {}
        });
    }

    executeQuery = async () => {

        const key: string = this.state.currentApi;
        const apiAdapter: IApiAdapter = apiMappings.get(key); //new OpenAIApiAdapter();

        this.setState({ loading: true });

        // set up the initial query
        const completionRequest = Object.assign({}, this.defaultQueryProfile,
            {
                prompt: this.state.currentPrompt,
                model: this.state.currentModel,
                temperature: this.state.currentTemperature,
                max_tokens: this.state.currentMaxTokens
            });

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

    setCurrentTemperature = (temperature: string) => {
        this.setState({ currentTemperature: parseFloat(temperature) });
    }

    setMaxTokens = (maxTokens: string) => {
        this.setState({ currentMaxTokens: parseInt(maxTokens) });
    }

    setCurrentApi = (api: string) => {
        this.setState({ currentApi: api });
    }

    setCurrentFormat = (format: string) => {

        const q = this.state.currentQuery;
        const index = this.state.queryHistory.findIndex((x: IQuery) => x.id === q.id) /* not server safe */
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

    setCurrentQuery = (query: IQuery) => {
        this.setState({
            currentPrompt: query.queryProfile.prompt,
            currentModel: query.queryProfile.model,
            currentFormat: query.format,
            currentApi: query.api ?? "Public Api",
            currentQuery: Object.assign({}, query),
        });
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
        apis: [],
        newQuery: this.newQuery,
        setCurrentPrompt: this.setCurrentPrompt,
        setCurrentModel: this.setCurrentModel,
        setCurrentTemperature: this.setCurrentTemperature,
        setMaxTokens: this.setMaxTokens,
        setCurrentApi: this.setCurrentApi,
        setCurrentFormat: this.setCurrentFormat,
        executeQuery: this.executeQuery,
        setCurrentQuery: this.setCurrentQuery,
        clearHistory: this.clearHistory,
        importHistory: this.importHistory,
        currentQuery: {},
        currentPrompt: "",
        currentModel: this.defaultQueryProfile.model,
        currentApi: "",
        currentFormat: "text",
        currentTemperature: this.defaultQueryProfile.temperature,
        currentMaxTokens: this.defaultQueryProfile.max_tokens,
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