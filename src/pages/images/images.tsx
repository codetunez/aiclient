import '../../core/ui/base.css';
import './images.css';

import React from 'react';
import { GptContext } from '../../context/gptContext';
import { ImageContext } from '../../context/imageContext';

import { Combo } from "../../core/ui/controls";

import Results from './results';
import QueryInput from './queryInput';
import History from './history';
import Modal from '../../core/ui/modal';

import PuffLoader from "react-spinners/PuffLoader";

import Header from '../../core/ui/header';

export default function Images() {

    const gptContext: any = React.useContext(GptContext);
    const imageContext: any = React.useContext(ImageContext);

    const [apis, setApis] = React.useState([]);

    React.useEffect(() => {
        const items = gptContext.apis && gptContext.apis.map((element: any) => {
            return { name: element, value: element }
        })
        setApis(items);
    }, [gptContext.apis]);

    return <div className="shell">

        {imageContext.error ? <Modal><h2>{imageContext.error}</h2></Modal> : null}
        {imageContext.loading ? <Modal><h2>{imageContext.currentModel !== '' ? "Asking..." : "Asking for models"}</h2><br /><PuffLoader color="#fff" /></Modal> : null}

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
                        <div>Service</div>
                        <Combo items={apis} value={gptContext.currentApi} onChange={(e: any) => { gptContext.setCurrentApi(e.target.value) }} />
                        <button className='button-primary' onClick={() => imageContext.newQuery()}>New</button>
                    </div>
                </div>
                <QueryInput />
                <Results />
            </div>

        </div>

    </div>
}