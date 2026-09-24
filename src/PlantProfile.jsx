import React, {useEffect, useState} from 'react';

export default function PlantProfile({map, plantObsData}){   
    const [parsedObsInst, setParsedObsInst] = useState(null) 
    
    useEffect(()=>{
        if (parsedObsInst == null){
            let shuffled = [...plantObsData].sort(() => 0.5 - Math.random())
            setParsedObsInst(shuffled[0])
        }
    })

    return(
        <div className="plant-profile">         
            {parsedObsInst && <div className="plant-name">{parsedObsInst.scientific}</div>}
            {parsedObsInst && <img src={parsedObsInst.image_url}/>}
        </div>
    )
}