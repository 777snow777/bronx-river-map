import "./panelcontainer.css";
import React, {useEffect, useState} from 'react';
import rsa_layers from "./rsa_layers.json"
import SpeciesTable from "./SpeciesTable";
import PlantVis from "./SelectPlantVis";

let descriptions ={
    "ground-cover": "Herbaceous coverage reflects the percent of canopy at each site embodied by the selected plant group. Darker shading indicates the plant group covers higher percent of the canopy.",
    "woody-hect": "Woody stems per hectare are calculated based on the species observed at each site. Darker shading indicates a higher volume of plants from the selected group.",
    "woody-disp": "The list below displays common species within the surveyed ecosystems. \n\n Select a species to see its occurrence throughout the watershed. Woody species occurrence is determined by the species' percent of total stems per site. Herbaceous species occurrence is determined by the percentage of canopy covered by the species per site."
}

export default function RsaExplorer({map, appliedLayers, plantProfiles}) {
    const [selectedType, setSelectedType] = useState("woody-disp")
    const [expandAbout, setExpandAbout] = useState(false)
    const [expandGuide, setExpandGuide] = useState(false)
    const [hide, setHide] = useState(true)
    function handleTypeChange(event){
        let category = event.target
        let selected = document.querySelector(".selected")
        if (selected.id == category.id){return}
        setSelectedType(category.id)
    }

    function toggleAbout(){
        let next = !expandAbout;
        let indicator = document.getElementById("expand-about")
        if (next){
            indicator.innerHTML = "-"
        }else{
            indicator.innerHTML = "+"
        }
        setExpandAbout(next)
    }

    function toggleGuide(){
        let next = !expandGuide;
        let indicator = document.getElementById("expand-guide")
        if (next){
            indicator.innerHTML = "-"
        }else{
            indicator.innerHTML = "+"
        }
        setExpandGuide(next)
    }

    useEffect(()=>{
        appliedLayers.filter((l) => l.id != "boundary").forEach((layer)=>{
            map.setLayoutProperty(layer.id, 'visibility', "none") //Checked = Hide layers
        })  
        map.setLayoutProperty('rsa-sites', 'visibility', 'visible')
        map.setLayoutProperty('featured-sites', 'visibility', 'none')
        map.setPaintProperty('featured-sites-outline', 'line-opacity', 0)
        map.setPaintProperty('rsa-sites-outline', 'line-opacity', 1);
        
        return (()=>{
            if (hide){
                appliedLayers.filter((l) => l.id != "boundary").forEach((layer)=>{
                    map.setLayoutProperty(layer.id, 'visibility', "visible")
                })
            }
        })
    },[])

    function toggleLayers(){
        let next = !hide
        appliedLayers.forEach((layer)=>{
            map.setLayoutProperty(layer.id, 'visibility', next ? "none" : "visible") //Checked = Hide layers
        })  
        setHide(next)
    }

    return(
        <div className="plant-explorer">
            <div className="explorer-heading">
                <div className="data-description">
                    <div className="explorer-meta" >
                        <div className="explorer-meta-heading" style={{fontWeight: 800}}  onClick={toggleAbout}><span id="expand-about">+</span> About the data</div>
                        <div className="explorer-meta-body" style={{display: (expandAbout == true) ? "block": "none"}}><p>Between 2018-2021, the Natural Areas Conservancy surveyed the ecology at different locations within the watershed. Read more about the methodology applied in these survey <a href="https://fic.naturalareasnyc.org/docs/rapid-site-assessment-nyc" style={{color: "#10098f"}}>here</a></p></div>
                    </div>
                    <div className="explorer-meta" >
                        <div className="explorer-meta-heading" style={{fontWeight: 800}}  onClick={toggleGuide}><span id="expand-guide">+</span> How to use</div>
                        <div className="explorer-meta-body" style={{display: (expandGuide == true) ? "block": "none"}}><p>Select one of the survey sites (outlined in black) on the map to view the ecology of a specific location. Expand one of the tools below to assess the survey results across the watershed.</p></div>
                    </div>
                </div>
            </div>
            <div className="explorer-body">
                <div id="ground-cover" className={(selectedType=="ground-cover") ? "selected" : "idle"} onClick={(e)=>handleTypeChange(e)}>Herbaceous Coverage</div>
                {(selectedType=="ground-cover") &&
                    <div className="explorer-tool">
                        <div className="toggle-layers">
                                <div className="custom-checkbox">
                                    <label className="control control--checkbox">
                                        <input type="checkbox" checked={hide} onChange={toggleLayers}/>                        
                                        <div className="control__indicator"></div>
                                    </label>
                                </div>
                                <div className="checkbox-label">Hide map layers</div>
                        </div>
                        <div className="desc">{descriptions["ground-cover"]}<br></br></div>
                        <PlantVis map={map} layers={rsa_layers["ground"].layers}/>
                    </div>
                }
                <div id="woody-hect" className={(selectedType=="woody-hect") ? "selected" : "idle"} onClick={(e)=>handleTypeChange(e)}>Woody Stems Per Hectare</div>
                {(selectedType=="woody-hect") &&
                    <div className="explorer-tool">
                        <div className="toggle-layers">
                            <div className="custom-checkbox">
                                <label className="control control--checkbox">
                                    <input type="checkbox" checked={hide} onChange={toggleLayers}/>                        
                                    <div className="control__indicator"></div>
                                </label>
                            </div>
                            <div className="checkbox-label">Hide map layers</div>
                        </div>
                        <div className="desc">{descriptions["woody-hect"]}<br></br></div>
                        <PlantVis map={map} layers={rsa_layers["woody"].layers}/>
                    </div>
                }
                {/* <div id="wetland-loc" className={(selectedType=="wetland-loc") ? "selected" : "idle"} onClick={(e)=>handleTypeChange(e)}>Wetland plant locator</div>
                {(selectedType=="wetland-loc") &&
                    <div className="explorer-tool" >
                        <div className="toggle-layers">
                            <div className="custom-checkbox">
                                <label className="control control--checkbox">
                                    <input type="checkbox" checked={hide} onChange={toggleLayers}/>                        
                                    <div className="control__indicator"></div>
                                </label>
                            </div>
                            <div className="checkbox-label">Hide map layers</div>
                        </div>
                        <div className="desc">{descriptions["woody-disp"]}<br></br></div>
                        <SpeciesTable map={map} plantProfiles={plantProfiles}/>    
                    </div>
                } */}
                <div id="woody-disp" className={(selectedType=="woody-disp") ? "selected" : "idle"} onClick={(e)=>handleTypeChange(e)}>Abundance Distributions</div>
                {(selectedType=="woody-disp") &&
                    <div className="explorer-tool" >
                        <div className="toggle-layers">
                            <div className="custom-checkbox">
                                <label className="control control--checkbox">
                                    <input type="checkbox" checked={hide} onChange={toggleLayers}/>                        
                                    <div className="control__indicator"></div>
                                </label>
                            </div>
                            <div className="checkbox-label">Hide map layers</div>
                        </div>
                        <div className="desc">{descriptions["woody-disp"]}<br></br></div>
                        <SpeciesTable map={map} plantProfiles={plantProfiles}/>    
                    </div>
                }
               
            </div>
        </div>    
    )
}