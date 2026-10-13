import "./panelcontainer.css";
import React, {useEffect, useState} from 'react';
import RSAPlantSpecies from "./RSAPlantSpecies";
import { Popup } from 'maplibre-gl';

const commonRSAPlants = [
    { common: "Wild Black Cherry", scientific: "Prunus serotina" },
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
    { common: "Blackhaw", scientific: "Viburnum prunifolium" },
    { common: "Northern spicebush", scientific: "Lindera benzoin" },
    { common: "Amur honeysuckle", scientific: "Lonicera maackii" },
    { common: "Sycamore maple", scientific: "Acer pseudoplatanus" },
    { common: "Sweet pepperbush", scientific: "Clethra alnifolia" },
    { common: "Linden arrowwood", scientific: "Viburnum dilatatum" },
    { common: "White mulberry", scientific: "Morus alba" },
    { common: "Norway maple", scientific: "Acer platanoides" }
  ];

let commonMidstoryPlants = [
  { common: "Wild Black Cherry", scientific: "Prunus serotina" },
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
    { common: "Wild Black Cherry", scientific: "Prunus serotina" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "Southern arrowwood", scientific: "Viburnum dentatum" },
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "Red maple", scientific: "Acer rubrum" },
    { common: "Sweet pepperbush", scientific: "Clethra alnifolia" },
    { common: "Northern spicebush", scientific: "Lindera benzoin" },
    { common: "Japanese angelica tree", scientific: "Aralia elata" },
    { common: "American beech", scientific: "Fagus grandifolia" }
  ];
let commonOverstory1Plants = [
    { common: "Wild Black Cherry", scientific: "Prunus serotina" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "American beech", scientific: "Fagus grandifolia" },
    { common: "Red maple", scientific: "Acer rubrum" },
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "Silver maple", scientific: "Acer saccharinum" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "Sycamore maple", scientific: "Acer pseudoplatanus" },
    { common: "Boxelder maple", scientific: "Acer negundo" },
    { common: "European alder", scientific: "Alnus glutinosa" }
  ];

  let commonOverstory2Plants = [
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "Wild Black Cherry", scientific: "Prunus serotina" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "Red maple", scientific: "Acer rubrum" },
    { common: "Boxelder maple", scientific: "Acer negundo" },
    { common: "Pin oak", scientific: "Quercus palustris" },
    { common: "Norway maple", scientific: "Acer platanoides" },
    { common: "Silver maple", scientific: "Acer saccharinum" },
    { common: "White oak", scientific: "Quercus alba" }
  ];

  let commonOverstory3Plants = [
    { common: "Northern red oak", scientific: "Quercus rubra" },
    { common: "American sweetgum", scientific: "Liquidambar styraciflua" },
    { common: "Green ash", scientific: "Fraxinus pennsylvanica" },
    { common: "White oak", scientific: "Quercus alba" },
    { common: "Wild Black Cherry", scientific: "Prunus serotina" },
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
    { common: "Pin oak", scientific: "Quercus palustris" },
    { common: "Silver maple", scientific: "Acer saccharinum" },
    { common: "American beech", scientific: "Fagus grandifolia" },
    { common: "Black cherry", scientific: "Prunus serotina" }
  ];
  const classColors = {
    'Native': '#32a852',
    'Invasive': '#d42632',
    'Naturalized': '#f2a413',
};
export default function RSAPlantExplorer({map, plantProfiles}) {
    const [visibilityDict, setVisibilityDict] = useState({})
    const [commonRSALayerData, setCommonRSALayerData] = useState(null);
    const [selectedCanopy, setSelectedCanopy] = useState("all");
    const [sorted, setSorted] = useState(false)
    const [selectedPlantList, setSelectedPlantList] = useState(commonRSAPlants);
    let [coverage, setCoverage] = useState({})
    const popup = new Popup({
        closeButton: false,
        closeOnClick: false,
    });
    
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += value.toString(16).padStart(2, '0');
        }
        return color;
    }
    const handleDropdownChange = (event) => {
        const value = event.target.value;
        setSelectedCanopy(value)
        console.log(value)
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
        console.log(selectedPlantList)
        updatePlantData()
    };

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
        setVisibilityDict(visibility)
    }

    useEffect(()=>{
        updatePlantData()
    },[selectedPlantList])

    function sortSpecies(){
        let nextState = !sorted
        setSorted(nextState)
    }

    return(
        <div className="plant-explorer">
            <div className="heading">
                Explore biodiversity
            </div>
            <div className="data-description">
                <div>The list below includes the most common species at the selected canopy level. Select a species to view its distribution across different canopy levels.</div>
            </div>
            <div className="canopy-list-container">
                <div className="filter-option">
                    <select id="canopyLevel" className="canopy-level" name="canopyLevel" value={selectedCanopy} onChange={handleDropdownChange}>
                            <option value="all">All Canopy Levels</option>
                            <option value="seedling">Seedlings</option>
                            <option value="midstory">Midstory Canopy(2 - 9cm DBH)</option>
                            <option value="overstory1">Overstory Canopy (10-30cm DBH)</option>
                            <option value="overstory2">Overstory Canopy (31-50cm DBH)</option>
                            <option value="overstory3">Overstory Canopy (51-75cm DBH)</option>
                            <option value="overstory4">Overstory Canopy(&gt;75cm DBH)</option>
                    </select>
                </div>
                <div className="sort-native">
                    <input type="checkbox" onClick={sortSpecies}/>
                    <div className="sort-options">Sort by Native <div className="sort-color" style={{backgroundColor: classColors["Native"]}}></div>/ Invasive  <div className="sort-color" style={{backgroundColor: classColors["Invasive"]}}></div>/ Naturalized <div className="sort-color" style={{backgroundColor: classColors["Naturalized"]}}></div></div>
                </div>
                {selectedPlantList && commonRSALayerData &&
                    <div className="list-container">   
                        <div className="canopy-plants">
                            {commonRSALayerData && Object.entries(commonRSALayerData).map(([plantName, data]) => (
                                <RSAPlantSpecies key={data.layerId} map={map} plantData={data} color={(sorted === true) ? classColors[data.category] : stringToColor(plantName.toUpperCase())} visibilityDict={visibilityDict} setVisibilityDict={setVisibilityDict} selectedCanopy={selectedCanopy} setCoverage={setCoverage} coverage={coverage}/> 
                            ))} 
                        </div>
                    </div>
                }   
            </div>             
        </div>
            
    )
   
        
}