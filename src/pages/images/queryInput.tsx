import './queryInput.css';
import React from 'react';
import { ImageContext } from '../../context/imageContext';
import { Combo } from "../../core/ui/controls";

const imageSizes = [
    { name: "256x256", value: "256x256" },
    { name: "512x512", value: "512x512" },
    { name: "1024x1024", value: "1024x1024" }
]

const imageType = [
    { name: "URL", value: "url" },
    { name: "Base64", value: "b64_json" },
]

export default function QueryInput() {

    const imageContext: any = React.useContext(ImageContext);

    return <div className="query">
        <textarea placeholder='What AI image to generate?' name="query" value={imageContext.currentPrompt || ''} onChange={(e: any) => { imageContext.setCurrentPrompt(e.target.value) }}></textarea>
        <div className="panel-toolbar">
            <div className='btn-bar'>
                <div>Size</div>
                <Combo items={imageSizes} value={imageContext.currentSize} onChange={(e: any) => { imageContext.setCurrentSize(e.target.value) }} />
                <div>Image count</div>
                <input type="number" min={1} max={10} maxLength={2} value={imageContext.currentCount} onChange={(e: any) => { imageContext.setCurrentCount(e.target.value) }} />
                <div>Format</div>
                <Combo items={imageType} value={imageContext.currentFormat} onChange={(e: any) => { imageContext.setCurrentFormat(e.target.value) }} />
            </div>
            <div className='btn-bar'>
                <button className='button-primary' onClick={() => imageContext.executeQuery()}>Complete</button>
            </div>
        </div>
    </div>
}
