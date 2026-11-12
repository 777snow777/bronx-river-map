import React, {useRef, useState, useEffect} from 'react';
import { renderLayer } from "./Map";

export default function PlantVis({map, layers}) {
    const [selectedGroup, setSelectedGroup] = useState("none")
    const currSelected = useRef(selectedGroup)
    function handleChangeGroup(event){
        let id = event.target.value
        if (id == currSelected.current){return}
        if (currSelected.current != "none"){
            map.setPaintProperty(currSelected.current, 'fill-opacity', 0);
        }
        setSelectedGroup(id)
        currSelected.current = id
        if (id != "none"){
            let layer = layers.find((layer)=>layer.id == id)
            if (!map.getLayer(layer.id)) {
                renderLayer(layer, map)
            }else{
                map.setPaintProperty(layer.id, 'fill-opacity', 1);
            }
            map.moveLayer(layer.id, "rsa-sites");
        }
    }
    
    useEffect(()=>{
        return () => {
            if (currSelected.current != "none"){
                console.log("remove")
                map.setPaintProperty(currSelected.current, 'fill-opacity', 0);
            }
        };
    }, [])
    return(
        <div className="explorer-inner">
            <div className="rsa-ctrls">
                <div className="filter-heading">Plant group</div>
                <select className="plant-group" name="plantGroup" value={currSelected.current} onChange={(e)=>{handleChangeGroup(e)}}>
                    <option value="none">None</option>
                    {layers.map((layer, index) => (
                        <option key={index} value={layer.id}>{layer.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )

}
