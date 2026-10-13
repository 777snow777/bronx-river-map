import React, {use, useEffect, useState} from 'react';
import './panelcontainer.css';
import Papa from "papaparse";
let rsaFn = "rsa_site_obs.csv"

export default function RSAPlantSpecies({map, plantData, visibilityDict, setVisibilityDict, selectedCanopy, setCoverage, coverage, color}){  
    const fillColors = {"Invasive": ["#FF0000", "#FF00BB", "#FF00FB"],"Native": ["#00FF00", "#00FFBB", "#00FFFB"], "Naturalized": ["#FFFF00", "#FFFFBB", "#FFFFFB"] }

    const getCoverageProperty = () =>{
        switch (selectedCanopy){
            case "seedling":
                return "SeedlingCoverage"
            case "midstory":
                return "MidstoryCoverage"
            case "overstory1":
                return "Overstory_1_Coverage"
            default:
                return "PlantCoverage"
        }
    }

    const generatePlantCoverageLayer = (plantObs, selectedLayerID) =>{
        const plantCoverage = {}; 
        let coverageProperty = getCoverageProperty()
        plantObs.forEach(row => {
            const siteID = row['SurveyID4']?.slice(0,12).trim()
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
        setVisibilityDict(prevDictionary => ({
            ...prevDictionary, 
            [plantData.layerId]: nextState  
        }));
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
            Papa.parse(rsaFn, {
                download: true,
                delimiter: ",",
                header: true,        
                complete: function (results) {
                    let plantObs = results.data.filter((row)=> row.scientific == plantData.scientific)
                    generatePlantCoverageLayer(plantObs, plantData.layerId)
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
        <div className = "plant-ctrl" onMouseEnter={highlightRange} onMouseLeave={removeHighlight}>
            <div className="plant-label">
                <input type="checkbox" name={plantData.layerId} checked={visibilityDict[plantData.layerId]} onChange={togglePlantObs}/>
                <div className="plant-name"><div className='common'>{plantData.common}</div> <div className="scientific">{plantData.scientific}</div></div>
            </div>
            <div className="plant-color" style={{backgroundColor: color}}> </div>
        </div>
    )
}