import "./panelcontainer.css";

export default function LpiSiteFeature({data}) {
    return (
        <>
        <h2>{data.wetland_si}</h2>
        {data && <div className="site-plants">
            {data.plantObs.map((plant, index) => (
                <div key={index} className="plant-obs">
                    <div className="plant-label">{plant.scientific}</div>
                    <img src={`lpi-images/${plant.GLOBALID}.jpg`}/>
                </div>
            ))}
        </div>}
        </>
    )
}