import React,{useState,useEffect,useContext} from 'react';
import { CaretLeft,CaretRight,XLg} from 'react-bootstrap-icons';

const FotoSlider = ({fotoArray, show,setShow,fotoFocus,setFotoFocus}) => {

    if(!show){
        return (
            <div>      
            </div>
        );
    }

    const rightNav = () => {
        if(fotoFocus+1===fotoArray.length){
            setFotoFocus(0)
        }else{
            setFotoFocus(fotoFocus+1)
        }
    }
    const leftNav = () => {
        if(fotoFocus===0){
            setFotoFocus(fotoArray.length-1)
        }else{
            setFotoFocus(fotoFocus-1)
        }
    }

    return (
        <div className='fotoSlider'>
            <div className='leftNav'>
                <CaretLeft color="white" style={{"width": "80px", "height": "80px"}} 
                onClick={()=>leftNav()}
                />
            </div>
            <div>
                <img className='fotoSliderImg' src={process.env.REACT_APP_API_URL + `getpic/` + fotoArray[fotoFocus]?.filename}/> 
            </div>
            <div className='rightNav'>
                <CaretRight color="white" style={{"width": "80px", "height": "80px"}} 
                onClick={()=>rightNav()}
                />
            </div>
            <div>
                <XLg color="white" style={{"width": "50px", "height": "50px"}} 
                onClick={()=>setShow(false)}/>
            </div>
        </div>

    );
};

export default FotoSlider;