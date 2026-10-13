import "./panelcontainer.css";
// wetland_si
export default function LpiSiteFeature({siteData}) {
    return (
        <div className="right-panel">
            <h2>{siteData.siteId}</h2>
            {siteData && <div className="site-plants">
                {siteData.plantObs.map((plant, index) => (
                    <div key={index} className="plant-obs">
                        <div className="plant-label">{plant.scientific}</div>
                        <img src={`lpi-images/${plant.GLOBALID}.jpg`}/>
                    </div>
                ))}
            </div>}
        </div>
    )
}