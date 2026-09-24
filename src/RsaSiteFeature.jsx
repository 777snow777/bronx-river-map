import React, {useEffect, useState } from 'react';
import "./panelcontainer.css";

export default function RsaSiteFeature({data}) {

    return (
        <>
        <h2>Rapid Site Assessemnt {data.SITE_ID != "N/A" && ": " && data.SITE_ID}</h2>
        {data && <div className="site-plants">
            <h3 className="plant-category">Seedlings</h3>
            <div className="plant-list">{data.Seedlings_List}</div>
            <h3 className="plant-category">Midstory Plants</h3>
            <div className="plant-list">{data.Midstory_List}</div>
            <h3 className="plant-category">Overstory (10cm-30cm) Plants</h3>
            <div className="plant-list">{data.Overstory_Tier1_List}</div>
            <h3 className="plant-category">Overstory (31cm-50cm) Plants</h3>
            <div className="plant-list">{data.Overstory_Tier2_List}</div>
            <h3 className="plant-category">Overstory (51cm-75cm) Plants</h3>
            <div className="plant-list">{data.Overstory_Tier3_List}</div>
            <h3 className="plant-category">Overstory (&gt;75cm) Plants</h3>
            <div className="plant-list">{data.Overstory_Tier4_List}</div>
        </div>}
        </>
    )
}

