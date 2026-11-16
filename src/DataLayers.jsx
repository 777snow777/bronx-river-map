import "./panelcontainer.css";
import React, { useEffect } from 'react';
import ToggleCategory from "./Category";
import { renderLayerColor } from "./ToggleLayer";
export default function DataLayers({map, mapLayers, appliedLayers, setAppliedLayers, setRightPanelState}) {  
    useEffect(() => {
        setRightPanelState("plant-profiles")
        if (map.getLayer("rsa-sites")) {
            map.setLayoutProperty('rsa-sites', 'visibility', 'none')
        }
        if (map.getLayer("featured-sites")) {
            map.setLayoutProperty('featured-sites', 'visibility', 'none')
        }
        map.setPaintProperty('rsa-sites-outline', 'line-opacity', 0)
        map.setPaintProperty('featured-sites-outline', 'line-opacity', 0)
    }, []) 
    return (
        <div className="data-layers">
            <div className="all-layers left-container">
                {mapLayers.map((category, index) => (
                    <ToggleCategory key={index} category={category} map={map} appliedLayers={appliedLayers} setAppliedLayers={setAppliedLayers}/>
                ))}
            </div>
            <div className="applied-layers">
                <h2 className="heading">Map Legend</h2>
                {appliedLayers.map((layer, index)=>(
                    renderLayerColor(layer)
                ))

                }
            </div>

        </div>
        
      ); 
}