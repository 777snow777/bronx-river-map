import "./leftpanel.css";
import React, { useState, useCallback, useEffect } from 'react';
import ToggleLayer from "./ToggleLayer";

export default function LeftPanel({map, layers}) {
    const [width, setWidth] = useState(400); 
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);
    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);
    const resize = useCallback(
        (ev) => {
          if (isResizing) {
            const newWidth = ev.clientX;
            if (newWidth >= 50 && newWidth <= 800) { // Min and Max width constraints
              setWidth(newWidth);
            }
          }
        },
        [isResizing]
      );
      useEffect(() => {
        if (isResizing) {
          window.addEventListener('mousemove', resize);
          window.addEventListener('mouseup', stopResizing);
        }
        return () => {
          window.removeEventListener('mousemove', resize);
          window.removeEventListener('mouseup', stopResizing);
        };
      }, [isResizing, resize, stopResizing]);
    
      return (
        <div className="left-panel" style={{ width: `${width}px` }}>
            <div className="panel-content">
              <h2>Data Layers</h2>
              <ToggleLayer map={map} layers={layers}/>
            </div>
            <div className="resizer" onMouseDown={startResizing}></div>
        </div>
      ); 
}