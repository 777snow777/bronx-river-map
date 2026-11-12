import "./panelcontainer.css";
import {React} from 'react';

const classColors = {
    'Native': '#1e7536',
    'Invasive': '#d42632',
    'Naturalized': '#b87802',
};

export default function PlantProfile({map, selectedPlant, prevState, setRightPanelState}) {
    function exitProfile(){
        let layerId = selectedPlant.Scientific.split(" ").join("-")+"-inat"
        if (map.getLayer(layerId)){
            map.setPaintProperty(
                layerId,
                'circle-opacity', 0,
            );
            map.setPaintProperty(
                layerId,
                'circle-stroke-opacity', 0,
            );
        }
        setRightPanelState(prevState)
    }
    return(
        <div className= "right-panel plant-profile">
            <div className ="profile-top-heading">
                <button className="back-btn" onClick={exitProfile}>&lt;</button>
                <div className="plant-name-heading">
                    <h2 className="common">{selectedPlant.Common}</h2>
                    <h2 className="scientific">{selectedPlant.Scientific}</h2>
                </div>
            </div>
            <div className="profile-content">
            {(selectedPlant.Indigenous_Names != "") &&
                Object.values(selectedPlant.Indigenous_Names.split(",")).map((name, index)=>{
                    return <div className="indigenous" key={index}>{name}</div>
                })
            }
            <img src={selectedPlant.Images}/>
            <div className="profile-info">
                <div><span style={{color: classColors[selectedPlant.Classification], textDecoration: "underline", fontWeight: 800}}>{selectedPlant.Classification}</span> in New York City</div>
            </div>
            <div className="profile-info">
                <span style={{textDecoration: "underline", fontWeight: 800}}>Wetland Indication Status</span>: <br/>{selectedPlant.Wetland_indicator_status}
            </div>
            {(selectedPlant.Origins != "") &&
                <div className="profile-field">
                    <div className="profile-heading">Plant Origins</div>
                    <div>{selectedPlant.Origins}</div>
                </div>
            }
            {(selectedPlant.Ecological_connections != "") &&
                <div className="profile-field">
                    <div className="profile-heading">Ecological Interconnections</div>
                    <div className="profile-info">{selectedPlant.Ecological_connections}</div>
                </div>
            }
            {(selectedPlant.Ethnobotany != "") &&
                <div className="profile-field">
                    <div className="profile-heading">Ethnobotany</div>
                    <div className="profile-info">{selectedPlant.Ethnobotany}</div>
                </div>
            }
            {(selectedPlant.Additional_usages != "") &&
                <div className="profile-field">
                    <div className="profile-heading">Additional Usages</div>
                    <div className="profile-info">{selectedPlant.Additional_usages}</div>
                </div>
            }
            {(selectedPlant.Management_strategies != "") &&
                <div className="profile-field">
                    <div className="profile-heading">Management Strategies</div>
                    <div className="profile-info">{selectedPlant.Management_strategies}</div>
                </div>
            }
            {(selectedPlant.References != "") &&
                <div className="profile-field">
                    <div className="profile-heading">References</div>
                    <ul>
                    {Object.entries(selectedPlant.References.split(" ")).map(([index, ref])=>(
                       <li className="profile-info reference-text" key={index}><a href={ref}>{ref}</a></li>
                    ))}
                    </ul>
                </div>
            }
            </div>
        </div>
    )

}