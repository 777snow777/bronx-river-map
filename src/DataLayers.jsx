import "./panelcontainer.css";
import React, { useState, useCallback, useEffect } from 'react';
import ToggleLayer from "./ToggleLayer";

export default function DataLayers({map, layers}) {    
    return (
        <div className="data-layers-container">
            <div className="panel-content">
                <h2>Data Layers</h2>
                {layers.map((layer) => (
                    <ToggleLayer key={layer.id} map={map} layer={layer}/>
                ))}
            </div>
            {/* <div className="resizer" onMouseDown={startResizing}></div> */}
        </div>
      ); 
}