import '../../core/ui/base.css';
import './apiKeys.css';

import React from 'react';
import { ApiContext } from '../../context/apiContext';

import Header from '../../core/ui/header';
import { ApiKey, OPENAI, AZURE } from '../../config';
import { Combo } from '../../core/ui/controls';

export default function ApiKeys() {

    const apiContext: any = React.useContext(ApiContext);
    const [name, setName] = React.useState('');
    const [key, setKey] = React.useState('');
    const [service, setService] = React.useState(OPENAI);
    const [defaultService, setDefaultService] = React.useState(false);
    const [modelUrl, setModelUrl] = React.useState('');
    const [apis, setApis] = React.useState([]);

    const _save = () => {
        apiContext.addApiKey(name, key, service, defaultService, modelUrl);
    }

    const _reset = () => {
        // This shouldn't work but does because this page is pretty simple during render cycles. Should be refactored into a reducer
        setName('');
        setKey('');
        setService(OPENAI);
        setDefaultService(false);
        setModelUrl('');
    }

    React.useEffect(() => {
        const items = apiContext.apis && apiContext.apis.map((element: any) => {
            return { name: element.name, value: element.name }
        })
        setApis(items);
    }, [apiContext.apis]);

    return <div className="shell">
        <div className="header-bar"><Header /></div>

        <div className="api-keys">
            <div className="panel">

                <div className="block">
                    <h3>API profiles</h3>
                    {apiContext.apis.length === 0 ? <span>No API Keys have been added. Add a new one using an account from <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noreferrer">OpenAI</a> or the <a href="https://azure.microsoft.com/en-us/products/cognitive-services/openai-service" target="_blank" rel="noreferrer">Azure OpenAI Service</a> and complete the section below.</span> :
                        <>
                            <p>These are the current API keys. To modify, delete and re-create</p>
                            <div className='delete-form'>
                                <label>Profile Name</label>
                                <label>Key</label>
                                <label>Service</label>
                                <label>Default</label>
                            </div>
                        </>
                    }
                    {apiContext.apis.map((key: ApiKey) => {
                        return <div key={key.name} className='delete-form'>
                            <input type="text" value={key.name} readOnly={true} />
                            <input type="text" value={key.key} readOnly={true} />
                            <input type="text" value={key.service + (key.modelUrl !== undefined && key.modelUrl ? ` (${key.modelUrl})` : '')} readOnly={true} />
                            <input type="text" value={key.default ? 'Yes' : 'No'} readOnly={true} />
                            <button className='button-primary' onClick={() => apiContext.deleteApiKey(key)}>Delete</button>
                        </div>
                    })}
                    {apiContext.configOverrides && apiContext.apis.length > 0 ? <span className="light">Using API Keys configured in code and overriding on matching profile names</span> : null}
                </div>

                <div className="block">
                    <h5>Add a new API profile</h5>
                    <p>API profiles are stored in local storage and will need to be re-entered on all devices</p>
                    <label>Profile Name</label>
                    <input type="text" value={name} onChange={(e: any) => setName(e.target.value)} />
                    <label>API Key/Secret</label>
                    <input type="text" value={key} onChange={(e: any) => setKey(e.target.value)} />
                    <label>Hosting service</label>
                    <div className="radio-group">
                        <input name="service" type="radio" defaultChecked={service === OPENAI ? true : false} onClick={() => setService('openai')} /><span>Open AI</span>
                        <input name="service" type="radio" defaultChecked={service === AZURE ? true : false} onClick={() => setService('azure')} /><span>Azure</span>
                    </div>

                    {service !== AZURE ? null : <>
                        <label>AzureAI fully qualified model Url </label>
                        <input type="text" value={modelUrl} onChange={(e: any) => setModelUrl(e.target.value)} />
                    </>}

                    <label>Default profile</label>
                    <div className="radio-group">
                        <input name="default" type="radio" defaultChecked={defaultService} onClick={() => setDefaultService(true)} /><span>Yes (Overrides current)</span>
                        <input name="default" type="radio" defaultChecked={!defaultService} onClick={() => setDefaultService(false)} /><span>No</span>
                    </div>
                    <button style={{ marginRight: '1rem' }} className='button-primary' onClick={() => _save()}>Save</button>
                    <button onClick={() => _reset()}>Reset</button>
                </div>

                {apiContext.apis.length === 0 ? null :
                    <>
                        <div className="block">
                            <h3>Set current API profile for application</h3>
                            <p>Use this if the application cannot load models or fine-tunes for the current set API profile. Current API profile selected is <b>{apiContext.currentApiKeyName}</b></p>
                            <label>Change selected API profile</label>
                            <Combo items={apis} value={apiContext.currentApiKeyName} onChange={(e: any) => { apiContext.setCurrentApiKeyName(e.target.value) }} />
                        </div>

                        <div className="block">
                            <h3>Reset device</h3>
                            <p>Clear all the API keys stored on this device</p>
                            <button className='button-primary' onClick={() => apiContext.clearStorage()}>Clear device</button>
                        </div>
                    </>
                }

            </div>
        </div>
    </div>
}