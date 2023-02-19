import './queryInput.css';
import React from 'react';
import { GptContext } from '../../context/gptContext';
import { Combo } from "../../core/ui/controls";

export default function QueryInput() {

    const gptContext: any = React.useContext(GptContext);
    const [models, setModels] = React.useState([]);

    React.useEffect(() => {
        const items = gptContext.models && gptContext.models.map((element: any) => {
            return { name: element.id, value: element.id }
        })
        setModels(items);
    }, [gptContext.models]);

    return <div className="query">
        <textarea placeholder='Ask a question' name="query" value={gptContext.currentPrompt || ''} onChange={(e: any) => { gptContext.setCurrentPrompt(e.target.value) }}></textarea>
        <div className="panel-toolbar">
            <div className='btn-bar'>
                <div>Model</div>
                <Combo items={models} value={gptContext.currentModel} onChange={(e: any) => { gptContext.setCurrentModel(e.target.value) }} />
            </div>
            <div className='btn-bar'>
                <button className='button-primary' onClick={() => gptContext.executeQuery()}>Complete</button>
            </div>
        </div>
    </div>
}
