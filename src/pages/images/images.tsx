import '../../core/ui/base.css';
import './images.css';

import React from 'react';
import { ImageContext } from '../../context/imageContext';

import { Combo } from "../../core/ui/controls";
import { Link } from "react-router-dom";

import Results from './results';
import QueryInput from './queryInput';
import History from './history';
import Modal from '../../core/ui/modal';

import PuffLoader from "react-spinners/PuffLoader";

import Header from '../../core/ui/header';

import { ApiContext } from '../../context/apiContext';
import { GptContext } from '../../context/gptContext';

export default function Images() {

    const apiContext: any = React.useContext(ApiContext);
    const imageContext: any = React.useContext(ImageContext);
    const gptContext: any = React.useContext(GptContext);

    const [apis, setApis] = React.useState([]);

    React.useEffect(() => {
        const items = apiContext.apis && apiContext.apis.map((element: any) => {
            return { name: element.name, value: element.name }
        })
        setApis(items);
    }, [apiContext.apis]);

    const errorContext = gptContext.error ? gptContext : imageContext;

    return <div className="shell">

        {errorContext.error ? <Modal><h2>{errorContext.error}</h2><Link to="/apikeys">Click here to see API keys and profiles</Link><br />{errorContext.subError ? <h6 className="sub-error"><i>"{errorContext.subError}"</i></h6> : null}</Modal> : null}
        {gptContext.loading ? <Modal><h2>{gptContext.currentModel !== '' ? "Asking..." : "Asking for models"}</h2><br /><PuffLoader color="#fff" /></Modal> : null}

        <div className="header-bar"><Header /></div>

        <div className="images">

            <div className="panel images-history">
                <div className="panel-toolbar">
                    <h3>History</h3>
                </div>
                <History />
            </div>

            <div className="panel images-gpt">
                <div className="panel-toolbar">
                    <h3>Prompt</h3>
                    <div className='btn-bar'>
                        <div>API Profile</div>
                        <Combo items={apis} value={apiContext.currentApiKeyName} onChange={(e: any) => { apiContext.setCurrentApiKeyName(e.target.value) }} />
                        <button className='button-primary' onClick={() => imageContext.newQuery()}>New</button>
                    </div>
                </div>
                <QueryInput />
                <Results />
            </div>

        </div>

    </div>
}