import './header.css';

import React from 'react';
import { Link, useLocation } from "react-router-dom";

const leftItems = [
    { name: "Text Prompts", path: "/" },
    { name: "Image Prompts", path: "/images" },
    { name: "Fine-Tunes", path: "/finetunes" }
]

const rightItems = [
    { name: "API Keys", path: "/apikeys" }
]

export default function Header() {

    const location = useLocation();

    const leftItemsLastIndex = React.useMemo(() => {
        return leftItems.length - 1;
    }, []);

    const rightItemsLastIndex = React.useMemo(() => {
        return rightItems.length - 1;
    }, []);

    return <div className="header">
        <div className="items">
            {leftItems.map((item: any, index: number) => {
                return <div key={item.name}><Link className={item.path === location.pathname ? 'selected' : ''} to={item.path}>{item.name}</Link>{index !== leftItemsLastIndex ? <span>|</span> : null}</div>
            })}
        </div>
        <div className="items">
            {rightItems.map((item: any, index: number) => {
                return <div key={item.name}><Link className={item.path === location.pathname ? 'selected' : ''} to={item.path}>{item.name}</Link>{index !== rightItemsLastIndex ? <span>|</span> : null}</div>
            })}
        </div>
    </div>
}
