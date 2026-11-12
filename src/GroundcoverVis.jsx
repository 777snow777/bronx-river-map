import React, { useEffect, useState } from 'react';
const classes = ["Native", "Invasive", "Naturalized", "Unclassified"]
const classColors = {
    'Native': '#32a852',
    'Invasive': '#d42632',
    'Naturalized': '#f2a413',
    'Unclassified': "#abb8b6"
};
let FEATURE_MAX = 4

export default function GroundcoverVis({siteSpecies, title, siteID}) {
    const [allSpecies, setAllSpecies] = useState(null)
    const [selectedPlants, setSelectedPlants] = useState(null)
    // .sort((a, b) => (a.common > b.common ? 1 : -1)); 
 

    useEffect(()=>{
        let sorted = [...siteSpecies].sort((a,b) => b.range_max - a.range_max)
        setSelectedPlants(sorted.slice(0, FEATURE_MAX))
        setAllSpecies(sorted)
    }, [siteSpecies])

    function toggleSpeciesList(e){
        let size = allSpecies.length
        if (selectedPlants.length < size){
            setSelectedPlants(allSpecies)
            e.target.innerHTML="- Hide full species list"
        }else{
            setSelectedPlants(selectedPlants.slice(0, FEATURE_MAX)) 
            e.target.innerHTML="+ View full species list"
        }

    }

    return (
        <div className="groundcover section-container">
            <div className="legend-heading">Coverage by Species:</div>
            <div className="category-legend">
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: classColors["Native"]}}></div>
                    <div className="legend-label">Native</div>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: classColors["Invasive"]}}></div>
                    <div className="legend-label">Invasive</div>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: classColors["Naturalized"]}}></div>
                    <div className="legend-label">Naturalized</div>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: classColors["Unclassified"]}}></div>
                    <div className="legend-label">Unknown</div>
                </div>
            </div>
            {selectedPlants && 
            <div className="groundcover-list">
                {selectedPlants.map((plant,index)=>
                    <div key={index} className="groundcover-plant">
                        <div className="groundcover-text">{plant.common}</div>
                        <div className="groundcover-vis">
                            <div className="plant-blob">
                                <div className="plant-blob-min" style={{backgroundColor: classColors[plant.category], width: plant.range_max+"%", height: "15px"}}></div>
                                <div className="plant-blob-max" style={{backgroundColor: classColors[plant.category], width: plant.range_min+"%", height: "15px"}}></div>
                            </div>
                            <div className="groundcover-perc">{plant.SiteSpeciesPercent}%</div>
                        </div>
                    </div>
                )}
                {(allSpecies.length > FEATURE_MAX) && <div className="toggle-list" onClick={toggleSpeciesList}>+ View full species list</div>}
            </div>
            }
        </div>
      );
}