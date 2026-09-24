import React, {useEffect, useState } from 'react';
import "./panelcontainer.css";
import LpiSiteFeature from './LpiSiteFeature';
import RsaSiteFeature from './RsaSiteFeature';

export default function RightPanel({data}) {
    return(
        <div className='right-panel'>
            {data.type == "lpi" && <LpiSiteFeature data={data}/>}
            {data.type == "rsa" && <RsaSiteFeature data={data.siteData}/>}
        </div>
    )
}
