import PanelContainer from './PanelContainer';
import React from 'react';
import './App.css';
import 'maplibre-gl/dist/maplibre-gl.css'

function App() {
  const mapLayers = [
   
    { id: 'watershed', label: 'Bronx River Watershed' },
    { id: 'nyc-parks-wetlands', label: 'NYC Parks Wetlands' },
    { id: 'lpi-sites', label: 'Vegetation Survey Sites'},
    { id: 'rsa-sites', label: 'RSA Sites'}
  ];

  return(
    <div className="App">
      <PanelContainer layers={mapLayers}/>
    </div>
  )
}

export default App;