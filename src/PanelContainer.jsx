import "./panelcontainer.css";
import {React, useState, useRef, useEffect} from 'react';
import RsaSiteFeature from "./RsaSiteFeature";
import MapComponent from "./Map";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
const GOOGLE_SCRIPT_ID = "AKfycbxRRHjZu-G1Djojo4qWnjgpMqupkDVl3MO3tP_s7aB3PvyirDawmeUCBnvsaQX7wZovHg"
export default function PanelContainer({mapLayers}) {
    const [mapInstance, setMapInstance] = useState(null);
    const [leftPanelState, setLeftPanelState] = useState("data-layers")
    const leftStateRef = useRef(leftPanelState)
    const [siteData, setSiteData] = useState({"type": "all"})
    const [rightPanelState, setRightPanelState] = useState("plant-profiles")
    const [plantProfiles, setPlantProfiles] = useState(null)
    const [selectedPlant, setSelectedPlant] = useState(null)
    const [mapReady, setMapReady] = useState(false)
    let orderedLayers = [...mapLayers].reverse()
    const selectedIdRef = useRef(null);
    const map = useRef(null);

    function showFeaturedSites(){
        leftStateRef.current = "data-layers"
        setLeftPanelState("data-layers")
        mapInstance.setLayoutProperty('rsa-sites', 'visibility', 'none')
        mapInstance.setLayoutProperty('rsa-sites-outline', 'visibility', 'none')
        mapInstance.setLayoutProperty('featured-sites', 'visibility', 'visible')
        mapInstance.setLayoutProperty('featured-sites-outline', 'visibility', 'visible')
    }

    useEffect(()=>{
        if (!plantProfiles){
            fetch(`https://script.google.com/macros/s/AKfycbxRRHjZu-G1Djojo4qWnjgpMqupkDVl3MO3tP_s7aB3PvyirDawmeUCBnvsaQX7wZovHg/exec`)
            .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
            })
            .then((result) => {
                let data = result.data
                let plants = {}
                data.forEach((plant) =>{
                    let scientific = plant["Scientific"]
                    plants[scientific]=plant
                })  
                setPlantProfiles(plants) 
                let mapEl = document.getElementById("map-body")
                if (mapEl){mapEl.style.visibility = "visible"}
            })
            .catch((error) => {
                console.error("Proxy Fetch Error:", error);
            });
        }
        if (selectedPlant != null){
            setRightPanelState("plant-profile")
        }
    },[plantProfiles, selectedPlant])

    return(
        <div className="panel-container"> 
        {
            (plantProfiles) &&( mapReady) ? 
            <>         
            {(leftPanelState != "closed") && <LeftPanel leftPanelState={leftPanelState} rightPanelState={rightPanelState} setLeftPanelState={setLeftPanelState} leftStateRef={leftStateRef} setSiteData={setSiteData} setRightPanelState={setRightPanelState} map={mapInstance} plantProfiles={plantProfiles} mapLayers={mapLayers}/>}
            {(rightPanelState != "closed") && (rightPanelState != "rsa") && <RightPanel rightPanelState={rightPanelState} setRightPanelState={setRightPanelState} map={mapInstance} plantProfiles={plantProfiles} selectedPlant={selectedPlant} setSelectedPlant={setSelectedPlant} selectedIdRef={selectedIdRef}/>}
            {(rightPanelState == "rsa") && <RsaSiteFeature siteData={siteData} map={map} selectedIdRef={selectedIdRef} setRightPanelState={setRightPanelState}/>}
            </>
            :
            <div className = "loading-screen">
                <div className="loader"></div> 
            </div>
        }
            <MapComponent map={map} mapReady={mapReady} leftStateRef={leftStateRef} setMapReady={setMapReady} mapLayers={orderedLayers} setMap={setMapInstance} selectedIdRef={selectedIdRef} setSiteData={setSiteData} setRightPanelState={setRightPanelState}/>
        </div>
        
    ) 
}
