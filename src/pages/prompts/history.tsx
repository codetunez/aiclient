import './history.css';
import React from 'react';
import { GptContext } from '../../context/gptContext';
import { ExportHistory } from '../../components/exportHistory';
import { ImportHistory } from '../../components/importHistory';
import { GenerateReport } from '../../components/exportReport';
import IQuery from '../../core/entities/IQuery';

export default function History() {

    const gptContext: any = React.useContext(GptContext);

    const history = React.useMemo(() => {
        return gptContext.queryHistory.slice().reverse();
    }, [gptContext.queryHistory])

    return <div className="history">
        <div className="list">
            {history.length === 0 ? <span>No history</span> : <></>}
            {history.map((element: any) => {
                const q: IQuery = element;
                return <button key={q.date} className="history-item" onClick={() => { gptContext.setCurrentQuery(q) }}>
                    <p>{q.queryProfile.prompt}</p>
                    <p>{q.api}</p>
                    <p>{q.date}</p>
                    <p>{q.result ? <span className="ok">OK</span> : <span className="error">ERROR</span>}</p>
                    <p>{q.queryProfile.model}</p>
                    <p>{q.format}</p>
                    <p>{q.ms}ms</p>
                    <p>{q.tokens ?? 0} tokens</p>
                    <p>${q.cost ?? 0}</p>
                </button>;
            })}
        </div>
        <div className="actions">
            {history.length > 0 && <ExportHistory data={history} />}
            <ImportHistory />
            {history.length > 0 && <GenerateReport data={history} />}
            <button onClick={() => gptContext.clearHistory()}>Clear History</button>
        </div>
    </div>

}