import "./panelcontainer.css";
import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import React, { useEffect, useState } from 'react';

const classes = ['Native', 'Invasive', 'Naturalized'];
const classColors = {
    'Native': '#32a852',
    'Invasive': '#d42632',
    'Naturalized': '#edda79',
};

export default function CanopyPieChart({chartData,  title}) {
      
    return(
        <>
        <div className="section-container">
            <div className="plant-category">{title}</div>
            <PieChart 
                series={[{ 
                    data: chartData, 
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                    valueFormatter: (item) => `${item.value}%`,
                    },
                ]}
                slotProps={{
                    legend: {
                        sx: {
                            '& .MuiChartsLegend-label': {
                            fontSize: '11px !important', 
                            },
                            [`& .${legendClasses.mark}`]: {
                                width: '10px',
                                height: '10px',
                                rx: '5px',
                                ry: '5px',
                            },
                            
                        },
                        direction: 'row',
                        position: {
                            vertical: 'top',
                            horizontal: 'middle',
                        },                            
                        padding: 0,  
                    },
                }}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                height={250}
                />  
            </div>
        
        </>
    )
}