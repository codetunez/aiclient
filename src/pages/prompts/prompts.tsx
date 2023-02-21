import '../../core/ui/base.css';
import './prompts.css';

import React from 'react';

import { Combo } from "../../core/ui/controls";
import { Link } from "react-router-dom";

import Results from './results';
import QueryInput from './queryInput';
import History from './history';
import Modal from '../../core/ui/modal';

import PuffLoader from "react-spinners/PuffLoader";

import Header from '../../core/ui/header';

import { useGptContext } from '../../hooks/useGptContext';
import { ApiContext } from '../../context/apiContext';

export default function Prompts() {

  const gptContext: any = useGptContext();
  const apiContext: any = React.useContext(ApiContext);

  const [apis, setApis] = React.useState([]);

  React.useEffect(() => {
    const items = apiContext.apis && apiContext.apis.map((element: any) => {
      return { name: element.name, value: element.name }
    })
    setApis(items);
  }, [apiContext.apis]);

  return <div className="shell">

    {gptContext.error ? <Modal><h2>{gptContext.error}</h2><Link to="/apikeys">Click here to see API keys and profiles</Link><br/><h6 className="sub-error"><i>"{gptContext.subError}"</i></h6></Modal> : null}
    {gptContext.loading ? <Modal><h2>{gptContext.currentModel !== '' ? "Asking..." : "Asking for models"}</h2><br /><PuffLoader color="#fff" /></Modal> : null}

    <div className="header-bar"><Header /></div>

    <div className="prompts">

      <div className="panel prompts-history">
        <div className="panel-toolbar">
          <h3>History</h3>
        </div>
        <History />
      </div>

      <div className="panel prompts-gpt">
        <div className="panel-toolbar">
          <h3>Prompt</h3>
          <div className='btn-bar'>
            <div>API Profile</div>
            <Combo items={apis} value={apiContext.currentApiKeyName} onChange={(e: any) => { apiContext.setCurrentApiKeyName(e.target.value) }} />
            <button className='button-primary' onClick={() => gptContext.newQuery()}>New</button>
          </div>
        </div>
        <QueryInput />
        <Results />
      </div>

    </div>

  </div>;
}
