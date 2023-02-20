import './results.css';
import React from 'react';

import { ImageContext } from '../../context/imageContext';

export default function Results() {

    const imageContext: any = React.useContext(ImageContext);
    const [images, setImages] = React.useState([]);

    React.useEffect(() => {
        setImages(imageContext.currentQuery.result);
    }, [imageContext.currentQuery.result]);

    const queryFormat = imageContext.currentQuery.queryProfile?.response_format === "url" || false;

    // optional chaining has been added to stop crashes due to loading time and a property being available
    return <div className="results">
        <div className='results-images'>
            {images && images.map((item: any, index: number) => {
                const src = queryFormat ? item.url : "data:image/png; base64, " + item.b64_json;
                return <div key={index} className="image">
                    <label>{`${index + 1}/${images?.length || '?'}`}</label>
                    <img alt={`dall-e-${index}`} src={src} />
                    {queryFormat ? <a href={item.url} target="_blank" rel="noreferrer">Open in a new tab</a> : <span>Base64 Image (~{Math.round((Math.ceil(item.b64_json?.length || 0 / 4) * 3) / 1024)}kb)</span>}
                </div>
            })}
        </div>
    </div>
}