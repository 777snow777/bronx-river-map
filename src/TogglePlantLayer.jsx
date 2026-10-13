import React, { useState } from 'react';
import Papa from "papaparse";
let plantsFn = "rsa_site_obs.csv"

export default function TogglePlantLayer({map, plantName, type}) {
    const [visibility, setVisibility] = useState(false)
    let arr = plantName.split(" ")
    let id = 'rsa-plant'+arr.join("-")
    const togglePlantLayer = () => {
        if (!map) return;
        const nextState = !visibility;
        setVisibility(nextState)
        if (!nextState || (plantLayerIDs.includes(id))){
            map.setLayoutProperty(
                id,
                'visibility',
                 'none' 
            );
            return
        }
        }
    return (
        <div className='plant-toggle' >
          <label key={id} style={{ fontSize: '0.8em', display: 'block', marginBottom: '2px' }}>
            <input
              type="checkbox"
              checked={visibility}
              onChange={() => togglePlantLayer()}
            />
            {plantName}
          </label>
        </div>
      );
}