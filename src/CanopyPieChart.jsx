import "./panelcontainer.css";
import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import React from 'react';


export default function CanopyPieChart({chartData,  title, canopyColors}) {
      
    return(
        <div className="section-container">
            <div className="chart-heading">{title}</div>
            <div className="canopy-legend">
                {Object.entries(canopyColors).map(([key, value])=>(
                    <div key={key} className="legend-item">
                        <div className="legend-color" style={{backgroundColor: value}}></div>
                        <div className="legend-label">{key}</div>
                    </div>
                ))}
            </div>
            <PieChart 
                series={[{ 
                    data: chartData, 
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                    valueFormatter: (item) => `${item.value}%`,
                    },
                ]}
                hideLegend
            margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
            height={250}
            />  
        </div>
    )
}