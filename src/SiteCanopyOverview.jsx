import "./panelcontainer.css";
import { PieChart } from '@mui/x-charts/PieChart';
import React, { useEffect, useState } from 'react';
const classes = ["Native", "Invasive", "Naturalized"]
const classColors = {
    'Native': '#32a852',
    'Invasive': '#d42632',
    'Naturalized': '#f2a413',
    'Unclassified': "#abb8b6"
};
let FEATURE_MAX = 4
//classData maps each class to a percent, species data is a doubles array with each array containing a list for each class ordered Native-Invasive-Naturalized
export default function SiteCanopyOverview({siteSpecies, canopyField, title, siteID}) {
    const [series, setSeries] = useState(null)
    const [legendPlants, setLegendPlants] = useState(null)
    const [selectedPlants, setSelectedPlants] = useState(null)
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = 0.85*str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += value.toString(16).padStart(2, '0');
        }
        return color;
    }
    useEffect(()=>{
        let plantColors = siteSpecies.filter((species)=>species[canopyField]>0).map((obj) => ({
                ...obj,
                color: stringToColor(obj.scientific.toUpperCase())
        })).sort((a,b) => b[canopyField] - a[canopyField])
        let featuredSize = plantColors.length >= FEATURE_MAX ? (FEATURE_MAX) : plantColors.length
        setSelectedPlants(Object.values(plantColors).slice(0, featuredSize)) //only show most common plants in legend by default
        setLegendPlants(Object.values(plantColors))
        const classData = classes.map((plClass) => {
            const classTotal = plantColors
            .filter((item) => item.category === plClass)
            .reduce((acc, item) => acc + parseFloat(item[canopyField], 10), 0);
            return {
                id: plClass, 
                label: plClass, 
                value: Math.trunc(classTotal*100)/100,
                color: classColors[plClass]
            }
        })
        const classSpeciesData = classes.flatMap((plClass) => {
            return plantColors
              .filter((item) => item.category === plClass)
              .sort((a, b) => (a.common > b.common ? 1 : -1))
              .map((item) => ({
                id: `${canopyField}-${item.common}`,
                label:`${item.common} (${plClass})`,
                value: item[canopyField],
                color: item.color
              }));
        });        
        let chartSeries = [{
            innerRadius: 0,
            outerRadius: 80,
            id: 'plant-class',
            data: classData,
            paddingAngle: 0,
            valueFormatter: (item) => `${item.value}%`
          },
          {
            innerRadius: 80,
            outerRadius: 110,
            id: 'plant-species',
            data: classSpeciesData,
            paddingAngle: 0,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
            valueFormatter: (item) => `${item.value}%`,
          },
        ]
        setSeries(chartSeries)
    },[siteSpecies])
      
    function toggleSpeciesList(e){
        let legend = document.getElementById(siteID+"-"+canopyField)
        let heading = document.getElementById(siteID+"-"+canopyField+"-heading")
        let legendSize = legendPlants.length
        if (selectedPlants.length < legendSize){
            setSelectedPlants(legendPlants)
            e.target.innerHTML="- Hide full species list"
            heading.display="none"
        }else{
            setSelectedPlants(legendPlants.slice(0, FEATURE_MAX)) 
            e.target.innerHTML="+ View full species list"
            heading.display="block"

        }

    }

    return(
        <>
        {series && legendPlants &&<>
        <div className="section-container">
            <div className="chart-heading">{title}</div>
            {(legendPlants.length > 0) ?
            <>
            <div className="legend">
                <div className="legend-heading"  id={siteID + "-" + canopyField+"-heading"}>Most Common:</div>
                <div className="species-legend" id={siteID + "-" + canopyField}>
                    {selectedPlants.map((species, index)=>(
                        <div key={index} className="legend-item">
                            <div className="legend-color" style={{backgroundColor: species.color}}></div>
                            <div className="legend-label">{species.common}</div>
                        </div>
                    ))}
                </div>
                {(legendPlants.length > FEATURE_MAX) && <div className="toggle-list" onClick={toggleSpeciesList}>+ View full species list</div>}
            </div> 
            <PieChart 
                series={series}
                hideLegend
                margin={{ top: 10, bottom: 0, left: 20, right: 20 }}
                height={300}
            />
            <div className="category-legend">
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: classColors["Native"]}}></div>
                    <div className="legend-label">Native</div>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: classColors["Invasive"]}}></div>
                    <div className="legend-label">Invasive</div>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: classColors["Naturalized"]}}></div>
                    <div className="legend-label">Naturalized</div>
                </div>
            </div>
            </>
            :
            <div>
                No species identified at this canopy level
            </div>
            }
            </div>
        </>}
        </>
    )
}