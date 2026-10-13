import React, { useState } from 'react';
import "./panelcontainer.css";

export default function ToggleLayer({ map, layer}) {
    const [visibility, setVisibility] = useState(true)
          //   layers.reduce((acc, l) => ({ ...acc, [l.id]: true }), {})
          // );
    const toggleLayer = (layerId) => {
        if (!map) return;
        const nextState = !visibility;
        map.setLayoutProperty(
          layerId,
          'visibility',
          nextState ? 'visible' : 'none'
        );
        setVisibility(nextState);
    };
    return (
        <div >
          <label key={layer.id} style={{ fontSize: '0.8em', display: 'block', marginBottom: '2px' }}>
            <input
              type="checkbox"
              checked={visibility}
              onChange={() => toggleLayer(layer.id)}
            />
            {layer.label}
          </label>
        </div>
      );
}