import './history.css';
import React from 'react';
import { ImageContext } from '../../context/imageContext';
import IImageQuery from '../../core/entities/IImageQuery';

export default function History() {

    const imageContext: any = React.useContext(ImageContext);

    const history = React.useMemo(() => {
        return imageContext.queryHistory.slice().reverse();
    }, [imageContext.queryHistory])

    return <div className="history">
        <div className="list">
            {history.length === 0 ? <span>No history</span> : <></>}
            {history.map((element: any) => {
                const q: IImageQuery = element;
                return <button key={q.date} className="history-item" onClick={() => { imageContext.setCurrentQuery(q) }}>
                    <p>{q.queryProfile.prompt}</p>
                    <p>{q.api}</p>
                    <p>{q.date}</p>
                    <p>{q.result ? <span className="ok">OK</span> : <span className="error">ERROR</span>}</p>
                    <p>{q.queryProfile.response_format}</p>
                    <p>{q.queryProfile.size}</p>
                    <p>{q.ms}ms</p>
                    <p>${q.cost ?? 0}</p>
                </button>;
            })}
        </div>
        <div className="actions">
            <button onClick={() => imageContext.clearHistory()}>Clear img history</button>
        </div>
    </div>

}