import "./panelcontainer.css";
import {React, useState, useEffect} from 'react';
import MapComponent from "./Map";
import LeftPanel from "./LeftPanel";
import Papa from "papaparse";
import RightPanel from "./RightPanel";
import BottomPanel from "./BottomPanel";
const plantProfileFn = "profiles_test.csv"

export default function PanelContainer({layers}) {
    const [mapInstance, setMapInstance] = useState(null);
    const [leftPanelState, setLeftPanelState] = useState("explorer")
    const [siteData, setSiteData] = useState({"type": "all"})
    const [rightPanelState, setRightPanelState] = useState("closed")
    const [plantProfiles, setPlantProfiles] = useState(null)

    const changeLeftState = (val) =>{
        setLeftPanelState(val)
    }

    const changeRightState = (val) =>{
        let x = val
        setRightPanelState(x)
    }

    useEffect(()=>{
        Papa.parse(plantProfileFn, {
          download: true,
          delimiter: ",",
          header: true,        
          complete: function (results) {
              let plants = {}
              results.data.forEach((plant) =>{
                  let profile = {'scientific': plant.scientific, 'category': plant.category, "common": plant.common}
                  plants[plant.scientific]=profile
              })  
              setPlantProfiles(plants) 
          },
              error: function (error) {
              console.error("Error parsing CSV:", error);
          }
      })
    },[])

    return(
        <div className="panel-container"> 
            <div className='tab-container'>
                <button onClick={()=>changeLeftState("data-layers")}>Select data layers</button>
                <button onClick={()=>changeLeftState("biodiversity")}>Explore biodiversity</button>
                <button onClick={()=>changeRightState("sites")}>View featured sites</button>
                <button onClick={()=>changeRightState("plant-profiles")}>Explore plant profiles</button>
            </div>           
            {mapInstance && plantProfiles && (leftPanelState != "closed") && <LeftPanel leftPanelState={leftPanelState} map={mapInstance} plantProfiles={plantProfiles}/>}
            {mapInstance && plantProfiles && (rightPanelState != "closed") && <RightPanel rightPanelState={rightPanelState} siteData={siteData} map={mapInstance} plantProfiles={plantProfiles}/>}
            <MapComponent setMap={setMapInstance} setSiteData={setSiteData} setRightPanelState={setRightPanelState}/>
            {/* {mapInstance && plantProfiles && <BottomPanel map={mapInstance} layers={layers} plantProfiles={plantProfiles}/>} */}
        </div>
    ) 
}
