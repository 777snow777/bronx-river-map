import React, {useEffect, useState } from 'react';
import LpiSiteFeature from './LpiSiteFeature';
import RsaSiteFeature from './RsaSiteFeature';
import PlantProfiles from './PlantProfiles';
import PlantProfile from './PlantProfile';
import FeaturedSite from './FeaturedSite';
import "./panelcontainer.css";

export default function RightPanel({rightPanelState, setRightPanelState, map, plantProfiles, selectedPlant, setSelectedPlant, selectedIdRef}) {
    const [prevState, setPrevState] = useState("plant-profiles")
    function selectPanelView(state){
        switch (state) {
            case "plant-profiles":
                return (<PlantProfiles map={map} plantProfiles={plantProfiles} setSelectedPlant={setSelectedPlant} setPrevState={setPrevState}/>)
            case "plant-profile":
                return (<PlantProfile map={map} setRightPanelState={setRightPanelState} plantProfiles={plantProfiles} selectedPlant={selectedPlant} prevState={prevState}/>)
            // case "featured-site":
            //     return (<FeaturedSite map={map} siteData={siteData} setSelectedPlant={setSelectedPlant} plantProfiles={plantProfiles} setPrevState={setPrevState}/>)    
            default:
                return 
        }
    }

    const changeRightState = (e, val) =>{
        setRightPanelState(x)
    }
    
    return (
        <div className="right-panel">   
            <div className="top-header"> 
                <div className={((rightPanelState=="plant-profiles") || (rightPanelState=="plant-profile")) ? "selected-tab" : "idle-tab"} onClick={(e)=>changeRightState("plant-profiles")}>Plant Profiles</div>
                <div className={(rightPanelState=="glossary") ? "selected-tab" : "idle-tab"}  onClick={(e)=>changeRightState(e, "plant-profiles")}>Glossary</div>
                <div className={(rightPanelState=="about") ? "selected-tab" : "idle-tab"}  onClick={(e)=>changeRightState("plant-profiles")}>About</div>
            </div> 
            <div className="right-body">
                {selectPanelView(rightPanelState)}
            </div> 
        </div>
) 
}
