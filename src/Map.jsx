import React, { useRef, useEffect } from 'react';
import * as maplibregl  from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import Papa from "papaparse";

import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
maplibregl.setWorkerUrl(workerUrl);

let lpiFn = "lpi_observations.csv"
let rsaFn = "rsa_site_summaries.csv"

export default function MapComponent({setMap, setRightPanelState, setSiteData}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const hoveredIdRef = useRef(null);
    const selectedIdRef = useRef(null);

    const lng = -73.8603;
    const lat = 40.8517;
    const zoom = 12;

    function getMostCommonPlants(plantListStr){
      if (plantListStr == ""){
        return null
    }
      let common = plantListStr.split(",")
      let len = Math.min(common.length, 5)
      return common.slice(0,len)
      
    }

    function getObsForSite(siteData){
      if (siteData.type =="lpi"){
        Papa.parse(lpiFn, {
          download: true,
          delimiter: ",",
          header: true,        
          complete: function (results) {
              let siteObs = results.data.filter((obs)=> obs["Wetland Site ID"] == siteData.wetland_si)
              siteData.plantObs = siteObs
              siteData.siteId = siteData.wetland_si
              setSiteData(siteData)
              setRightPanelState("lpi")
          }
        })
      }else{
        Papa.parse(rsaFn, {
          download: true,
          delimiter: ",",
          header: true,        
          complete: function (results) {
              //first 12 digits indicates site id
              let sitePlants = results.data.filter((data)=> data.SurveyID4.slice(0,12) == siteData.SITE_ID)[0]
              siteData.Overall = sitePlants.Overall_Summary.split(",")
              siteData.Midstory = sitePlants.Midstory_Summary.split(",")
              siteData.Seedling = sitePlants.Seedling_Summary.split(",")
              siteData.Overstory1 = sitePlants.Overstory_1_Summary.split(",")
              siteData.Overstory2 = sitePlants.Overstory_2_Summary.split(",")
              siteData.Overstory3 = sitePlants.Overstory_3_Summary.split(",")
              siteData.Overstory4 = sitePlants.Overstory_4_Summary.split(",")
              siteData.CanopyProfile = sitePlants.CanopyProfile.split(",")
              setSiteData(siteData)
              setRightPanelState("rsa")
              }
        })
     }
    }

    useEffect(() => {
        if (map.current) return; 
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: "https://tiles.versatiles.org/assets/styles/colorful/style.json",
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
                  'fill-color': '#0000AA',
                  'fill-opacity': 0.05
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
                    ['get', 'classname'], 
                    'Emergent', '#c7fff9',   
                    'Estuarine', '#d1e2f3',   
                    'Forested', '#9ac8e0',   
                    'Scrub/Shrub', '#529dcc',
                    'Water', '#1d6cb1',
                    'Water-Estuarine', '#08306b',
                    '#999999'             // Default fallback color if no match
                  ],
                    'fill-opacity': 1,
                    'fill-outline-color': '#FF0000' 

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
                  'fill-color':  [
                    'case',
                      ['any',
                        ['boolean', ['feature-state', 'hover'], false],
                        ['boolean', ['feature-state', 'selected'], false]
                      ],
                      '#777777',
                      '#FFFFFF'
                  ],
                  'fill-opacity':  [
                    'case',
                      ['any',
                        ['boolean', ['feature-state', 'hover'], false],
                        ['boolean', ['feature-state', 'selected'], false]
                      ],
                      0.7,
                      1
                  ],
                  'fill-outline-color': '#000000' 
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
                'circle-color': '#000000',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#000000'
              }
            });
            map.current.addSource('inat-obs', {
                    'type': 'geojson',
                    'data': 'inat_obs.geojson'
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
              map.current.flyTo({
                center: e.lngLat,
                zoom: 16, 
                essential: true 
              });
              const currentId = e.features[0].id;
              console.log(selectedIdRef.current)
              console.log(currentId)

              if (selectedIdRef.current !== currentId) {
                  map.current.setFeatureState(
                    { source: 'rsa-sites-src', id: selectedIdRef.current},
                    { selected: false }
                  );
                  selectedIdRef.current = currentId
                  map.current.setFeatureState(
                    { source: 'rsa-sites-src', id: currentId},
                    { selected: true}
                  );
                
              }
            });
            map.current.on('click', (e)=>{
              setRightPanelState("closed")
              if (selectedIdRef.current !== null) {
                map.current.setFeatureState(
                  { source: 'rsa-sites-src', id: selectedIdRef.current },
                  { selected: false }
                );
              }
              setSiteData(null)
            })
            // map.current.on('mouseenter', 'rsa-sites', (e) => {
            //   let site = e.features[0].properties
            //   properties.type ="rsa"
            // });
            map.current.on('mousemove', 'rsa-sites', (e) => {
              if (e.features.length > 0) {
                const currentId = e.features[0].id;
                if (hoveredIdRef.current !== currentId) {
                  
                  if (hoveredIdRef.current !== null) {
                    map.current.setFeatureState(
                      { source: 'rsa-sites-src', id: hoveredIdRef.current },
                      { hover: false }
                    );
                  }
                  hoveredIdRef.current = currentId;
                  map.current.setFeatureState(
                    { source: 'rsa-sites-src', id: currentId },
                    { hover: true }
                  );
                }
              }  
           })
           map.current.on('mouseleave', 'rsa-sites', () => {
            if (hoveredIdRef.current !== null) {
              map.current.setFeatureState(
                { source: 'rsa-sites-src', id: hoveredIdRef.current },
                { hover: false }
              );
            }
            hoveredIdRef.current = null;
          });
      })
    }, [lng, lat, zoom, setMap]);
     

      return (
        <div className="map-wrap">
          <div ref={mapContainer} className="map" style={{pointerEvents: 'auto', position: 'relative', zIndex: 1}} />
        </div>
      );
  }