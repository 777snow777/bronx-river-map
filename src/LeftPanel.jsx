import React, {useEffect, useState } from 'react';
import "./panelcontainer.css";
import RSAPlantExplorer from './RSAPlantExplorer';
import DataLayers from "./DataLayers";

export default function LeftPanel({leftPanelState, map, plantProfiles}) {
    function selectPanelView(state){
        switch (state) {
            case 'explorer': 
                return (<RSAPlantExplorer map={map} plantProfiles={plantProfiles}/>)
            case "data-layers":
                return (<DataLayers map={mapInstance} layers={layers}/>)
            default:
                return (<RSAPlantExplorer map={map} plantProfiles={plantProfiles}/>)
        }
    }
    return (
        <div className='left-panel'>   
            {selectPanelView(leftPanelState)}
        </div>
    ) 
}
