import "./panelcontainer.css";
import {React, useState, useRef, useEffect} from 'react';
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
    const changeLeftState = (e, val) =>{
        let selected =document.querySelector(".selected-left")
        selected.className = ""
        e.target.className = "selected-left"
        if ((selectedIdRef.current !== null) && map.current) {
            map.current.setFeatureState(
                { source: selectedIdRef.layerId, id: selectedIdRef.current},
                { selected: false }
            );
            selectedIdRef.current = null
        }
        if (val != "vegetation"){
            setRightPanelState("closed")
        }
        setLeftPanelState(val)
        leftStateRef.current = val
    }

    const changeRightState = (e, val) =>{
        let selected =document.querySelector(".selected-right")
        selected.className =""
        e.target.className = "selected-right"
        if ((selectedIdRef.current !== null) && map.current) {
            map.current.setFeatureState(
                { source: selectedIdRef.layerId, id: selectedIdRef.current},
                { selected: false }
            );
            selectedIdRef.current = null
        }        
        let x = val
        setRightPanelState(x)
    }

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
            fetch("https://google.com/"+GOOGLE_SCRIPT_ID+"/exec", {
                method: "GET",
                headers: {
                  "Accept": "application/json"
                }
            })
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
            (plantProfiles) ? 
            <>
            <div className='tab-container'>
                <div className='header-panel'>
                    <div className="selected-left" onClick={(e)=>changeLeftState(e, "data-layers")}>Data layers</div>
                    <div onClick={(e)=>changeLeftState(e, "vegetation")}>Ecosystem surveys</div>
                    {/* <div onClick={(e)=>showFeaturedSites()}>Featured sites</div> */}
                </div>
                <div className="website-title">Bronx River Watershed Explorer</div>
                <div className='header-panel'>
                    <div  className="selected-right" onClick={(e)=>changeRightState(e, "plant-profiles")}>Plant profiles</div>
                    <div onClick={(e)=>changeRightState("plant-profiles")}>Glossary</div>
                </div>
                {/* <button onClick={(e)=>changeLeftState("data-layers")}>Select data layers</button>
                <button onClick={(e)=>changeLeftState("vegetation")}>Explore ecosystem surveys</button>
                <button onClick={(e)=>showFeaturedSites()}>View restoration cores</button>
                <button onClick={(e)=>changeRightState("plant-profiles")}>Read plant profiles</button> */}
            </div>           
            {(leftPanelState != "closed") && <LeftPanel leftPanelState={leftPanelState} setSiteData={setSiteData} setRightPanelState={setRightPanelState} map={mapInstance} plantProfiles={plantProfiles} mapLayers={mapLayers}/>}
            {(rightPanelState != "closed") && <RightPanel rightPanelState={rightPanelState} setRightPanelState={setRightPanelState} siteData={siteData} map={mapInstance} plantProfiles={plantProfiles} selectedPlant={selectedPlant} setSelectedPlant={setSelectedPlant}/>}
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
