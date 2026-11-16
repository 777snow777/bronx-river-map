import "./panelcontainer.css";
import React, {useEffect, useState, useRef} from 'react';
import RSAPlantSpecies from "./RSAPlantSpecies";
import { CanopyContext } from "./CanopyContext";
import {stringToColor, herbaceousPlants, commonWoodyPlants, commonSeedlingPlants, commonMidstoryPlants, commonOverstory1Plants, commonOverstory2Plants, commonOverstory3Plants, commonOverstory4Plants, classColors, statusColors } from "./RsaSpecies";

export default function SpeciesTable({map, plantProfiles}) {
    const [visibilityDict, setVisibilityDict] = useState({})
    const visibilityRef = useRef(visibilityDict)
    const [commonRSALayerData, setCommonRSALayerData] = useState(null);
    const [selectedCanopy, setSelectedCanopy] = useState("all");
    const [selectedGroup, setSelectedGroup] = useState("woody-group")
    const [selectedSort, setSelectedSort] = useState("species-sort")
    const [selectedPlantList, setSelectedPlantList] = useState(commonWoodyPlants);
    let [coverage, setCoverage] = useState({})
    const handleCanopyChange = (event) => {
        const value = event.target.value;
        setSelectedCanopy(value)
        switch (value){
            case "all":
                setSelectedPlantList(commonWoodyPlants)
                break
            case "seedling":
                setSelectedPlantList(commonSeedlingPlants)
                break
            case "midstory":
                setSelectedPlantList(commonMidstoryPlants)  
                break
            case "overstory1":
                setSelectedPlantList(commonOverstory1Plants)
                break
            case "overstory2":
                setSelectedPlantList(commonOverstory2Plants)
                break
            case "overstory3":
                setSelectedPlantList(commonOverstory3Plants) 
                break
            case "overstory4":
                setSelectedPlantList(commonOverstory4Plants)  
                break  
            default:
                setSelectedPlantList(commonWoodyPlants)  
                break        
        }
        updatePlantData()
    };

    const handleSortChange = (event) => {
        setSelectedSort(event.target.value)
    }

    const handleGroupChange = (event) =>{
        if (event.target.value == "herb-group"){
            setSelectedCanopy("groundcover")
            setSelectedGroup("herb-group")
            setSelectedPlantList(herbaceousPlants)  
        }else{
            setSelectedCanopy("all")
            setSelectedGroup("woody-group")
            setSelectedPlantList(commonWoodyPlants) 
        }
        updatePlantData() 
    }

    const updatePlantData = ()=>{
        let visibility={}
        if (!map) return
        let plants = []
        selectedPlantList.forEach((plant) =>{
            let layerId = plant.split(" ").join("-")+"-rsa"+"-"+selectedCanopy
            let layerData = plantProfiles[plant]
            layerData["layerId"] = layerId 
            plants[plant]=layerData
            visibility[layerId]=false
        })  

        setCommonRSALayerData(plants) 
        visibilityRef.current = visibility
        setVisibilityDict(visibility)
    }

    function getColor(selectedSort, data,plantName){
        if (selectedSort === "class-sort"){
            return classColors[data.Classification]
        }else if (selectedSort === "status-sort"){
            return statusColors[data.Wetland_indicator_status]
        }else{
            return stringToColor(plantName.toUpperCase())
        }
    }

    useEffect(()=>{
        return () =>{
            Object.entries(visibilityRef.current).forEach(([id, val])=>{
                if(val == true){
                    map.setLayoutProperty(
                        id,
                        'visibility', "none"
                    )
                }
            })
        }
    },[])

    useEffect(()=>{
        updatePlantData()
    },[selectedPlantList])

    return(
        <div className="canopy-list-container">
            <div className="table-title">Species Abundance</div>
            <div className="rsa-ctrls">
                <div className="filter-option">
                        <div className="filter-heading">Plant Group</div>
                        <select id="plantGroup" className="plant-group" name="plantGroup" value={selectedGroup} onChange={handleGroupChange}>
                                <option value="woody-group">Woody plants</option>
                                <option value="herb-group">Herbaceous plants</option>
                        </select>
                </div>
                {(selectedGroup == "woody-group") &&
                    <div className="filter-option">
                        <div className="filter-heading">Canopy level</div>
                        <select id="canopyLevel" className="canopy-level" name="canopyLevel" value={selectedCanopy} onChange={handleCanopyChange}>
                                <option value="all">All Levels</option>
                                <option value="seedling">Seedlings</option>
                                <option value="midstory">Midstory (2 - 9cm DBH)</option>
                                <option value="overstory1">Overstory (10-30cm DBH)</option>
                                <option value="overstory2">Overstory (31-50cm DBH)</option>
                                <option value="overstory3">Overstory (51-75cm DBH)</option>
                                <option value="overstory4">Overstory (&gt;75cm DBH)</option>
                        </select>
                    </div>
                }
                <div className="filter-option">
                    <div className="filter-heading">Highlight</div>
                    <div className="sort-options">
                        <div className="sort-option">
                            <input checked={selectedSort === 'species-sort'}  id="species-sort" type="radio" className="selected-sort" name="species-sort" value={"species-sort"} onChange={handleSortChange}></input>
                            <label htmlFor="species-sort">Species Name</label>
                        </div>
                        <div className="sort-option">
                            <input checked={selectedSort === 'class-sort'} type="radio" id="class-sort" className="selected-sort" name="class-sort" value={"class-sort"} onChange={handleSortChange}></input>
                            <label htmlFor="class-sort">Native / Invasive / Naturalized</label>
                            <div id="class-key" className="explorer-key" style={{display: (selectedSort == 'class-sort') ? "block" : "none"}}>
                                <div className="key-item"><div className="color" style={{backgroundColor: classColors["Native"]}}></div><div>Native</div></div>
                                <div className="key-item"><div className="color" style={{backgroundColor: classColors["Invasive"]}}></div><div>Invasive</div></div>
                                <div className="key-item"><div className="color" style={{backgroundColor: classColors["Naturalized"]}}></div><div>Naturalized</div></div>
                            </div>
                        </div>
                        <div className="sort-option">
                            <input checked={selectedSort === 'status-sort'} type="radio" id="status-sort" className="selected-sort" name="status-sort" value={"status-sort"} onChange={handleSortChange}></input>
                            <label htmlFor="status-sort">Wetland Indicator Status</label>
                            <div id="status-key" className="explorer-key" style={{display: (selectedSort == 'status-sort') ? "block" : "none"}}>
                                <div className="key-item"><div className="color" style={{backgroundColor: statusColors["Facultative Wetland"]}}></div><div>Facultative Wetland</div></div>
                                <div className="key-item"><div className="color" style={{backgroundColor: statusColors["Facultative"]}}></div><div>Facultative</div></div>
                                <div className="key-item"><div className="color" style={{backgroundColor: statusColors["Facultative Upland"]}}></div><div>Facultative Upland</div></div>
                                <div className="key-item"><div className="color" style={{backgroundColor: statusColors["Upland"]}}></div><div>Upland</div></div>
                                <div className="key-item"><div className="color" style={{backgroundColor: statusColors["Unknown"]}}></div><div>Unknown</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {selectedPlantList && commonRSALayerData &&
                <div className="list-container">   
                    <div className="canopy-plants">
                    <CanopyContext.Provider value={{ map, selectedCanopy, coverage, setCoverage, plantGroup }}>
                        {commonRSALayerData && Object.entries(commonRSALayerData).map(([plantName, data]) => (
                            <RSAPlantSpecies key={data.layerId} plantData={data} color={getColor(selectedSort, data, plantName)} visibilityDict={visibilityDict} setVisibilityDict={setVisibilityDict} visibilityRef={visibilityRef}/> 
                        ))} 
                    </CanopyContext.Provider>
                    </div>
                </div>
            }   
        </div>                         
    )
}

