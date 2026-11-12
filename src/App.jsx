import PanelContainer from './PanelContainer';
import React, { useState, useEffect } from 'react';
import layers from "./layers.json"
import './App.css';
import 'maplibre-gl/dist/maplibre-gl.css'

function App() {
  const [mapLayers, setMapLayers] = useState(null)

  useEffect(()=>{
    setMapLayers(layers)
  })
  return(
    <div className="App">
      {mapLayers && <PanelContainer mapLayers={mapLayers}/>}
    </div>
)
}

export default App;