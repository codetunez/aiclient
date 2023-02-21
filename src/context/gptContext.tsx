import * as React from 'react';

import { IApiAdapter } from '../core/apiAdapters/IApiAdapter';
import IQueryProfile from '../core/entities/IQueryProfile';
import IQuery from '../core/entities/IQuery';

export const GptContext = React.createContext({});

export class GptProvider extends React.PureComponent<any> {

    private defaultQueryProfile: IQueryProfile = { "prompt": "", "model": "text-davinci-003", "temperature": 0, "max_tokens": 512 }

    constructor(props: any) {
        super(props)
        const payload: any = localStorage.getItem("gpt_history");
        this.state = Object.assign({}, this.state, { loading: false, queryHistory: JSON.parse(payload || "[]") });
    }

    newQuery = (options?: any) => {
        const state = Object.assign({}, {
            currentPrompt: "",
            currentFormat: "text",
            currentModel: this.defaultQueryProfile.model,
            currentTemperature: this.defaultQueryProfile.temperature,
            currentMaxTokens: this.defaultQueryProfile.max_tokens,
            currentQuery: {}
        },
            options || {});

        this.setState(state);
    }

    fetchModels = async (apiAdapter: IApiAdapter, key: string, modelUrl: string) => {
        this.setState({ loading: true });

        apiAdapter.models(key, modelUrl).then(res => {
            this.setState({ loading: false, models: res });
        }).catch((err: any) => {
            this.setState({ loading: false, error: "Failed to load models. Check API profile" })
        });
    }

    executeQuery = async (apiAdapter: IApiAdapter, key: string, modelUrl: string) => {
        this.setState({ loading: true });

        const completionRequest = Object.assign({}, this.defaultQueryProfile,
            {
                prompt: this.state.currentPrompt,
                model: this.state.currentModel,
                temperature: this.state.currentTemperature,
                max_tokens: this.state.currentMaxTokens
            });

        const query = await apiAdapter.completions(completionRequest, key, modelUrl);

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

    setError = (message: string) => {
        this.setState({ error: message, loading: false });
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
        newQuery: this.newQuery,
        setCurrentPrompt: this.setCurrentPrompt,
        setCurrentModel: this.setCurrentModel,
        setCurrentTemperature: this.setCurrentTemperature,
        setMaxTokens: this.setMaxTokens,
        setError: this.setError,
        setCurrentFormat: this.setCurrentFormat,
        executeQuery: this.executeQuery,
        setCurrentQuery: this.setCurrentQuery,
        clearHistory: this.clearHistory,
        importHistory: this.importHistory,
        fetchModels: this.fetchModels,
        currentQuery: {},
        currentPrompt: "",
        currentModel: this.defaultQueryProfile.model,
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