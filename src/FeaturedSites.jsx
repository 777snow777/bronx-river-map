import "./panelcontainer.css";
import React, {useEffect} from 'react';
import sites from "./sites.json"

// const sites = ["Shoelace Park", "Bronx River Forest", "New York Botanical Garden", "Bronx Zoo", "Starlight Park", "Soundview Park"]
export default function FeaturedSites({map, setSiteData, setRightPanelState}){
    useEffect(() => {
        map.setLayoutProperty('rsa-sites', 'visibility', 'none')
        map.setLayoutProperty('rsa-sites-outline', 'visibility', 'none')
        map.setLayoutProperty('featured-sites', 'visibility', 'visible')
        map.setLayoutProperty('featured-sites-outline', 'visibility', 'visible')
    }, []) 

    function selectSite(site){
        setRightPanelState("featured-site")
        map.flyTo({
            center: site.center,
            zoom: 15, 
            essential: true 
        });
        setSiteData(site)
    }

    function hoverSite(site){
        map.setFeatureState(
            { source: "featured-sites-src", id: site.layerID},
            { hover: true }
        );
    }

    function unHoverSite(site){
        map.setFeatureState(
            { source: "featured-sites-src", id: site.layerID},
            { hover: false }
        );
    }

    return (
        <></>
        // <div>
        //     <h3 className="heading">Watershed spotlights</h3>
        //     <ul>
        //         {sites.map((site, index) => (
        //             <div className="featured-site" key={index}>
        //                 <li className = "site-list-item" onMouseEnter={()=>hoverSite(site)} onMouseLeave={()=>unHoverSite(site)} onClick={()=>selectSite(site)}>{site.Name}</li>
        //             </div>
        //         ))}
        //     </ul>
        //     <h3 className="heading">Points along the river</h3>
        //     {/* ADD Expandable and collapsable windows for the sites along the river and the restoration plantings */}
        // </div>
    )
}