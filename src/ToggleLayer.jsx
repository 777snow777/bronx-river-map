import "./panelcontainer.css";
import { renderLayer } from "./Map";
export default function ToggleLayer({ map, layer, layerVis, setLayerVis}) {
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
        setLayerVis(prevData => ({
          ...prevData,
          [layer.id]: nextState 
        }));
    };

    function renderLayerColor(){
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
          <div className="layer-class">
            <div className={layer.symbology == "gradient" ? "gradient-color" : layer.type+"-color"} style={{background: layer.symbology == "gradient" ? `linear-gradient(to bottom, ${layer.colorRange[1]}, ${layer.colorRange[0]})` : layer.color}}></div>
          </div>
        )
      } 
    }

    return (
        <div className="data-layer">
            <div className="layer-heading" style={{borderBottom: layerVis ? "0.5px solid #10098f" : "none"}}>
              <div className="custom-checkbox">
                    <label className="control control--checkbox">
                        <input type="checkbox" checked={layerVis} onChange={toggleLayer}/>                        
                        <div className="control__indicator"></div>
                    </label>
                </div>
                <div className="layer-name">{layer.label}</div>
            </div>
            <div className="data-vis">
               {layerVis && renderLayerColor()}
            </div>
        </div>
      );
}