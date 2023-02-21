import './queryInput.css';
import React from 'react';
import { Combo } from "../../core/ui/controls";

import { useGptQuery } from '../../hooks/useGptQuery';
import { useGptContext } from '../../hooks/useGptContext';

export default function QueryInput() {

    const gptContext: any = useGptContext();
    const [executeQuery, ,] = useGptQuery();
    const [models, setModels] = React.useState([]);

    React.useEffect(() => {
        if (!gptContext.models) { return; }
        const items = gptContext.models && gptContext.models.map((element: any) => {
            return { name: element.id, value: element.id }
        })
        setModels(items);
    }, [gptContext.models]);

    return <div className="query">
        <textarea placeholder='Ask a question' name="query" value={gptContext.currentPrompt || ''} onChange={(e: any) => { gptContext.setCurrentPrompt(e.target.value) }}></textarea>
        <div className="panel-toolbar">
            <div className='btn-bar'>
                {gptContext.models ? <>
                    <div>Model</div>
                    <Combo items={models} value={gptContext.currentModel} onChange={(e: any) => { gptContext.setCurrentModel(e.target.value) }} />
                </> : null}
                <div>Temperature</div>
                <input type="number" min={0} max={1000} maxLength={4} name="currentTemperature" value={gptContext.currentTemperature} onChange={(e: any) => { gptContext.setCurrentTemperature(e.target.value) }} />
                <div>Max tokens</div>
                <input type="number" min={0} max={2048} maxLength={4} name="currentMaxTokens" value={gptContext.currentMaxTokens} onChange={(e: any) => { gptContext.setMaxTokens(e.target.value) }} />
            </div>
            <div className='btn-bar'>
                <button className='button-primary' onClick={() => executeQuery()}>Complete</button>
            </div>
        </div>
    </div>
}
