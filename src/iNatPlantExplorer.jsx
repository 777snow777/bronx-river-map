import TogglePlantLayer from "./TogglePlantLayer";
import React, {useEffect, useState} from 'react';
import PlantSpecies from './PlantSpecies';
import './panelcontainer.css';
import Papa from "papaparse";

let plantsFn = "featured_inat_plants.csv"
export default function INatPlantExplorer({map}){
    const [visibilityDict, setVisibilityDict] = useState({})
    const [commonPlantData, setCommonPlantData] = useState([]);
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        let color = '#';
        for (let i = 0; i < 3; i++) {
          const value = (hash >> (i * 8)) & 0xFF;
          color += ('00' + value.toString(16)).slice(-2);
        }
        return color;
    }
        
    useEffect(()=>{
        if (!map) return
        Papa.parse(plantsFn, {
            download: true,
            delimiter: ",",
            header: true,        
            complete: function (results) {
                let inatPlants = results.data.filter((row)=>row.layer_type!="rsa")
                console.log(inatPlants)
                let plantData = []
                inatPlants.forEach((row, index) =>{
                    row.images = row.images.split(',')
                    let layerId = row.scientific.split(" ").join("-")+"-inat"
                    row.color = stringToColor(row.scientific.toUpperCase())
                    let layerData = {'scientific': row.scientific, "common": row.common, "layerId": layerId, "color": row.color}
                    setVisibilityDict(prevDictionary => ({
                        ...prevDictionary, 
                        [layerId]: false  
                    }));
                    if (!map.getLayer(layerId)) {
                        map.addLayer({
                            'id': layerId,
                            'type': 'circle',
                            'source': 'inat-obs',
                            'layout': {
                                'visibility': 'none'
                            },
                            'paint': {
                                'circle-color': row.color,
                                'circle-radius': 3,
                                'circle-stroke-width': 0.5,
                                'circle-stroke-color': '#FFFFFF'
                            },
                            'filter': ['==', ['get', 'scientific'], row.scientific]
                        });
                    }
                    plantData.push(layerData)
                })
                setCommonPlantData(plantData)
                
            },
                error: function (error) {
                console.error("Error parsing CSV:", error);
            }
        })
        
    }, [])

    return(
        <div className="right-panel">
            <div className="heading">Plant Profiles</div>
            <div className="data-description">
                {/* <div>The following species are common throughout the watershed, based on <a href="https://www.inaturalist.org/observations">iNaturalist</a> data collected throughout the watershed.</div> */}
                <div>Select a species to see locations where it has been observed throughout the watershed.</div>
            </div>
            <div className="list-container">
                {commonPlantData.map((plant, index) => (
                    <div key={index} className="inat-plant-container">
                        <PlantSpecies plantData={plant} map={map} visibilityDict={visibilityDict} setVisibilityDict={setVisibilityDict}/>
                    </div>
                ))}
            </div>
           
        </div>
    )
}



