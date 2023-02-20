import './results.css';
import Editor from "@monaco-editor/react";

import { useGptContext } from '../../hooks/useGptContext';
import { Combo } from "../../core/ui/controls";

const languageOptions = [
    { name: "Text", value: "text" },
    { name: "JSON", value: "json" },
    { name: "JavaScript", value: "javascript" },
    { name: "HTML", value: "html" },
    { name: "CSS", value: "css" },
    { name: "TypeScript", value: "typescript" },
    { name: "Python", value: "python" },
    { name: "C/C++", value: "c" },
    { name: "XML", value: "xml" },
]

export default function Results() {

    const gptContext: any = useGptContext();

    return <div className="results">
        <div className='results-editor'>
            <Editor options={{
                renderLineHighlight: 'none',
                wordWrap: 'on',
                formatOnType: true,
                lineNumbers: 'off',
                minimap: { enabled: false },
                glyphMargin: false,
                disableLayerHinting: true,
                matchBrackets: 'never',
            }}
                language={gptContext.currentFormat}
                onChange={() => { }}
                defaultValue={gptContext.currentQuery?.result || ''}
                value={gptContext.currentQuery?.result || ''}
            />
        </div>

        <div className="panel-toolbar">
            <div className='btn-bar'></div>
            <div className='btn-bar'>
                <div>Format</div>
                <Combo items={languageOptions} value={gptContext.currentFormat} onChange={(e: any) => { gptContext.setCurrentFormat(e.target.value) }} />
            </div>
        </div>
    </div>
}