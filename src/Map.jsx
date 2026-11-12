import React, { useRef, useEffect, useState } from 'react';
import * as maplibregl  from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import Papa from "papaparse";
import sites from "./sites.json"
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
maplibregl.setWorkerUrl(workerUrl);

let lpiFn = "lpi_observations.csv"
let rsaFn = "full_site_summaries.csv"
let POPUP_LAYERS = ['nyc-parks-wetlands', 'nac-wetlands', 'sewer-system', 'practical-canopy'] 

export function renderLayer(layer, map){
  let sourceId = layer.data.split(".")[0]+"-src"
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      'type': 'geojson',
      'data': layer.data
    });
  }
  let color = ""
  if (layer.symbology == "single"){
    color = layer.color
  }else if(layer.symbology == "multi"){
    color = ['match', ['get', layer.classField]]
    Object.entries(layer.classifications).map(([key, value]) =>{
      color.push(key)
      color.push(value)
    })
    color.push("#999999")
  }else{
    color = [
      'interpolate',
      ['linear'],
      ['get', layer.classField],
        layer.classRange[0], layer.colorRange[0],
        layer.classRange[1], layer.colorRange[1],
    ]
  }
  let opacity = ""
  if (layer.opacity == "curve"){
    opacity = [
      'interpolate',
      ['linear'],
      ['get', layer.classField],
      0, 0.0, 
      0.1*layer.classRange[1], 0.5,  
      0.3*layer.classRange[1], 0.8,
      0.6*layer.classRange[1], 0.9,
      layer.classRange[1], 1
    ]
  }else{
    opacity = parseFloat(layer.opacity)
  }

  let props = {
    [`${layer.type}-color`]: color,
    [`${layer.type}-opacity`]: opacity
  }
  if (layer.type == "line"){
    props["line-width"] = layer.width
  }
  map.addLayer({
    'id': layer.id,
    'type': layer.type,
    'source': sourceId,
    paint: props,
    'layout': {
        'visibility': layer.visibility
    },
    metadata: layer.metadata
  })
  if (layer.metadata != null && layer.metadata.name != null){
    map.on('mouseenter', layer.id, (e) => {
      map.getCanvas().style.cursor = 'default'; 
    })
    map.on('mouseleave', layer.id, (e) => {
      map.getCanvas().style.cursor = 'pointer'; 
    })
  }
}


