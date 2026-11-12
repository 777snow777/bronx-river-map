import React, {useEffect, useState } from 'react';
import LpiSiteFeature from './LpiSiteFeature';
import RsaSiteFeature from './RsaSiteFeature';
import PlantProfiles from './PlantProfiles';
import PlantProfile from './PlantProfile';
import FeaturedSite from './FeaturedSite';
import "./panelcontainer.css";

export default function RightPanel({rightPanelState, setRightPanelState, siteData, map, plantProfiles, selectedPlant, setSelectedPlant}) {
    const [prevState, setPrevState] = useState("plant-profiles")
    function selectPanelView(state){
        switch (state) {
            case "lpi":
                return (<LpiSiteFeature siteData={siteData} map={map}/>)
            case "rsa":
                return (<RsaSiteFeature siteData={siteData} plantProfiles={plantProfiles}/>)
            case "plant-profiles":
                return (<PlantProfiles map={map} plantProfiles={plantProfiles} setSelectedPlant={setSelectedPlant} setPrevState={setPrevState}/>)
            case "plant-profile":
                return (<PlantProfile map={map} setRightPanelState={setRightPanelState} plantProfiles={plantProfiles} selectedPlant={selectedPlant} prevState={prevState}/>)
            case "featured-site":
                return (<FeaturedSite map={map} siteData={siteData} setSelectedPlant={setSelectedPlant} plantProfiles={plantProfiles} setPrevState={setPrevState}/>)    
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
