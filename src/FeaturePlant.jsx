import { useEffect, useState } from "react";
import "./panelcontainer.css";

export default function FeaturePlant({map, layers, plantData, images}) {
    const [selectedImage, setSelectedImage] = useState(null)
    useEffect(()=>{
        let imagesArr = images.split(",")
        let randomIndex = Math.floor(Math.random() * imagesArr.length)
        setSelectedImage(imagesArr[randomIndex])
    },[])

    return(
        <div className="feature-plant"> 
            {/* <div>{plantData.common}</div> */}
            <img className="feature-img" src={selectedImage}/>
        </div>
    )
}