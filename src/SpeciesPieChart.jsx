import "./panelcontainer.css";
import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import React, { useEffect, useState } from 'react';
const classes = ["Native", "Invasive", "Naturalized"]
const classColors = {
    'Native': '#32a852',
    'Invasive': '#d42632',
    'Naturalized': '#f2a413',
};
//classData maps each class to a percent, species data is a doubles array with each array containing a list for each class ordered Native-Invasive-Naturalized
//NEED TO DO: create popup for if canopy level has no plants observed
export default function SpeciesPieChart({siteSpecies, canopyField, title, siteID}) {
    const [series, setSeries] = useState(null)
    const [colored, setColored] = useState(
        siteSpecies.filter((species)=>species[canopyField]>0)
        .map((obj) => ({
        ...obj,
        color: stringToColor(obj.common.toUpperCase())
    })))
    
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += value.toString(16).padStart(2, '0');
        }
        return color;
    }

    useEffect(()=>{
        const classData = classes.map((plClass) => {
            const classTotal = colored
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
            return colored
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
            outerRadius: 85,
            id: 'plant-class',
            data: classData,
            valueFormatter: (item) => `${item.value}%`
          },
          {
            innerRadius: 85,
            outerRadius: 110,
            id: 'plant-species',
            data: classSpeciesData,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
            valueFormatter: (item) => `${item.value}%`
          },
        ]
        setSeries(chartSeries)
    },[])
      
    function toggleSpeciesList(e){
        let legend = document.getElementById(siteID+"-"+canopyField)
        if (legend.style.display == "none"){
            e.target.innerHTML="- Hide full species list"
            legend.style.display="flex"
        }else{
            e.target.innerHTML="+ Show full species list"
            legend.style.display="none"
        }

    }

    return(
        <>
        {series && colored &&<>
        <div className="section-container">
            <div className="plant-category">{title}</div>
            <div className="category-legend">
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: "#32a852"}}></div>
                    <div className="legend-label">Native</div>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: "#d42632"}}></div>
                    <div className="legend-label">Invasive</div>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: "#f2a413"}}></div>
                    <div className="legend-label">Naturalized</div>
                </div>
            </div>
            <div className="toggle-list" onClick={toggleSpeciesList}>+ Show full species list</div>
            <div className="species-legend" id={siteID + "-" + canopyField} style={{ display: "none" }}>
                {colored.map((species, index)=>(
                    <div key={index} className="legend-item">
                        <div className="legend-color" style={{backgroundColor: species.color}}></div>
                        <div className="legend-label">{species.common}</div>
                    </div>
                ))}
            </div>
            <PieChart 
                series={series}
                hideLegend
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                height={300}
                />
            </div>
        </>}
        </>
    )
}