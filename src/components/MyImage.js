import React, { useCallback, useEffect, useState } from "react"
import noImage from "../icons/noImage.svg";

const MyImage = (props) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const setLoadingTrue = useCallback(() => {
    setLoaded(true)
  }, [])

  const setErrorTrue = useCallback(() => {
    setError(true)
    if (props.onError) {
        props.onError() // Сообщаем родителю об ошибке
    }
  }, [props.onError])

  useEffect(() => {
    const img = new Image()

    if (props.src) {
      img.src = props.src

      setLoaded(false)
      setError(false)

      img.addEventListener("load", setLoadingTrue)
      img.addEventListener("error", setErrorTrue)
    }

    return () => {
      img.removeEventListener("load", setLoadingTrue)
      img.removeEventListener("error", setErrorTrue)
    }
  }, [props.src, setLoadingTrue, setErrorTrue])

  const imgLoading = props.src && !loaded && !error
  const imgFailed = !props.src || error

  if(imgLoading){
    return  <div class="loader">Loading...</div>
  }

  if(imgFailed){
    <img src={noImage}/>
  }

  if(props.disabled){
    return(<></>)
  }

  return (
        <img {...props}></img>
    )
}

export default MyImage;
