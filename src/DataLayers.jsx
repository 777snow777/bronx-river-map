import "./panelcontainer.css";
import React, { useState, useCallback, useEffect } from 'react';
import ToggleCategory from "./Category";

export default function DataLayers({map, mapLayers}) {  
    useEffect(() => {
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
                    <ToggleCategory key={index} category={category} map={map}/>
                ))}
            </div>
            {/* <div className="applied-layers">
                <h2 className="heading">Map Legend</h2>
            </div> */}

        </div>
        
      ); 
}