import React, {useEffect} from 'react'
import ReactApexChart from 'react-apexcharts'

export default function TreeMap({native, invasive, naturalized, canopyField}){
    const [data, setData] = React.useState(null)
        
    useEffect(()=>{
        let mapData = {
            series: [
            {
                name: 'Native',
                data: native,
                parsing: {
                    x: 'common',
                    y: "PlantCoverage"
                }
            },
            {
                name: 'Invasive',
                data: invasive,
                parsing: {
                    x: 'common',
                    y: "PlantCoverage"
                }
            },
            {
                name: 'Naturalized',
                data: naturalized,
                parsing: {
                    x: 'common',
                    y: "PlantCoverage"
                }
            },  
            ],
            options: {
            legend: {
                show: true,
                offsetY: 10,
                height: 30,
            },
            chart: {
                height: 400,
                width: 200,
                type: 'treemap',
            },
            dataLabels: {
                enabled: true,
                style: {
                  fontSize: '16px', // Increase font size here (default is usually '12px')
                  fontWeight: 'bold',
                  fontFamily: 'Helvetica, Arial, sans-serif'
                }
            },
            title: {
                text: 'Species at this site',
                align: 'center',
            },
            },
        }
        setData(mapData)
    }, [native, invasive, naturalized])   
        

  return (
    <div>
      <div id="treemap">
        {data && <ReactApexChart
          options={data.options}
          series={data.series}
          
          type="treemap"
          height={400}
        />}
      </div>
    </div>
  )
}

