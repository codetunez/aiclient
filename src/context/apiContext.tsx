import * as React from 'react';

import { ApiKey, ApiKeys, AZURE, OPENAI } from '../config';

export const ApiContext = React.createContext({});

export class ApiProvider extends React.PureComponent<any> {

    constructor(props: any) {
        super(props)
        const payload: any = localStorage.getItem("gpt_apis");
        const items: Array<ApiKey> = JSON.parse(payload || "[]");

        for (const index in ApiKeys) {
            const i = items.findIndex((a: ApiKey) => { return a.name === ApiKeys[index].name })
            if (i > -1) { items[index] = ApiKeys[index]; } else { items.push(ApiKeys[index]); }
        }

        const api = this.setDefault(items, -1);
        localStorage.setItem("gpt_apis", JSON.stringify(items));
        this.state = Object.assign({}, this.state, { apis: items, defaultApi: api, currentApiName: api?.name, configOverrides: ApiKeys.length > 0 ? true : false });
    }

    addApiKey = (name: string, key: string, service: typeof OPENAI | typeof AZURE, defaultService: boolean, instance: string) => {
        let newState: Array<ApiKey> = this.state.apis.slice();
        newState.push({ name, key, service, default: defaultService, instance })
        const api = this.setDefault(newState, defaultService ? newState.length - 1 : -1);
        localStorage.setItem("gpt_apis", JSON.stringify(newState));
        this.setState({ apis: newState, defaultApi: api || {} })
    }

    deleteApiKey = (key: ApiKey) => {
        const i = this.state.apis.findIndex((a: ApiKey) => { return a.name === key.name; })
        if (i === -1) { return; }

        const newState = this.state.apis.slice();
        newState.splice(i, 1);
        const api = this.setDefault(newState, -1);
        localStorage.setItem("gpt_apis", JSON.stringify(newState));
        this.setState({ apis: newState, defaultApi: api || {} })
    }

    clearStorage = () => {
        localStorage.removeItem("gpt_apis");
        this.setState({ apis: [], defaultApi: {} });
    }

    setDefault(keys: Array<ApiKey>, newItem: number) {
        let api = null;
        let openAIIndex: number = -1;
        let defaultIndex: number = -1;
        let addedDefault: boolean = false;
        const len = keys.length;

        // For new items set to default, update the full set to unset others. And find
        // first instance of an OpenAI service (save to use as default if needed). Finally
        // correct all the default flags if multiple defaults set
        for (let i = 0; i < len; i++) {
            if (keys[i].service === 'openai' && openAIIndex === -1) { openAIIndex = i }
            if (keys[i].default && defaultIndex === -1) { defaultIndex = i }
            if (!addedDefault && (newItem === i || len === 1)) {
                addedDefault = true;
                keys[i].default = true;
                api = keys[i];
            } else {
                keys[i].default = false;
            }
        }

        // In delete scenario, ensure one API is set to default. If not the array is empty
        // and the upstream should deal with a null default api
        if (!api) {
            const i: number = defaultIndex !== -1 ? defaultIndex : openAIIndex !== -1 ? openAIIndex : keys.length > 0 ? 0 : - 1;
            if (i > -1) {
                keys[i].default = true;
                api = keys[i];
            }
        }

        return api
    }

    getApiKey = (name: string) => {
        return this.state.apis.find((k: ApiKey) => { return k.name === name })
    }

    getDefaultApiKey = () => {
        return this.state.defaultApi;
    }

    getCurrentApiKey = () => {
        return this.getApiKey(this.state.currentApiName);
    }

    setCurrentApiKeyName = (name: string) => {
        this.setState({ currentApiName: name })
    }

    state: any = {
        apis: [],
        defaultApi: {},
        currentApiName: '',
        configOverrides: false,
        addApiKey: this.addApiKey,
        deleteApiKey: this.deleteApiKey,
        clearStorage: this.clearStorage,
        getApiKey: this.getApiKey,
        getDefaultApiKey: this.getDefaultApiKey,
        getCurrentApiKey: this.getCurrentApiKey,
        setCurrentApiKeyName: this.setCurrentApiKeyName
    }

    render() {
        return (
            <ApiContext.Provider value={this.state}>
                {this.props.children}
            </ApiContext.Provider>
        )
    }
}