import "./panelcontainer.css";
import { renderLayer } from "./Map";
import React, { useState } from 'react';

export function renderLayerColor(layer){
  if (layer.symbology == "multi"){
    return (
      Object.entries(layer.classifications).map(([key, value]) => (
        <div className="layer-class" key={key}>
          <div className={layer.type+"-color"} style={{backgroundColor: value}}></div>
          <div>{key}</div>
        </div>
        ))
    )
  }else{
    return (
      <div className="layer-single" key={layer.id+"-color"}>
        <div className={layer.symbology == "gradient" ? "gradient-color" : layer.type+"-color"} style={{background: layer.symbology == "gradient" ? `linear-gradient(to bottom, ${layer.colorRange[1]}, ${layer.colorRange[0]})` : layer.color}}></div>
        <div>{layer.symbolName}</div>
      </div>
    )
  } 
}

export default function ToggleLayer({ map, layer, appliedLayers, setAppliedLayers}) {
  const [layerVis, setLayerVis] = useState(appliedLayers.includes(layer))
  const toggleLayer = () => {
        if (!map) return;
        if (!map.getLayer(layer.id)) {
          renderLayer(layer, map)
        }
        const nextState = !layerVis;
        map.setLayoutProperty(
          layer.id,
          'visibility',
          nextState ? 'visible' : 'none'
        );
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
        setLayerVis(nextState)
    };
    
    return (
        <div className="data-layer">
            <div className="layer-heading">
              <div className="custom-checkbox">
                    <label className="control control--checkbox">
                        <input type="checkbox" checked={layerVis} onChange={toggleLayer}/>                        
                        <div className="control__indicator"></div>
                    </label>
                </div>
                <div className="layer-name">{layer.label}</div>
            </div>
            <div className="data-vis" style={{border: layerVis ? "0.75px solid rgb(108 149 0)" : "none"}}>
               {layerVis && renderLayerColor(layer)}
            </div>
        </div>
      );
}