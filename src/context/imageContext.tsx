import * as React from 'react';
import { OpenAIApiAdapter } from '../core/apiAdapters/OpenAIApiAdapter';
import { IApiAdapter } from '../core/apiAdapters/IApiAdapter';
import IImageQueryProfile from '../core/entities/IImageQueryProfile';
import IImageQuery from '../core/entities/IImageQuery';
import { PowerAppsApiAdapter } from '../core/apiAdapters/PowerAppsApiAdapter';

export const ImageContext = React.createContext({});

// TODO: this will be refactored as part of API Keys screen
const apiMappings = new Map();
apiMappings.set("Public Api", new OpenAIApiAdapter());
apiMappings.set("Power Apps Api", new PowerAppsApiAdapter());

export class ImageProvider extends React.PureComponent<any> {

    private defaultQueryProfile: IImageQueryProfile = { "prompt": "", "n": 1, "size": "256x256", "response_format": "url" }

    constructor(props: any) {
        super(props)
        const payload: any = localStorage.getItem("gpt_history_images");
        const apiAdapter: IApiAdapter = new OpenAIApiAdapter();

        apiAdapter.models().then(res => {
            this.newQuery({ loading: false, models: res, queryHistory: JSON.parse(payload || "[]"), apis: ["Public Api", "Power Apps Api"] });
        }).catch((err: any) => {
            this.setState({ loading: false, error: "Failed to load models. Check API key" })
        });
    }

    newQuery = (options?: any) => {

        const state = Object.assign({}, {
            currentPrompt: "",
            currentApi: "Public Api",
            currentFormat: this.defaultQueryProfile.response_format,
            currentSize: this.defaultQueryProfile.size,
            currentCount: this.defaultQueryProfile.n,
            currentQuery: {}
        },
            options || {});

        this.setState(state);
    }

    executeQuery = async () => {

        const key: string = this.state.currentApi;
        const apiAdapter: IApiAdapter = apiMappings.get(key); //new OpenAIApiAdapter();

        this.setState({ loading: true });

        // set up the initial query
        const completionRequest = Object.assign({}, this.defaultQueryProfile,
            {
                prompt: this.state.currentPrompt,
                response_format: this.state.currentFormat,
                size: this.state.currentSize,
                n: this.state.currentCount
            });

        const query = await apiAdapter.completionsImages(completionRequest);

        const newHistory = this.state.queryHistory.slice();
        newHistory.push(query);
        localStorage.setItem("gpt_history_images", JSON.stringify(newHistory));

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

    setCurrentFormat = (format: string) => {
        this.setState({ currentFormat: format });
    }

    setCurrentSize = (size: string) => {
        this.setState({ currentSize: size });
    }

    setCurrentCount = (count: string) => {
        this.setState({ currentCount: parseInt(count) });
    }

    setCurrentQuery = (query: IImageQuery) => {
        this.setState({
            currentPrompt: query.queryProfile.prompt,
            currentFormat: query.queryProfile.response_format,
            currentSize: query.queryProfile.size,
            currentCount: query.queryProfile.n,
            currentApi: query.api ?? "Public Api",
            currentQuery: Object.assign({}, query),
        });
    }

    clearHistory = () => {
        localStorage.setItem("gpt_history_images", JSON.stringify([]));

        this.setState({
            queryHistory: [],
            currentQuery: {},
            currentPrompt: "",
        })
    }

    importHistory = (data: string) => {
        localStorage.setItem("gpt_history_images", data);
        this.setState({
            queryHistory: JSON.parse(data)
        });
    }

    state: any = {
        models: [],
        apis: [],
        newQuery: this.newQuery,
        setCurrentPrompt: this.setCurrentPrompt,
        setCurrentSize: this.setCurrentSize,
        setCurrentCount: this.setCurrentCount,
        setCurrentFormat: this.setCurrentFormat,
        executeQuery: this.executeQuery,
        setCurrentQuery: this.setCurrentQuery,
        clearHistory: this.clearHistory,
        importHistory: this.importHistory,
        currentQuery: {},
        currentPrompt: "",
        currentSize: this.defaultQueryProfile.size,
        currentApi: "",
        currentFormat: this.defaultQueryProfile.response_format,
        currentCount: this.defaultQueryProfile.n,
        queryHistory: [],
        loading: true
    }

    render() {
        return (
            <ImageContext.Provider value={this.state}>
                {this.props.children}
            </ImageContext.Provider>
        )
    }
}