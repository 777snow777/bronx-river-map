import React, {useEffect, useState } from 'react';
import LpiSiteFeature from './LpiSiteFeature';
import RsaSiteFeature from './RsaSiteFeature';
import INatPlantExplorer from './iNatPlantExplorer';
import "./panelcontainer.css";

export default function RightPanel({rightPanelState, siteData, map, plantProfiles}) {
    function selectPanelView(state){
        switch (state) {
            case "lpi":
                return (<LpiSiteFeature siteData={siteData} map={map}/>)
            case "rsa":
                return (<RsaSiteFeature siteData={siteData} map={map} plantProfiles={plantProfiles}/>)
            case "plant-profiles":
                return (<INatPlantExplorer map={map} plantProfiles={plantProfiles}/>)
            default:
                return 
        }
    }
    
    return (
        <>   
            {selectPanelView(rightPanelState)}
        </>
    ) 
}
