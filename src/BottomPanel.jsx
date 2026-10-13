import React, {useEffect, useState} from 'react';
import './panelcontainer.css';
import Papa from "papaparse";
import FeaturePlant from "./FeaturePlant"
import PlantProfile from './PlantProfile';
let plantsFn = "featured_inat_plants.csv" 

export default function BottomPanel({map, layers, plantProfiles}){
    const [parsedObsData, setParsedObsData] = useState([]);
    const [parsedPlantData, setParsedPlantData] = useState([]);
    // const [selectedPlant, setSelectedPlant] = useState("Prunus Serotina")

    useEffect(()=>{
        Papa.parse(plantsFn, {
            download: true,
            delimiter: ",",
            header: true,        
            complete: function (results) {
                if (parsedPlantData.length == 0){
                    //NEED TO UPDATE TO USE PLANT PROFILES WHICH WILL CONTAIN IMAGES, SELECT RANDOM INDICES 
                    const shuffled = [...results.data].sort(() => 0.5 - Math.random()).slice(0,7);
                    // let plantsList = shuffled.map(row=>row['common'])
                    setParsedPlantData(shuffled)
                }
            },
            error: function (error) {
              console.error("Error parsing CSV:", error);
            }
            
          });
    }, [parsedPlantData])
    return(
        <div className="bottom">
            <h2>Common Watershed Plants</h2>
                <div className="plant-features">
                    {parsedPlantData.map((plant, index) => (
                        <FeaturePlant key={index} images={plant["images"]} plantData={plantProfiles[plant.scientific]} map={map}/>
                    ))}
            </div>
           
        </div>
    )
}



