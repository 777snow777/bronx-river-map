import "./panelcontainer.css";
import ToggleLayer from "./ToggleLayer";
import React, { useState, useEffect } from 'react';

export default function ToggleCategory({category, map, appliedLayers, setAppliedLayers}) {
    // const [layerVis, setLayerVis] = useState(null)
    const [catVis, setCatVis] = useState(true)
    const [viewCat, setViewCat] = useState(false)
    const toggleCategory = () => {
        if (!map) return;
        const nextState = !catVis;
        category.layers.forEach((layer) =>{
            map.setLayoutProperty(
                layer.id,
                'visibility',
             nextState ? 'visible' : 'none'
            )
            if (nextState){
                setAppliedLayers( 
                    [
                        ...appliedLayers, 
                        layer
                    ]);
            }else{
                setAppliedLayers(
                    appliedLayers.filter(l =>
                      l.id !== layer.id
                    )
                )
            }
        })
        setCatVis(nextState)
    };

    function toggleCategoryView(){
        const next = !viewCat
        setViewCat(next)
    }

    return (
        <>
        <div className="data-category">
            <div className="category-heading" key={category.category}>
                <div className="open-category" onClick={toggleCategoryView}>{viewCat ? '▼' : '▶'}</div> 
                <div className="category-name">{category.category}</div>
                <div className="custom-checkbox">
                    <label className="control control--checkbox">
                        <input type="checkbox" checked={catVis} onChange={toggleCategory}/>                        
                        <div className="control__indicator"></div>
                    </label>
                </div>
            </div>
            {viewCat && category.layers.map((layer)=>{
                return <ToggleLayer key={layer.id} map={map} layer={layer} appliedLayers={appliedLayers} setAppliedLayers={setAppliedLayers}/>
            })}
        </div>
        
        </>
        
    )

}