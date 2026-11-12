import React, { useEffect, useState } from 'react';
import "./panelcontainer.css";
import SiteCanopyOverview from './SiteCanopyOverview';
import Papa from "papaparse";
import CanopyPieChart from './CanopyPieChart';
import GroundcoverVis from './GroundcoverVis';
let woodyFn = "rsa_site_woody.csv" 
let groundFn = "rsa_site_ground.csv" 

const canopyColors = {
    "Seedlings": "#c5db58", 
    "Midstory (2 - 9cm DBH)": "#edb611", 
    "Overstory (10-30cm DBH)": "#f3abf7",
    "Overstory (31-50cm DBH)": "#ac51b0",
    "Overstory (51-75cm DBH)": "#7d1487",
    "Overstory (>75cm DBH)": "#59004d"
}


export default function RsaSiteFeature({siteData, plantProfiles}) {
    const [canopyProfile, setCanopyProfile] = useState([])
    const [woodySpecies, setWoodySpecies] = useState(null)
    const [groundSpecies, setGroundSpecies] = useState(null)

    function generateCanopyChart(setter, src){
        let chart = []
        src.map((item, index) =>{
            let data = item.split(":")
            let label = data[0]
            chart.push({id: index, value: data[1], label: data[0], color: canopyColors[label]})  
        })
        setter(chart)
    }
    
    function getSiteSpecies(){
        Papa.parse(woodyFn, {
            download: true,
            delimiter: ",",
            header: true,        
            complete: function (results) {
                let filtered = results.data.filter((row)=>row.SurveyID4 === siteData.SurveyID4)
                console.log(filtered.data)
                setWoodySpecies(filtered)
            }
        })
        Papa.parse(groundFn, {
            download: true,
            delimiter: ",",
            header: true,        
            complete: function (results) {
                let filtered = results.data.filter((row)=>row.SurveyID4 == siteData.SurveyID4)
                setGroundSpecies(filtered)
            }
        })
    }

    useEffect(()=>{
        generateCanopyChart(setCanopyProfile, siteData.CanopyProfile)
        getSiteSpecies()
    }, [siteData])

    return (
        <>
        {woodySpecies && groundSpecies &&
            <div className="rsa-site">
                    <div className='rsa-site-heading'>{siteData.SiteName != "N/A" ?  (siteData.SiteName) : ""}</div>
                    <div className="rsa-content">
                        <div className="data-description">This site was assessed by the Natural Areas Conservancy in 2018-2021 via Rapid Site Assessments. The charts below highlight the species breakdown identified across each canopy level at this site.</div>
                        <div className="site-overview">
                            <div className="overview-entry"><span>Invasive herbaceous cover (%): </span><span>{siteData.Invasive_Herb_Perc}</span></div>
                            <div className="overview-entry"><span>Native herbaceous cover (%): </span><span>{siteData.Native_Herb_Perc}</span></div>
                            <div className="overview-multi"><span>Native woody stems per hectare:</span>
                                <div><span>Seedlings: </span><span>{Math.round(siteData.Native_Tree_Seedlings_Ha)}</span></div>
                                <div><span>Midstory: </span><span>{Math.round(siteData.Native_Midstory_Ha)}</span></div>
                                <div><span>Overstory: </span><span>{Math.round(siteData.Survey_1_Native_Overstory_m2_BA_Ha)}</span></div>
                            </div>

                        </div>

                        {/* Make dropdown to toggle between woody and groundcover */}
                        <div className="rsa-site-info site-herb">
                            <div className="section-heading">Herbaceous Plants & <br></br>Woody Plants &lt; 2cm</div>
                            <div className="section-body">
                                <div className="data-description">This section includes vascular plant species (herbaceous, vine, and woody species w/ DBH &lt; 2cm) with foliage growing
                                below breast height (1.37m/4.5ft)</div>
                                <GroundcoverVis siteSpecies={groundSpecies} title="Groundcover"/>
                            </div>
                        </div>
                        <div className="rsa-site-info site-woody">
                            <div className="section-heading">Woody Plants</div>
                            <div className="section-body">
                                <div className="data-description">This section includes woody plants (defined as having a tree or shrub growth form in the <a href="https://plants.sc.egov.usda.gov">USDA PLANTS Database</a></div>
                                <CanopyPieChart chartData={canopyProfile} canopyColors={canopyColors} title="Canopy Overview"/>
                                <SiteCanopyOverview siteSpecies={woodySpecies} title="Identified at this site" canopyField="PlantCoverage" siteID={siteData.SITE_ID}/>
                                <div className="heading">Species by canopy level</div>
                                <SiteCanopyOverview siteSpecies={woodySpecies} title="Seedlings" canopyField="SeedlingCoverage" siteID={siteData.SITE_ID}/>
                                <SiteCanopyOverview siteSpecies={woodySpecies} title="Midstory (2 - 9cm DBH)" canopyField="MidstoryCoverage" siteID={siteData.SITE_ID}/>
                                <SiteCanopyOverview siteSpecies={woodySpecies} title="Overstory (10 - 30cm DBH)" canopyField="Overstory_1_Coverage" siteID={siteData.SITE_ID}/>
                                <SiteCanopyOverview siteSpecies={woodySpecies} title="Overstory (31 - 50cm DBH)" canopyField="Overstory_2_Coverage" siteID={siteData.SITE_ID}/>
                                <SiteCanopyOverview siteSpecies={woodySpecies} title="Overstory (51 - 75cm DBH)" canopyField="Overstory_3_Coverage" siteID={siteData.SITE_ID}/>
                                <SiteCanopyOverview siteSpecies={woodySpecies} title="Overstory (&gt;75cm DBH)"canopyField="Overstory_4_Coverage" siteID={siteData.SITE_ID}/> 
                            </div>
                        </div>   
                    </div>
                    
            </div>}
        </>
    )
}

