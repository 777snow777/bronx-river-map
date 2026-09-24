import React, {useEffect, useState} from 'react';
import PlantProfile from './PlantProfile';
import './panelcontainer.css';
import Papa from "papaparse";

let plantsFn = "featured_inat_plants.csv"
let obsFn = "featured_inat_plants(all obs).csv"

export default function BottomPanel({map, layers}){
    const [parsedObsData, setParsedObsData] = useState([]);
    const [parsedPlantData, setParsedPlantData] = useState([]);

    useEffect(()=>{
        Papa.parse(plantsFn, {
            download: true,
            delimiter: ",",
            header: true,        
            complete: function (results) {
                if (parsedPlantData.length == 0){
                    const shuffled = [...results.data].sort(() => 0.5 - Math.random()).slice(0,7);
                    let plantsList = shuffled.map(row=>row['scientific'])
                    setParsedPlantData(plantsList)
                }
                Papa.parse(obsFn, {
                    download: true,
                    delimiter: ",",
                    header: true,        
                    complete: function (results) {
                        const featuredObs = results.data.filter((row)=> parsedPlantData.includes(row.scientific) )
                        setParsedObsData(featuredObs)
                    },
                    error: function (error) {
                      console.error("Error parsing CSV:", error);
                    }
                  })
            },
            error: function (error) {
              console.error("Error parsing CSV:", error);
            }
            
          });
    }, [parsedPlantData])
    return(
        <div className="bottom">
            <h2>Featured Plants</h2>
                <div className="plant-features">
                    {parsedPlantData.map((plant, index) => (
                        <PlantProfile key={index} plantObsData={parsedObsData.filter((row)=> row.scientific==plant)} map={map}/>
                    ))}
            </div>
           
        </div>
    )
}



