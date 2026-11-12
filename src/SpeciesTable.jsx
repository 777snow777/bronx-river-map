import "./panelcontainer.css";
import React, {useEffect, useState, useRef} from 'react';
import RSAPlantSpecies from "./RSAPlantSpecies";
import { CanopyContext } from "./CanopyContext";

const commonRSAPlants = [
    { common: "Black Cherry", scientific: "Prunus serotina" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "American witchhazel", scientific: "Hamamelis virginiana" },
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "American beech", scientific: "Fagus grandifolia" },
    { common: "Red maple", scientific: "Acer rubrum" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "Silver maple", scientific: "Acer saccharinum" },
    { common: "Japanese angelica tree", scientific: "Aralia elata" },
    { common: "Southern arrowwood", scientific: "Viburnum dentatum" },
    { common: "Boxelder maple", scientific: "Acer negundo" },
    { common: "Amur cork tree", scientific: "Phellodendron amurense" },
    { common: "Black haw", scientific: "Viburnum prunifolium" },
    { common: "Northern spicebush", scientific: "Lindera benzoin" },
    { common: "Amur honeysuckle", scientific: "Lonicera maackii" },
    { common: "Sycamore maple", scientific: "Acer pseudoplatanus" }
  ];

let commonMidstoryPlants = [
  { common: "Black Cherry", scientific: "Prunus serotina" },
  { common: "American witchhazel", scientific: "Hamamelis virginiana" },
  { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
  { common: "Japanese angelica tree", scientific: "Aralia elata" },
  { common: "American beech", scientific: "Fagus grandifolia" },
  { common: "Red maple", scientific: "Acer rubrum" },
  { common: "Silver maple", scientific: "Acer saccharinum" },
  { common: "Southern arrowwood", scientific: "Viburnum dentatum" },
  { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
  { common: "Amur corktree", scientific: "Phellodendron amurense" }
];

let commonSeedlingPlants = [
    { common: "Black Cherry", scientific: "Prunus serotina" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "Southern arrowwood", scientific: "Viburnum dentatum" },
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "Red maple", scientific: "Acer rubrum" },
    { common: "Sweet pepperbush", scientific: "Clethra alnifolia" },
    { common: "Amur honeysuckle", scientific: "Lonicera maackii" },
    { common: "American beech", scientific: "Fagus grandifolia" },
    { common: "Silver maple", scientific: "Acer saccharinum" }
  ];
let commonOverstory1Plants = [
    { common: "Black Cherry", scientific: "Prunus serotina" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "American beech", scientific: "Fagus grandifolia" },
    { common: "Red maple", scientific: "Acer rubrum" },
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "Silver maple", scientific: "Acer saccharinum" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "Sycamore maple", scientific: "Acer pseudoplatanus" },
    { common: "Boxelder maple", scientific: "Acer negundo" },
    { common: "Black alder", scientific: "Alnus glutinosa" }
  ];

  let commonOverstory2Plants = [
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "Black Cherry", scientific: "Prunus serotina" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "Red maple", scientific: "Acer rubrum" },
    { common: "Boxelder maple", scientific: "Acer negundo" },
    { common: "Pin oak", scientific: "Quercus palustris" },
    { common: "Norway maple", scientific: "Acer platanoides" },
    { common: "Silver maple", scientific: "Acer saccharinum" },
    { common: "Black gum", scientific: "Nyssa sylvatica" }
  ];

  let commonOverstory3Plants = [
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "White oak", scientific: "Quercus alba" },
    { common: "Black Cherry", scientific: "Prunus serotina" },
    { common: "Red maple", scientific: "Acer rubrum" },
    { common: "Pin oak", scientific: "Quercus palustris" },
    { common: "Black oak", scientific: "Quercus velutina" },
    { common: "Silver maple", scientific: "Acer saccharinum" },
    { common: "Tulip poplar", scientific: "Liriodendron tulipifera" }
  ];

  let commonOverstory4Plants = [
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "White oak", scientific: "Quercus alba" },
    { common: "Tulip poplar", scientific: "Liriodendron tulipifera" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "Red maple", scientific: "Acer rubrum" },
    { common: "Pin oak", scientific: "Quercus palustris" }
  ];

  let commonGroundcover = [
    { common: "Japanese knotweed", scientific: "Polygonum cuspidatum" },
    { common: "White wood aster", scientific: "Eurybia divaricata" },
    { common: "Eastern poison ivy", scientific: "Toxicodendron radicans" },
    { common: "Roundleaf greenbrier", scientific: "Smilax rotundifolia" },
    { common: "Virginia creeper", scientific: "Parthenocissus quinquefolia" },
    { common: "Porcelain berry", scientific: "Ampelopsis brevipedunculata" },
    { common: "Jewelweed ", scientific: "Impatiens capensis" },
    { common: "Stinging nettle", scientific: "Urtica dioica" },
    { common: "Bittersweet", scientific: "Celastrus orbiculatus" }
  ]

