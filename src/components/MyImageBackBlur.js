import React, {useState } from "react"
import noImage from "../icons/noImage.svg";
import MyImage from '../components/MyImage'

const MyImageBackBlur = (props) => {

  const [hasErrorMyImage, setHasErrorMyImage] = useState(false)

  if(hasErrorMyImage){
    return  <img className={"fotoSpec"} src={noImage}/>
  }

  return (
    <span className="mt-2 mb-3" style={{ 'display': 'grid' }}>
      <MyImage
        className={"fotoSpec"}
        disabled={false}
        src={process.env.REACT_APP_API_URL + `getlogo/` + props?.src}
        onError={() => setHasErrorMyImage(true)} />
      <div className="ImgSpecWrapper">
        <MyImage
          src={process.env.REACT_APP_API_URL + `getlogo/` + props?.src}
          disabled={false}
          className={"fotoSpecBack"}
          onError={() => setHasErrorMyImage(true)}
        />
      </div>
    </span>
  )
}

export default MyImageBackBlur;
