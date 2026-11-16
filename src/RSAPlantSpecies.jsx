import React, {useEffect, useContext} from 'react';
import { CanopyContext } from "./CanopyContext";
import './panelcontainer.css';
import Papa from "papaparse";
let woodyFn = "rsa_site_woody.csv" 
let groundFn = "rsa_site_ground.csv" 

export default function RSAPlantSpecies({plantData, visibilityDict, setVisibilityDict, visibilityRef, color}){  
    const { map, selectedCanopy, coverage, setCoverage } = useContext(CanopyContext);
    const getCoverageProperty = () =>{
        switch (selectedCanopy){
            case "seedling":
                return "SeedlingCoverage"
            case "midstory":
                return "MidstoryCoverage"
            case "overstory1":
                return "Overstory_1_Coverage"
            case "groundcover":
                return "range_max"
            default:
                return "PlantCoverage"
        }
    }

    const generateCoverageLayer = (plantObs, selectedLayerID) =>{
        const plantCoverage = {}; 
        let coverageProperty = getCoverageProperty()
        plantObs.forEach(row => {
            const siteID = (row['SurveyID4'] != "SOUNDVIEW") ? row['SurveyID4']?.slice(0,12).trim() : "SOUNDVIEW"
            const val = parseFloat(row[coverageProperty]); 
            if (siteID && !isNaN(val)) plantCoverage[siteID] = val;
        });
        const matchExpression = ['match', ['get', 'SITE_ID']];
        let siteCoverage = coverage
        Object.keys(plantCoverage).forEach(siteId => {
            const percentage = plantCoverage[siteId];
            matchExpression.push(siteId, percentage);  
            if (!siteCoverage[siteId]){
                siteCoverage[siteId]={}
            }
            siteCoverage[siteId][plantData.scientific]= percentage      
        })
        setCoverage(siteCoverage)
        matchExpression.push(0);
        if (!map.getLayer(plantData.layerId)){
            map.addLayer({
                'id': selectedLayerID,
                'type': 'fill',
                'source': 'rsa-sites-src',
                'layout': {
                    'visibility': 'none'
                },
                paint: {
                    'fill-color': color,
                    'fill-opacity': [
                    'interpolate',
                    ['linear'],
                    matchExpression, 
                    0, 0.0, 
                    10, 0.3,  
                    30, 0.6,
                    80, 0.9,
                    100, 1
                    ],
                    'fill-outline-color': '#000000',
            }
            });
        } 
    }

    const highlightRange = () =>{
        if (visibilityDict[plantData.layerId] != true){
            map.setLayoutProperty(
                plantData.layerId,
                'visibility', 'visible'
            );
        }
    }
    
    const removeHighlight = () =>{
        if (visibilityDict[plantData.layerId] != true){
            map.setLayoutProperty(
                plantData.layerId,
                'visibility', "none"
            );
        }
    }

    const togglePlantObs = () => {
        if (!map) return;
        const nextState = !visibilityDict[plantData.layerId];
        setVisibilityDict((prevDictionary) => {
           const next ={
            ...prevDictionary, 
            [plantData.layerId]: nextState 
            } 
            visibilityRef.current = next
            return next
        });
        map.setLayoutProperty(
            plantData.layerId,
            'visibility',
            nextState ? 'visible' : 'none'
        );
        return
    };

    useEffect(()=>{
        if (!map) return;
        if (!map.getLayer(plantData.layerId)){
            let rsaFn = (selectedCanopy == "groundcover") ?  groundFn : woodyFn
            Papa.parse(rsaFn, {
                download: true,
                delimiter: ",",
                header: true,        
                complete: function (results) {
                    let plantObs = results.data.filter((row)=> row.scientific == plantData.Scientific)
                    generateCoverageLayer(plantObs, plantData.layerId)
                },
                    error: function (error) {
                    console.error("Error parsing CSV:", error);
                }
            })
        }else{
            map.setLayoutProperty(
                plantData.layerId,
                'visibility',
                visibilityDict[plantData.layerId] ? 'visible' : 'none'
              );
            map.setPaintProperty(
                plantData.layerId, 
                'fill-color', color);
        }
        
    },[visibilityDict, selectedCanopy, coverage, color])

    return(
        <div className={visibilityDict[plantData.layerId] ? "selected-plant-ctrl" : "plant-ctrl" } onClick={togglePlantObs} onMouseEnter={highlightRange} onMouseLeave={removeHighlight}>
            <div className="plant-name"><div className='common'>{plantData.Common}</div></div>
            <div className="plant-color" style={{backgroundColor: color}}> </div>   
        </div>
    )
}

