import '../../core/ui/base.css';
import './prompts.css';

import React from 'react';

import { GptContext } from '../../context/gptContext';
import { Combo } from "../../core/ui/controls";

import Results from './results';
import QueryInput from './queryInput';
import History from './history';
import Modal from '../../core/ui/modal';

import PuffLoader from "react-spinners/PuffLoader";

import Header from '../../core/ui/header';

export default function Prompts() {

  const gptContext: any = React.useContext(GptContext);
  const [models, setModels] = React.useState([]);
  const [apis, setApis] = React.useState([]);

  React.useEffect(() => {
    const items = gptContext.models && gptContext.models.map((element: any) => {
      return { name: element.id, value: element.id }
    })
    setModels(items);
  }, [gptContext.models]);

  React.useEffect(() => {
    const items = gptContext.apis && gptContext.apis.map((element: any) => {
      return { name: element, value: element }
    })
    setApis(items);
  }, [gptContext.apis]);

  return <div className="shell">

    {gptContext.error ? <Modal><h2>{gptContext.error}</h2></Modal> : null}
    {gptContext.loading ? <Modal><h2>{gptContext.currentModel !== '' ? "asking..." : "asking for models"}</h2><br /><PuffLoader color="#fff" /></Modal> : null}

    <div className="header-bar"><Header/></div>

    <div className="prompts">
      <div className="panel panel-history">
        <div className="panel-header"><h3>History</h3></div>
        <div className="panel-content">
          <div className="panel-content-inner">
            <History />
          </div>
        </div>
      </div>

      <div className="panel panel-gpt">
        <div className="panel-header">
          <h3>Prompt</h3>
          <div className='btn-bar'>
            <button className='button-primary' onClick={() => gptContext.newQuery()}>New</button>
            <Combo items={apis} value={gptContext.currentApi} onChange={(e: any) => { gptContext.setCurrentApi(e.target.value) }} />
            <Combo items={models} value={gptContext.currentModel} onChange={(e: any) => { gptContext.setCurrentModel(e.target.value) }} />
          </div>
        </div>
        <div className="panel-content">
          <div className="panel-content-inner">
            <QueryInput />
            <Results />
          </div>
        </div>
      </div>
    </div>

  </div>;
}
