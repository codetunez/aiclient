import './history.css';
import React from 'react';
import { Query, GptContext } from './context/gptContext';

export default function History() {

    const gptContext: any = React.useContext(GptContext);

    const history = React.useMemo(() => {
        return gptContext.queryHistory.slice().reverse();
    }, [gptContext.queryHistory])

    return <div className="history">
        <div>
            {history.length === 0 ? <span>Ho history</span> : null}

            {history.map((element: any) => {
                const q: Query = element;
                return <button key={q.date} className="history-item" onClick={() => { gptContext.setCurrentQuery(q) }}>
                    <p>{q.queryProfile.prompt}</p>
                    <p>{q.date}</p>
                    <p>{q.result ? <span className="ok">OK</span> : <span className="error">ERROR</span>}</p>
                    <p>{q.queryProfile.model}</p>
                    <p>{q.format}</p>
                    <p>{q.ms}ms</p>
                </button>;
            })}
        </div>
        <div>
            <button onClick={() => gptContext.clearHistory()}>Clear History</button>
        </div>
    </div>

}