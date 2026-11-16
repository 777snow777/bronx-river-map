import React, {useState, useEffect } from 'react';
import "./panelcontainer.css";
import RsaExplorer from './RSAExplorer';
import DataLayers from "./DataLayers";
import FeaturedSites from './FeaturedSites';
export default function LeftPanel({leftPanelState, setLeftPanelState, leftStateRef, map, plantProfiles, mapLayers, setRightPanelState, rightPanelState, setSiteData}) {
    const [appliedLayers, setAppliedLayers] = useState([])
    function selectPanelView(state){
        switch (state) {
            case 'vegetation': 
                return (<RsaExplorer map={map} appliedLayers={appliedLayers} plantProfiles={plantProfiles}/>)
            case "data-layers":
                return (<DataLayers map={map} mapLayers={mapLayers} appliedLayers={appliedLayers} setAppliedLayers={setAppliedLayers} setRightPanelState={setRightPanelState}/>)
            case "featured-sites":
                return (<FeaturedSites map={map} setSiteData={setSiteData} setRightPanelState={setRightPanelState}/>)
            default:
                return (<DataLayers map={map} mapLayers={mapLayers}/>)
        }
    }

    const changeLeftState = (e, val) =>{
        if ((val != "vegetation") && (rightPanelState == "rsa")){
            setRightPanelState("closed")
        }
        setLeftPanelState(val)
        leftStateRef.current = val
    }

    useEffect(()=>{
        const visibleLayers = mapLayers.flatMap(obj => obj.layers || []).filter(item => item.visibility == "visible");
        setAppliedLayers(visibleLayers)
    }, [])

    return (
        <div className='left-panel'>   
            <div className='top-header'>
                <div className={leftPanelState=="data-layers" ? "selected-tab" : "idle-tab"} onClick={(e)=>changeLeftState(e, "data-layers")}>Map layers</div>
                <div className={leftPanelState=="vegetation" ? "selected-tab" : "idle-tab"} onClick={(e)=>changeLeftState(e, "vegetation")}>Ecosystem survey tools</div>
            </div>
            <div className="left-body">
                {selectPanelView(leftPanelState)}
            </div>
        </div>
    ) 
}