export default function MapComponent({map, mapReady, setMapReady, mapLayers, setMap, setRightPanelState, leftStateRef, setSiteData, selectedIdRef}) {
    const mapContainer = useRef(null);
    const hoveredIdRef = useRef(null);
    // const [isMapLoading, setIsMapLoading] = useState(false); 
    const lng = -73.8603;
    const lat = 40.8617;
    const zoom = 12;

    function hoverSite(currentId, layerId){
      if (hoveredIdRef.current !== currentId) {
        if (hoveredIdRef.current !== null) {
          map.current.setFeatureState(
            { source: layerId, id: hoveredIdRef.current},
            { hover: false }
          );
        }
        hoveredIdRef.current = currentId;
        map.current.setFeatureState(
          { source: layerId, id: currentId },
          { hover: true }
        );
      }
    }

    function exitSite(layerId){
      if (hoveredIdRef.current !== null) {
        map.current.setFeatureState(
          { source: layerId, id: hoveredIdRef.current },
          { hover: false }
        );
      }
      hoveredIdRef.current = null;
    }

    function selectRSA(selected){
      const siteData = selected.properties
      parseSiteData(siteData)
    }

    function selectFeaturedSite(selected){
      const properties = selected.properties
      let data = sites.find(site => site.Name == properties.NAME);
      setSiteData(data)
      setRightPanelState("featured-site")
    }

    function selectSite(selected, lngLat){
      let layerSrc = selected.source
      let zoom = 16
      if (layerSrc == "rsa-sites-src"){
        selectRSA(selected)
      }else{
        zoom = 14
        selectFeaturedSite(selected)
      }
      map.current.flyTo({
        center: lngLat,
        zoom: zoom, 
        essential: true 
      });
      const currentId = selected.id;
      if (selectedIdRef.current !== currentId) {
        if (selectedIdRef.current !== null){
          map.current.setFeatureState(
            { source: layerSrc, id: selectedIdRef.current},
            { selected: false }
          );
        }
        selectedIdRef.current = currentId
        selectedIdRef.layerId = layerSrc
        map.current.setFeatureState(
          { source: layerSrc, id: currentId},
          { selected: true}
        );
      }
    }

    function parseSiteData(selectedSite){
      if (selectedSite.type =="lpi"){
        Papa.parse(lpiFn, {
          download: true,
          delimiter: ",",
          header: true,        
          complete: function (results) {
              let siteObs = results.data.filter((obs)=> obs["Wetland Site ID"] == siteData.wetland_si)
              siteData.plantObs = siteObs
              siteData.siteId = siteData.wetland_si
              setSiteData(siteData)
          }
        })
      }else{
        Papa.parse(rsaFn, {
          download: true,
          delimiter: ",",
          header: true,        
          complete: function (results) {
              //first 12 digits indicates site id
              let siteData = results.data.filter((data)=> data.SurveyID4.slice(0,12) == selectedSite.SITE_ID)[0]
              // siteData.Overall = siteData.Overall_Summary.split(",")
              // siteData.Midstory = siteData.Midstory_Summary.split(",")
              // siteData.Seedling = siteData.Seedling_Summary.split(",")
              // siteData.Overstory1 = siteData.Overstory_1_Summary.split(",")
              // siteData.Overstory2 = siteData.Overstory_2_Summary.split(",")
              // siteData.Overstory3 = siteData.Overstory_3_Summary.split(",")
              // siteData.Overstory4 = siteData.Overstory_4_Summary.split(",")
              console.log(selectSite)
              siteData.SiteName = selectedSite.SiteName
              siteData.CanopyProfile = siteData.CanopyProfile.split(",")
              setSiteData(siteData)
              setRightPanelState("rsa")
              }
        })
     }
    }

    function initMap(){
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://styles.maptoolkit.org/light.json",
        center: [lng, lat],
        zoom: zoom
      });
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.on('load', () => {
        if (setMap) setMap(map.current);
        let baseLayers = []
        let topLayers = []
        mapLayers.forEach((category)=>{
          let catBase = category.layers.filter((layer)=> (layer.level == "base"))
          let catTop = category.layers.filter((layer)=> (layer.level == "top"))
          baseLayers = [...baseLayers, ...catBase];
          topLayers = [...topLayers, ...catTop];
        }) 
        baseLayers.forEach((layer)=> renderLayer(layer, map.current))
        topLayers.forEach((layer)=> renderLayer(layer, map.current))
        map.current.addSource('rsa-sites-src', {
          type: 'geojson',
          data: 'rsa_sites_full.geojson'
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
                  '#666666',
                  '#FFFFFF'
              ],
              'fill-opacity':  [
                'case',
                  ['any',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['boolean', ['feature-state', 'selected'], false]
                  ],
                  0.7,
                  0.3
              ],
              'fill-outline-color': '#000000' 
          },
          'layout': {
            'visibility': "none"
        }
        });
        map.current.addLayer({
          'id': 'rsa-sites-outline',
          'type': 'line',
          'source': 'rsa-sites-src',
          'paint': {
              'line-color': '#000000',
              'line-width': [
                'case',
                    ['any',
                      ['boolean', ['feature-state', 'hover'], false],
                      ['boolean', ['feature-state', 'selected'], false]
                    ],
                  3.5,
                  1
                ],
              'line-opacity': 0
            },
            'layout': {
                'visibility': "visible"
            },
        });
          map.current.addSource('inat-obs', {
                  'type': 'geojson',
                  'data': 'inat_obs.geojson'
          });

          map.current.addSource('featured-sites-src', {
            'type': 'geojson',
            'data': 'sites.geojson'
          });

          map.current.addLayer({
            'id': 'featured-sites',
            'type': 'fill',
            'source': 'featured-sites-src',
            paint: {
                'fill-color':  [
                  'case',
                    ['any',
                      ['boolean', ['feature-state', 'hover'], false],
                      ['boolean', ['feature-state', 'selected'], false]
                    ],
                    '#666666',
                    '#FFFFFF'
                ],
                'fill-opacity':   [
                  'case',
                    ['any',
                      ['boolean', ['feature-state', 'hover'], false],
                      ['boolean', ['feature-state', 'selected'], false]
                    ],
                    0.7,
                    0.3
                ],
                'fill-outline-color': '#000000' 
            },
            'layout': {
              'visibility': "none"
          },
          });
          map.current.addLayer({
            'id': 'featured-sites-outline',
            'type': 'line',
            'source': 'featured-sites-src',
            'paint': {
                'line-color': '#000000',
                'line-width': [
                  'case',
                      ['any',
                        ['boolean', ['feature-state', 'hover'], false],
                        ['boolean', ['feature-state', 'selected'], false]
                      ],
                    3.5,
                    1.5
                  ],
                'line-opacity': 0
            },
            'layout': {
              'visibility': "visible"
          }
          });
          // map.current.on('click', 'lpi-sites', (e) => {
          //   const properties = e.features[0].properties
          //   getSiteData(properties)
          // });

          map.current.on('click', (e)=>{
            let coord = e.lngLat
            const siteFeatures = map.current.queryRenderedFeatures(e.point, {
              layers: ['rsa-sites', 'featured-sites'] 
            });
            if (siteFeatures.length != 0) { //clicked on site
              let selected = siteFeatures[0];
              selectSite(selected, coord)
            }else{ //check if something else was clicked
              let features = map.current.queryRenderedFeatures(e.point, {
                layers: POPUP_LAYERS
              });
              if (features.length != 0){
                let topFeature = features[0];
                const metadata = topFeature.layer.metadata
                const name = metadata.name
                const val = topFeature.properties[metadata.identifierClass]
                const description = `<div class="popup-title">${name}:</div><div class="popup-value">${val}</div>`;
                new maplibregl.Popup({className: "custom-popup"})
                    .setLngLat(coord)
                    .setHTML(description)
                    .addTo(map.current)
              }else{
                setRightPanelState("closed")
                if (selectedIdRef.current !== null) {
                  map.current.setFeatureState(
                    { source: 'rsa-sites-src', id: selectedIdRef.current},
                    { selected: false }
                  );
                  map.current.setFeatureState(
                    { source: 'featured-sites-src', id: selectedIdRef.current},
                    { selected: false }
                  );
                }
                setSiteData(null)
              }
            }
          })

          map.current.on('mousemove', 'rsa-sites', (e) => {
            if (e.features.length > 0) {
              hoverSite(e.features[0].id, 'rsa-sites-src')
            }  
          })
          map.current.on('mousemove', 'featured-sites', (e) => {
            if (e.features.length > 0) {
              hoverSite(e.features[0].id, 'featured-sites-src')
            }  
          })
          map.current.on('mouseleave', 'rsa-sites', () => { exitSite('rsa-sites-src') });
          map.current.on('mouseleave', 'featured-sites', () => { exitSite('featured-sites-src')});
          const handleIdle = () => {
            if (!mapReady){setMapReady(true)} //->load page
          };
          map.current.on('idle', handleIdle);
      })
    }

    useEffect(() => {
      if (!map.current){
        initMap() 
      }
    }, [setMap]);


    return (
      <div className="map-wrap" id="map-body">
        <div ref={mapContainer} className="map" style={{pointerEvents: 'auto', position: 'relative', zIndex: 1}} />
      </div>
    );
  }