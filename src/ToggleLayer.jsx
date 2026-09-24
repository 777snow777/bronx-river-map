import React, { useState } from 'react';
import './leftpanel.css';

export default function ToggleLayer({ map, layers }) {
    const [visibility, setVisibility] = useState(
        layers.reduce((acc, l) => ({ ...acc, [l.id]: true }), {})
      );
    const toggleLayer = (layerId) => {
        if (!map) return;
        const nextState = !visibility[layerId];
        map.setLayoutProperty(
          layerId,
          'visibility',
          nextState ? 'visible' : 'none'
        );
        setVisibility((prev) => ({ ...prev, [layerId]: nextState }));
    };
    return (
        <div >
          {layers.map((layer) => (
            <label key={layer.id} style={{ fontSize: '0.8em', display: 'block', marginBottom: '2px' }}>
              <input
                type="checkbox"
                checked={visibility[layer.id]}
                onChange={() => toggleLayer(layer.id)}
              />
              {layer.label}
            </label>
          ))}
        </div>
      );
}