const classColors = {
    'Native': '#32a852',
    'Invasive': '#d42632',
    'Naturalized': '#f2a413',
};

const statusColors = {
    'Facultative Wetland': 'rgb(81 92 167)',
    'Facultative': 'rgb(220 98 31)',
    'Facultative Upland': "rgb(166 81 167)",
    'Upland': 'rgb(163, 199, 74)',
    "Unclassified" : "#aaaaaa"
};

export default function SpeciesTable({map, plantProfiles}) {
    const [visibilityDict, setVisibilityDict] = useState({})
    const visibilityRef = useRef(visibilityDict)
    const [commonRSALayerData, setCommonRSALayerData] = useState(null);
    const [selectedCanopy, setSelectedCanopy] = useState("all");
    const [selectedSort, setSelectedSort] = useState("species-sort")
    const [selectedPlantList, setSelectedPlantList] = useState(commonRSAPlants);
    let [coverage, setCoverage] = useState({})
    
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = 0.85*str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += value.toString(16).padStart(2, '0');
        }
        return color;
    }
    const handleCanopyChange = (event) => {
        const value = event.target.value;
        setSelectedCanopy(value)
        switch (value){
            case "all":
                setSelectedPlantList(commonRSAPlants)
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
                setSelectedPlantList(commonRSAPlants)  
                break        
        }
        updatePlantData()
    };

    const handleSortChange = (event) => {
        setSelectedSort(event.target.value)
    }

    const updatePlantData = ()=>{
        let visibility={}
        if (!map) return
        let plants = []
        selectedPlantList.forEach((plant) =>{
            let layerId = plant.scientific.split(" ").join("-")+"-rsa"+"-"+selectedCanopy
            let layerData = plantProfiles[plant.scientific]
            layerData["layerId"] = layerId 
            plants[plant.scientific]=layerData
            visibility[layerId]=false
        })  
        setCommonRSALayerData(plants) 
        visibilityRef.current
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
    },[selectedPlantList, selectedSort])

    return(
        <div className="canopy-list-container">
            <div className="rsa-ctrls">
                <div className="filter-option">
                        <div className="filter-heading">Canopy Level</div>
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
                <div className="filter-option">
                    <div className="filter-heading">Highlight</div>
                    <div className="sort-options">
                        <div className="sort-option">
                            <input checked={selectedSort === 'species-sort'}  id="species-sort" type="radio" className="selected-sort" name="species-sort" value={"species-sort"} onChange={handleSortChange}></input>
                            <label htmlFor="species-sort">Species Name</label>
                        </div>
                        <div className="sort-option">
                            <input checked={selectedSort === 'class-sort'} type="radio" id="class-sort" className="selected-sort" name="class-sort" value={"class-sort"} onChange={handleSortChange}></input>
                            <label htmlFor="class-sort">Native / Invasive / Naturalized status</label>
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
                                <div className="key-item"><div className="color" style={{backgroundColor: statusColors["Unclassified"]}}></div><div>Unclassified</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {selectedPlantList && commonRSALayerData &&
                <div className="list-container">   
                    <div className="canopy-plants">
                    <CanopyContext.Provider value={{ map, selectedCanopy, coverage, setCoverage }}>
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

