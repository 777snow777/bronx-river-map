import "./panelcontainer.css";
import React, {useEffect, useState} from 'react';
import rsa_layers from "./rsa_layers.json"
import SpeciesTable from "./SpeciesTable";
import PlantVis from "./SelectPlantVis";

let descriptions ={
    "ground-cover": "Herbaceous coverage reflects the percent of canopy at each site embodied by the selected plant group. Darker shading indicates the plant group covers higher percent of the canopy.",
    "woody-hect": "Woody stems per hectare are calculated based on the species observed at each site. Darker shading indicates a higher volume of plants from the selected group.",
    "woody-disp": "The list below displays common woody species within the surveyed ecosystems, ordered by overall occurrance at the selected canopy level."
}

export default function RsaExplorer({map, plantProfiles}) {
    const [selectedType, setSelectedType] = useState("woody-disp")

    function handleTypeChange(event){
        let category = event.target
        let selected = document.querySelector(".selected")
        if (selected.id == category.id){return}
        setSelectedType(category.id)
    }

    useEffect(()=>{
        map.setLayoutProperty('rsa-sites', 'visibility', 'visible')
        map.setLayoutProperty('featured-sites', 'visibility', 'none')
        map.setPaintProperty('featured-sites-outline', 'line-opacity', 0)
        map.setPaintProperty('rsa-sites-outline', 'line-opacity', 1);
    },[])

    return(
        <div className="plant-explorer">
            <div className="explorer-heading">
                <div className="data-description">
                    <div className="explorer-meta" >
                        <div className="explorer-meta-heading" style={{fontWeight: 800}}><span className="expand">-</span> About this data</div>
                        <div className="explorer-meta-body"><p>This data is based on species observations documented by the Natural Areas Conservancy through <a href="https://fic.naturalareasnyc.org/docs/rapid-site-assessment-nyc" style={{color: "#10098f"}}>Rapid Site Assessments</a> conducted between 2018-2021. Survey sites are outlined in black.</p></div>
                    </div>
                    <div className="explorer-meta" >
                        <div className="explorer-meta-heading" style={{fontWeight: 800}}><span className="expand">-</span> Interactions</div>
                        <div className="explorer-meta-body"><p>Explore the surveys through one of the tools options below or select a site on the map to view more about its ecosystem.</p></div>
                    </div>
                </div>
            </div>

            <div className="explorer-body">
                <div id="ground-cover" className={(selectedType=="ground-cover") ? "selected" : "idle"} onClick={(e)=>handleTypeChange(e)}>Herbaceous Coverage</div>
                {(selectedType=="ground-cover") &&
                    <div className="explorer-tool">
                        <div className="desc">{descriptions["ground-cover"]}<br></br></div>
                        <PlantVis map={map} layers={rsa_layers["ground"].layers}/>
                    </div>
                }
        
                <div id="woody-hect" className={(selectedType=="woody-hect") ? "selected" : "idle"} onClick={(e)=>handleTypeChange(e)}>Woody Stems Per Hectare</div>
                {(selectedType=="woody-hect") &&
                    <div className="explorer-tool">
                        <div className="desc">{descriptions["woody-hect"]}<br></br></div>
                        <PlantVis map={map} layers={rsa_layers["woody"].layers}/>
                    </div>
                }

                <div id="woody-disp" className={(selectedType=="woody-disp") ? "selected" : "idle"} onClick={(e)=>handleTypeChange(e)}>Woody Species Dispersion</div>
                {(selectedType=="woody-disp") &&
                    <div className="explorer-tool" >
                        <div className="desc">{descriptions["woody-disp"]}<br></br></div>
                        <SpeciesTable map={map} plantProfiles={plantProfiles}/>    
                    </div>
                }
            </div>
        </div>    
    )
}