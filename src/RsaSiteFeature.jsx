import React, { useEffect, useState } from 'react';
import "./panelcontainer.css";
import SpeciesPieChart from './SpeciesPieChart';
import TreeMap from './TreeMap';
import Papa from "papaparse";
import CanopyPieChart from './CanopyPieChart';
let plantsFn = "rsa_site_obs.csv"


export default function RsaSiteFeature({siteData, plantProfiles, map}) {
    const [canopyProfile, setCanopyProfile] = useState([])
    const [siteSpecies, setSiteSpecies] = useState(null)

    function generateCanopyChart(setter, src){
        let chart = []
        let other = 0
        let canpopyColors = ["#ded85b", "#7baac9", "#a3005a", "#2ab500","#de7a40","#004219"]
        src.map((item, index) =>{
            let data = item.split(":")
            chart.push({id: index, value: data[1], label: data[0], color: canpopyColors[index]})  
        })
        setter(chart)
    }
    
    function getSiteSpecies(){
        Papa.parse(plantsFn, {
            download: true,
            delimiter: ",",
            header: true,        
            complete: function (results) {
                let filtered = results.data.filter((row)=>row.SurveyID4.slice(0,12) == siteData.SITE_ID)
                setSiteSpecies(filtered)
            }
        })
    }

    function generateTreeMapData(){
        Papa.parse(plantsFn, {
            download: true,
            delimiter: ",",
            header: true,        
            complete: function (results) {
                let native =[]
                let invasive =[]
                let naturalized =[]
                let filtered = results.data.filter((row)=>row.SurveyID4.slice(0,12) == siteData.SITE_ID)
                filtered.forEach((row)=>{
                    if (row.category =="Native"){
                        native.push(row)
                    }else if (row.category =="Invasive"){
                        invasive.push(row)
                    }else{
                        naturalized.push(row)
                    }
                })
                setNativeList(native)
                setInvasiveList(invasive)
                setNaturalizedList(naturalized)
            }
        })
    }

    useEffect(()=>{
        generateCanopyChart(setCanopyProfile, siteData.CanopyProfile)
        getSiteSpecies()
    }, [])

    return (
        <>
        {siteSpecies &&
            <div className="right-panel">
                    <div className='heading'>Rapid Site Assessement Site{siteData.SiteName != "N/A" ?  (": " + siteData.SiteName) : ""}</div>
                    <div className="data-description">This site was assessed by the Natural Areas Conservancy in 2018-2019 via Rapid Site Assessments. The charts below highlight the species breakdown identified across each canopy level at this site.</div>
                    <CanopyPieChart chartData={canopyProfile} title="Canopy Profile"/>
                    {/* <TreeMap native={nativeList} invasive={invasiveList} naturalized={naturalizedList} canopyField="PlantCoverage"/> */}
                    <SpeciesPieChart siteSpecies={siteSpecies} title="All plants identified at this Site" canopyField="PlantCoverage" siteID={siteData.SITE_ID}/>
                    <SpeciesPieChart siteSpecies={siteSpecies} title="Seedlings" canopyField="SeedlingCoverage" siteID={siteData.SITE_ID}/>
                    <SpeciesPieChart siteSpecies={siteSpecies} title="Midstory (2 - 9cm DBH)" canopyField="MidstoryCoverage" siteID={siteData.SITE_ID}/>
                    <SpeciesPieChart siteSpecies={siteSpecies} title="Overstory (10 - 30cm DBH)" canopyField="Overstory_1_Coverage" siteID={siteData.SITE_ID}/>
                    <SpeciesPieChart siteSpecies={siteSpecies} title="Overstory (31 - 50cm DBH)" canopyField="Overstory_2_Coverage" siteID={siteData.SITE_ID}/>
                    <SpeciesPieChart siteSpecies={siteSpecies} title="Overstory (51 - 75cm DBH)" canopyField="Overstory_3_Coverage" siteID={siteData.SITE_ID}/>
                    <SpeciesPieChart siteSpecies={siteSpecies} title="Overstory (&gt;75cm DBH)"canopyField="Overstory_4_Coverage" siteID={siteData.SITE_ID}/> 
            </div>}
        </>
    )
}

