import React, {useState } from 'react';
import "./panelcontainer.css";
import RsaExplorer from './RSAExplorer';
import DataLayers from "./DataLayers";
import FeaturedSites from './FeaturedSites';
export default function LeftPanel({leftPanelState, map, plantProfiles, mapLayers, setRightPanelState, setSiteData}) {
    function selectPanelView(state){
        switch (state) {
            case 'vegetation': 
                return (<RsaExplorer map={map} plantProfiles={plantProfiles}/>)
            case "data-layers":
                return (<DataLayers map={map} mapLayers={mapLayers}/>)
            case "featured-sites":
                return (<FeaturedSites map={map} setSiteData={setSiteData} setRightPanelState={setRightPanelState}/>)
            default:
                return (<DataLayers map={map} mapLayers={mapLayers}/>)
        }
    }
    return (
        <div className='left-panel'>   
            {selectPanelView(leftPanelState)}
        </div>
    ) 
}
