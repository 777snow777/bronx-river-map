
// sitePlants[site]
export default function FeaturedSite({map, siteData, plantProfiles, setSelectedPlant, setPrevState}){ 
    function openPlantProfile(plant){
        if (plantProfiles[plant] != null){
            setSelectedPlant(plantProfiles[plant])
            setPrevState("featured-site")
        }
    }

    return (
        <div className="right-panel featured-site">
            <div className="site-heading">{siteData.Name}</div>
            <div className="plant-list">
                <h3 className="heading">Common plant species</h3>
                <ul>
                {siteData.plants.map((plant, index) => (
                    <li key={index} className="list-plant" onClick={()=>openPlantProfile(plant)}>
                        <div className="featured-plant-name">{plantProfiles[plant].Common}</div>
                    </li>
                ))}
                </ul>
            </div>
        </div>
    )
}