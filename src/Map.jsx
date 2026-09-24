import React, { useRef, useEffect } from 'react';
import * as maplibregl  from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import Papa from "papaparse";

import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
maplibregl.setWorkerUrl(workerUrl);

let lpiFn = "lpi_observations.csv"
let rsaFn = "RSA_StemData_processed.csv"


export default function MapComponent({setMap, setRightPanelOpen, setRightPanelData}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const lng = -73.8803;
    const lat = 40.8517;
    const zoom = 12;
    const API_KEY = 'DrPBTalyPfijs88s2rGB';

    function getObsForSite(siteData){
      if (siteData.type =="lpi"){
        Papa.parse(lpiFn, {
          download: true,
          delimiter: ",",
          header: true,        
          complete: function (results) {
              let siteObs = results.data.filter((obs)=> obs["Wetland Site ID"] == siteData.wetland_si)
              siteData.plantObs = siteObs
              setRightPanelData(siteData)
              setRightPanelOpen(true)
          }
        })
      }else{
        Papa.parse(rsaFn, {
          download: true,
          delimiter: ",",
          header: true,        
          complete: function (results) {
              //first 12 digits indicates site id
              let rsaData = results.data.filter((data)=> data["SurveyID4"].slice(0,12) == siteData.SITE_ID)
              if (rsaData.length !=0 ){
                siteData.siteData = rsaData[0]
                setRightPanelData(siteData)
                setRightPanelOpen(true)
              }
              
          }
        })
     }
    }
    useEffect(() => {
        if (map.current) return; 
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/streets-v4/style.json?key=${API_KEY}`,
          center: [lng, lat],
          zoom: zoom
        });
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  
        map.current.on('load', () => {
            if (setMap) setMap(map.current);

            map.current.addSource('watershed-city-limits', {
              type: 'geojson',
              data: 'Bronx River Watershed - City Limits.json'
            });
          
            map.current.addLayer({
              'id': 'watershed',
              'type': 'fill',
              'source': 'watershed-city-limits',
              paint: {
                  'fill-color': '#A080ff',
                  'fill-opacity': 0.15
              }
            });
            map.current.addSource('nyc-parks-wetlands-src', {
                type: 'geojson',
                data: 'Watershed Wetlands.geojson'
              });
            
            map.current.addLayer({
                'id': 'nyc-parks-wetlands',
                'type': 'fill',
                'source': 'nyc-parks-wetlands-src',
                paint: {
                    'fill-color':  ['match',
                    ['get', 'classname'], // The feature property to evaluate
                    'Emergent', '#c7fff9',   // If category === 'parks', use green
                    'Estuarine', '#d1e2f3',   // If category === 'water', use blue
                    'Forested', '#9ac8e0',   // If category === 'urban', use red
                    'Scrub/Shrub', '#529dcc',
                    'Water', '#1d6cb1',
                    'Water-Estuarine', '#08306b',
                    '#999999'             // Default fallback color if no match
                  ],
                    'fill-opacity': 1,
                    'fill-outline-color': '#000000' 

                }
            });
            map.current.addSource('rsa-sites-src', {
              type: 'geojson',
              data: 'RSA_sites.geojson'
            });
          
            map.current.addLayer({
              'id': 'rsa-sites',
              'type': 'fill',
              'source': 'rsa-sites-src',
              paint: {
                  'fill-color':  '#FC00CA',
                  'fill-opacity': 1,
                  'fill-outline-color': '#FFFFFF' 
              }
            });
            map.current.addSource('survey-points', {
              type: 'geojson',
              data: 'survey_sites.geojson'
            });
            map.current.addLayer({
              'id': 'lpi-sites',
              'type': 'circle',
              'source': 'survey-points',
              paint: {
                'circle-radius': 4,
                'circle-color': '#A0F0C2',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#000000'
            }
            });
            map.current.on('click', 'lpi-sites', (e) => {
              const properties = e.features[0].properties
              properties.type ="lpi"
              getObsForSite(properties)
            });
            map.current.on('click', 'rsa-sites', (e) => {
              const properties = e.features[0].properties
              properties.type ="rsa"
              getObsForSite(properties)
            });
            map.current.on('click', (e)=>{
              setRightPanelOpen(false)
              setRightPanelData(null)
            })
          
        })
        
      }, [API_KEY, lng, lat, zoom, setMap]);
     

      return (
        <div className="map-wrap">
          <div ref={mapContainer} className="map" />
        </div>
      );
  }