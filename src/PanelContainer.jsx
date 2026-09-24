import "./panelcontainer.css";
import {React, useState} from 'react';
import LeftPanel from "./LeftPanel";
import MapComponent from "./Map";
import BottomPanel from "./BottomPanel";
import RightPanel from "./RightPanel";
//import bottom panel
export default function PanelContainer({layers}) {
    const [mapInstance, setMapInstance] = useState(null);
    const [rightPanelOpen, setRightPanelOpen] = useState(false)
    const [rightPanelData, setRightPanelData] = useState(null)

    return(
        <div className="panel-container">
            {console.log(rightPanelData)}
            {mapInstance && <LeftPanel map={mapInstance} layers={layers}/>}
            <BottomPanel map={mapInstance} layers={layers}></BottomPanel>
            <MapComponent setMap={setMapInstance} setRightPanelOpen={setRightPanelOpen} setRightPanelData={setRightPanelData}/>
            {rightPanelOpen && <RightPanel data={rightPanelData}></RightPanel>}
        </div>
    )
}
