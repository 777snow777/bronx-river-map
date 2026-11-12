import React, {useEffect} from 'react';
import './panelcontainer.css';
const classColors = {
    'Native': '#32a852',
    'Invasive': '#d42632',
    'Naturalized': '#fcaf08',
};
export default function PlantProfiles({map, plantProfiles, setSelectedPlant, setPrevState}){
    let commonNative = Object.values(plantProfiles).filter((plant) => plant.Classification == "Native")
    let commonInvasive = Object.values(plantProfiles).filter((plant) => plant.Classification == "Invasive")
    let commonNaturalized = Object.values(plantProfiles).filter((plant) => plant.Classification == "Naturalized")

    function openPlantProfile(plant){
        setPrevState("plant-profiles")
        setSelectedPlant(plant)
        
    }
    useEffect(()=>{
        if (!map || !plantProfiles) return
        Object.values(plantProfiles).map((data)=> {
            let layerId = data.Scientific.split(" ").join("-")+"-inat"
            if (!map.getLayer(layerId)) {
                map.addLayer({
                    'id': layerId,
                    'type': 'circle',
                    'source': 'inat-obs',
                    'paint': {
                        'circle-color': classColors[data.Classification],
                        'circle-radius': 4,
                        'circle-stroke-width': 0.5,
                        'circle-stroke-color': '#000000',
                        'circle-opacity': 0,
                        'circle-stroke-opacity': 0
                    },
                    'filter': ['==', ['get', 'scientific'], data.Scientific]
                });
            }
        })

    }, [])

    function highlightRange(scientific){
        let layerId = scientific.split(" ").join("-")+"-inat"
        map.setPaintProperty(
            layerId,
            'circle-opacity', 1,
        );
        map.setPaintProperty(
            layerId,
            'circle-stroke-opacity', 1,
        );
    }
    
    function removeHighlight(scientific){
        let layerId = scientific.split(" ").join("-")+"-inat"
        map.setPaintProperty(
            layerId,
            'circle-opacity', 0,
        ); 
        map.setPaintProperty(
            layerId,
            'circle-stroke-opacity', 0
        );
    }

    return(
        <div className="right-panel">
            <div className="data-description">
                {/* <div>The following species are common throughout the watershed, based on <a href="https://www.inaturalist.org/observations">iNaturalist</a> data collected throughout the watershed.</div> */}
                <div>Hover over a species to see locations where it has been observed throughout the watershed.</div>
                <div>Click the species name to read more.</div>

            </div>
            <h3 className="heading">Common Native Species</h3>
            <ul className="plant-list">
                <div></div>
                {Object.values(commonNative).map((plant, index) => (
                    <li key={index} className = "list-plant" onClick={()=>openPlantProfile(plant)} onMouseEnter={()=>highlightRange(plant.Scientific)} onMouseLeave={()=>removeHighlight(plant.Scientific)}>
                        <div className="featured-plant-name">{plant.Common}</div>
                    </li>                
                ))}
            </ul>
            <h3 className="heading">Common Invasive Species</h3>
            <ul className="plant-list">
                {Object.values(commonInvasive).map((plant, index) => (
                    <li key={index} className = "list-plant" onClick={()=>openPlantProfile(plant)} onMouseEnter={()=>highlightRange(plant.Scientific)} onMouseLeave={()=>removeHighlight(plant.Scientific)}>
                        <div className="featured-plant-name">{plant.Common}</div>
                    </li>                
                ))}
            </ul>
            <h3 className="heading">Common Non-native/Naturalized Species</h3>
            <ul className="plant-list"> 
                {Object.values(commonNaturalized).map((plant, index) => (
                    <li key={index} className = "list-plant"onClick={()=>openPlantProfile(plant)} onMouseEnter={()=>highlightRange(plant.Scientific)} onMouseLeave={()=>removeHighlight(plant.Scientific)}>
                        <div className="featured-plant-name">{plant.Common}</div>
                    </li>                
                ))}
            </ul>
        </div>
    )
}



