import "./panelcontainer.css";
import ToggleLayer from "./ToggleLayer";
import React, { useState, useEffect } from 'react';

export default function ToggleCategory({category, map}) {
    const [layerVis, setLayerVis] = useState(null)
    const [catVis, setCatVis] = useState(true)

    const toggleCategory = () => {
        if (!map) return;
        const nextState = !catVis;
        category.layers.forEach((layer) =>{
            map.setLayoutProperty(
                layer.id,
                'visibility',
             nextState ? 'visible' : 'none'
            )
            setLayerVis(prevData => ({
                ...prevData,
                [layer.id]: nextState 
              }));
        })
        setCatVis(nextState)
    };

    useEffect(()=>{
        let initVis = {}
        category.layers.forEach((layer)=>{
            initVis[layer.id] = layer.visibility == "visible" ? true : false
        })
        setLayerVis(initVis)
    },[])

    return (
        <>
        <div className="data-category">
            <div className="category-heading" key={category.category}>
                <div className="custom-checkbox">
                    <div className="control control--checkbox">
                        <input type="checkbox" checked={catVis} onChange={() =>toggleCategory()}/>                        
                        <div className="control__indicator"></div>
                    </div>
                </div>
                <div className="category-name">{category.category}</div>
                {/* <div className="category-vis" >▼</div> */}
            </div>
            {layerVis && category.layers.map((layer)=>{
                return <ToggleLayer key={layer.id} map={map} layer={layer} layerVis={layerVis[layer.id]} setLayerVis={setLayerVis}/>
            })}
        </div>
        
        </>
        
    )

}