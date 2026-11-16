import { wetlandPlants, classColors } from "./RsaSpecies";
import React, {useState, useEffect} from 'react';
let groundFn = "rsa_site_ground.csv" 
import Papa from "papaparse";

export default function WetlandPlantFinder({map}){
    const [plantList, setPlantList] = useState(wetlandPlants)
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedPlant, setSelectedPlant] = useState(wetlandPlants[0].scientific)
    function handleStatusChange(event){
        let val = event.target.value
        let plants = wetlandPlants
        if(val == "obg"){
            plants = wetlandPlants.filter((plant)=>plant.status=="Obligate")
        }else if(val == "facw"){
            plants = wetlandPlants.filter((plant)=>plant.status=="Facultative Wetland")
        }
        setPlantList(plants)
        setSelectedPlant(plants[0].scientific)
        setSelectedStatus(val)
        updateLocations(plants[0])
    }

    function updateLocations(plant){
        Papa.parse(groundFn, {
            download: true,
            delimiter: ",",
            header: true,        
            complete: function (results) {
                let plantObs = results.data.filter((row)=> row.scientific == plant.scientific)
                let targets = []
                plantObs.forEach(target =>{
                    targets.push(target['SurveyID4'].slice(0,12).trim())
                })
                map.setFilter('wetland-finder', [
                    'in',
                    ['get', 'SITE_ID'],
                    ['literal', targets]
                ]);   
                map.setPaintProperty(
                    "wetland-finder",
                    "line-color",
                    classColors[plant.classification]
                )             
            },
                error: function (error) {
                console.error("Error parsing CSV:", error);
            }
        })
        
    }

    function updatePlantSelection(plant){
        let plantName = plant.scientific
        setSelectedPlant(plantName)
        updateLocations(plant)
    }


    useEffect(()=>{
        if (!map.getLayer("wetland-finder")){
            map.addLayer({
                'id': "wetland-finder",
                'type': 'line',
                'source': 'rsa-sites-src',
                paint: {
                    'line-color': "#000000",
                    'line-opacity': 1,
                    'line-width': 2
                }
            });
        }else{
            map.setLayoutProperty('wetland-finder', 'visibility', 'visible')
        }
        updateLocations(wetlandPlants[0])

        return(()=>{
            map.setLayoutProperty('wetland-finder', 'visibility', 'none')
        })
    }, [])

    return (
        <div className="canopy-list-container">
            <div className="table-title">Wetland Species</div>
            <div className="rsa-ctrls">
                <div className="filter-option">
                        <div className="filter-heading">Wetland Indicator Status</div>
                        <select id="plantGroup" className="plant-group" name="plantGroup" value={selectedStatus} onChange={handleStatusChange}>
                                <option value="all">Obligative & Facultative Wetland</option>
                                <option value="obg">Obligative</option>
                                <option value="facw">Facultative Wetland</option>
                        </select>
                </div>
                <div className="wetland-plants-key">
                    <div className="key-item"><div className="color" style={{backgroundColor: classColors["Native"]}}></div><div>Native</div></div>
                    <div className="key-item"><div className="color" style={{backgroundColor: classColors["Naturalized"]}}></div><div>Naturalized</div></div>
                </div>
            </div>
            <div className="list-container">   
                {plantList.map((plant, index) => (
                    <div className="wetland-plant" key={index} onClick={()=>updatePlantSelection(plant)}>
                        <div>
                            <input type="radio" checked={selectedPlant == plant.scientific} value={plant.scientific} id={plant.scientific.replaceAll(" ", "-")} onChange={()=>updatePlantSelection(plant)}/>
                            <label style={{fontWeight: (selectedPlant == plant.scientific) ? 800 : 400}}>{plant.common}</label> 
                        </div>
                        <div className="plant-color" style={{backgroundColor: classColors[plant.classification]}}> </div>                           
                    </div>
                ))}
            </div>
        </div>
    )
}