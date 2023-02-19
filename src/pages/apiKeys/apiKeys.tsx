import '../../core/ui/base.css';
import './apiKeys.css';

import React from 'react';
import { GptContext } from '../../context/gptContext';

import Header from '../../core/ui/header';

export default function ApiKeys() {

    const gptContext: any = React.useContext(GptContext);

    return <div className="shell">
        <div className="header-bar"><Header /></div>

        <div className="api-keys">
            <div className="panel">
                <h3>API Keys</h3>
                <br/>
                <label>Current API</label>
                {gptContext.currentApi}
            </div>
        </div>
    </div>
}