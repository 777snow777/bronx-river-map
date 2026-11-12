import React from 'react';
import './panelcontainer.css';

export default function PlantSpecies({map, plantData}){  
    let layerId = plantData.Scientific.split(" ").join("-")+"-inat"

    const highlightRange = () =>{
        map.setPaintProperty(
            layerId,
            'circle-opacity', 1
        );
    }
    
    const removeHighlight = () =>{
        map.setPaintProperty(
            layerId,
            'circle-opacity', 0
        );
    }
    return(
        <li className = "plant-ctrl" onMouseEnter={highlightRange} onMouseLeave={removeHighlight}>
                <div className="plant-name"><div className='common'>{plantData.common}</div> <div className="scientific">{plantData.scientific}</div></div>
        </li>
    )
}