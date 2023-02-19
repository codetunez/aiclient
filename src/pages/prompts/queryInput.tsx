import './queryInput.css';
import React from 'react';
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { GptContext } from '../../context/gptContext';

export default function QueryInput() {

    const gptContext: any = React.useContext(GptContext);

    const override: CSSProperties = {
        margin: "0 auto",
        borderColor: "white",
        width: "10px",
        height: "10px"
    };

    <ClipLoader color="#33C3F0" loading={gptContext.loading} cssOverride={override} />

    return <div className="query">
        <textarea placeholder='Ask a question' name="query" value={gptContext.currentPrompt || ''} onChange={(e: any) => { gptContext.setCurrentPrompt(e.target.value) }}></textarea>
        <button className='button-primary' onClick={() => gptContext.executeQuery()}>Ask</button>
    </div>
}


