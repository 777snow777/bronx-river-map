import React, {use, useEffect, useState} from 'react';
import './panelcontainer.css';

export default function PlantSpecies({map, plantData, visibilityDict, setVisibilityDict}){  
    const togglePlantObs = () => {
        if (!map) return;
        const nextState = !visibilityDict[plantData.layerId];
        setVisibilityDict(prevDictionary => ({
            ...prevDictionary, 
            [plantData.layerId]: nextState  
        }));

        map.setLayoutProperty(
            plantData.layerId,
            'visibility', nextState? "visible" : "none"
        );
        
        return
    };
    const highlightRange = () =>{
        if (visibilityDict[plantData.layerId] != true){
            map.setLayoutProperty(
                plantData.layerId,
                'visibility', 'visible'
            );
        }else{
            map.setPaintProperty(
                plantData.layerId, 
                'circle-color', '#FFFFFF');
        }
    }
    
    const removeHighlight = () =>{
        if (visibilityDict[plantData.layerId] != true){
            map.setLayoutProperty(
                plantData.layerId,
                'visibility', "none"
            );
        }else{
            map.setPaintProperty(
                plantData.layerId, 
                'circle-color', plantData.color);
        }
    }
    return(
            // {/* {imageReady && <img src={plantData.image}/>} */}
        <div className = "plant-ctrl" onMouseEnter={highlightRange} onMouseLeave={removeHighlight}>
            <div className="plant-label">
                <input type="checkbox" name={plantData.common} checked={visibilityDict[plantData.layerId]} onChange={togglePlantObs}/>
                <div className="plant-name"><div className='common'>{plantData.common}</div> <div className="scientific">{plantData.scientific}</div></div>
            </div>
            <div style={{backgroundColor: plantData.color, width: '10px', height: '10px', alignItems: 'center', margin: '3%', borderRadius: '50%'}}> </div>
        </div>
    )
}