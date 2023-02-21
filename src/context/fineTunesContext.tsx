import * as React from 'react';
import axios from 'axios';

export const FineTunesContext = React.createContext({});

export class FineTunesProvider extends React.PureComponent<any> {

    initialize = (key: string) => {
        let files: any = null;
        axios('https://api.openai.com/v1/files', { headers: { "Authorization": "Bearer " + key } })
            .then((res: any) => {
                files = res.data;
                return axios('https://api.openai.com/v1/fine-tunes', { headers: { "Authorization": "Bearer " + key } })
            })
            .then((res: any) => {
                this.setState({ files: files.data, fineTunes: res.data.data, loading: false, key })
            })
            .catch((err: any) => {
                this.setState({ loading: false, error: "Failed to load files or fine-tunes. Check API profile" })
            })
    }

    setSelectedFile = (item: any) => {
        this.setState({ selectedFile: item })
    }

    setSelectedFineTune = async (item: any) => {

        this.setState({ loading: true });

        const options: any = {
            method: "get",
            url: "https://api.openai.com/v1/models",
            headers: {
                "Authorization": "Bearer " + this.state.key
            }
        }

        try {
            const res = await axios(options);
            const model = res.data.data.find((x: any) => { return x.id === item.fine_tuned_model });
            const o = Object.assign({}, item, { model_found: model ? true : false });
            this.setState({ selectedFineTune: o, loading: false });

        } catch (err: any) {
            console.log(err.response.data);
            this.setState({ error: err.response.data.message, loading: false });
        }
    }

    setJsonL = (blob: any, fileName: any, contents: any) => {
        this.setState({ jsonlBlob: blob, jsonlFilename: fileName, jsonl: contents })
    }

    setError = (message: string) => {
        this.setState({ error: message, loading: false });
    }

    uploadJsonL = async () => {
        this.setState({ loading: true });

        const d = new FormData();
        d.append("purpose", "fine-tune");
        d.append("file", this.state.jsonlBlob, this.state.jsonlFilename || 'myfile.jsonl')

        const options: any = {
            method: "post",
            url: "https://api.openai.com/v1/files",
            headers: {
                "Authorization": "Bearer " + this.state.key
            },
            data: d
        }

        try {
            await axios(options);
            const res2 = await axios('https://api.openai.com/v1/files', { headers: { "Authorization": "Bearer " + this.state.key } })
            this.setState({ files: res2.data.data, loading: false });
        } catch (err: any) {
            console.log(err.response.data);
            this.setState({ error: err.response.data.message, loading: false });
        }
    }

    deleteFile = async () => {
        this.setState({ loading: true });

        const options: any = {
            method: "delete",
            url: "https://api.openai.com/v1/files/" + this.state.selectedFile.id,
            headers: {
                "Authorization": "Bearer " + this.state.key
            }
        }

        try {
            await axios(options);
            const res2 = await axios('https://api.openai.com/v1/files', { headers: { "Authorization": "Bearer " + this.state.key } })
            this.setState({ files: res2.data.data, selectedFile: null, loading: false });
        } catch (err: any) {
            console.log(err.response.data);
            this.setState({ error: err.response.data.message, loading: false });
        }
    }

    createFineTune = async (model: string) => {
        this.setState({ loading: true });

        const options: any = {
            method: "post",
            url: "https://api.openai.com/v1/fine-tunes",
            headers: { "Authorization": "Bearer " + this.state.key },
            data: { "training_file": this.state.selectedFile.id, "model": model }
        }

        try {
            await axios(options);
            const res2 = await axios('https://api.openai.com/v1/fine-tunes', { headers: { "Authorization": "Bearer " + this.state.key } })
            this.setState({ fineTuness: res2.data.data, loading: false });
        } catch (err: any) {
            console.log(err.response.data);
            this.setState({ error: err.response.data.message, loading: false });
        }
    }

    deleteFineTune = async () => {
        this.setState({ loading: true });

        // fine-tunes are not deleted as these are jobs. so no need to refresh the list. modal_found is
        // an app concept as the intent to delete a fine-tune is to delete the modal the fine-tune created.
        // fine-tunes are kept about because they contain the cost of running the fine-tune in the past

        const options: any = {
            method: "delete",
            url: "https://api.openai.com/v1/models/" + this.state.selectedFineTune.fine_tuned_model,
            headers: { "Authorization": "Bearer " + this.state.key }
        }

        try {
            await axios(options);
            const updatedFineTune = Object.assign({}, this.state.selectedFineTune, { modal_found: false })
            this.setState({ loading: false, selectedFineTune: updatedFineTune });
        } catch (err: any) {
            console.log(err.response.data);
            this.setState({ error: err.response.data.message, loading: false });
        }
    }

    getEvents = async () => {
        this.setState({ loading: true });

        const options: any = {
            method: "get",
            url: "https://api.openai.com/v1/fine-tunes/" + this.state.selectedFineTune.id + "/events",
            headers: { "Authorization": "Bearer " + this.state.key }
        }

        const res = await axios(options);
        this.setState({ selectedEvents: JSON.stringify(res.data.data, null, 2), loading: false });
    }

    state: any = {
        initialize: this.initialize,
        setSelectedFile: this.setSelectedFile,
        setSelectedFineTune: this.setSelectedFineTune,
        getEvents: this.getEvents,
        setJsonL: this.setJsonL,
        setError: this.setError,
        uploadJsonL: this.uploadJsonL,
        deleteFile: this.deleteFile,
        createFineTune: this.createFineTune,
        deleteFineTune: this.deleteFineTune,
        files: [],
        fineTunes: [],
        selectedFile: null,
        selectedFineTune: null,
        selectedEvents: "",
        jsonl: "",
        jsonlBlob: null,
        jsonlFilename: null,
        loading: true
    }

    render() {
        return (
            <FineTunesContext.Provider value={this.state}>
                {this.props.children}
            </FineTunesContext.Provider>
        )
    }
}
