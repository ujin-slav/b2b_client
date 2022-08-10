import {React,useContext,useEffect,useState,useRef} from 'react'
import {Card,Col,Row} from "react-bootstrap"
import {observer} from "mobx-react-lite"
import SpecOfferService from '../services/SpecOfferService'
import {useHistory} from 'react-router-dom'
import {Context} from "../index"
import dateFormat from "dateformat"
import {getCategoryName} from '../utils/Convert'
import { regionNodes } from '../config/Region'
import CardSpecOffer from '../pages/CardSpecOffer'
import { CARDSPECOFFER, CREATESPECOFFER } from '../utils/routes'
import ReactPaginate from "react-paginate"
import {CaretDownFill,CaretUpFill,PlusCircleFill} from 'react-bootstrap-icons'
import waiting from "../waiting.gif"

const Carousel = () => {

    const[visible,setVisible] = useState(true)
    const slider = useRef(null)

    let isDown = false
    let startX
    let scrollLeft
    
    const mouseDownHandler =(e) => {
        isDown = true
        startX = e.pageX - slider.current.offsetLeft
        scrollLeft = slider.current.scrollLeft

        slider.current.addEventListener('mouseup', mouseUpHandler )
        slider.current.addEventListener('mousemove', mouseMoveHandler )
    }

    const mouseUpHandler =(e) => {
        isDown = false

        slider.current.removeEventListener('mouseup', mouseUpHandler )
        slider.current.removeEventListener('mousemove', mouseMoveHandler )
    }

    const mouseMoveHandler =(e) => {
        if(!isDown) return
        e.preventDefault()
        const x = e.pageX - slider.current.offsetLeft
        const walk = (x - startX) * 2
        slider.current.scrollLeft = scrollLeft - walk
    }

    const mouseWheelHandler =(e) => {
        if (e.deltaY > 0) {
            slider.current.scrollLeft += 100;
            e.preventDefault();
        } else {
            slider.current.scrollLeft -= 100;
            e.preventDefault();
          }
    }

    useEffect(() => {
        const element = slider.current;

        element.addEventListener('mousedown', mouseDownHandler )
        element.addEventListener('wheel', mouseWheelHandler )
        return ()=>{
            element.removeEventListener('mousedown', mouseDownHandler )
            element.removeEventListener('wheel', mouseWheelHandler )
        }
      })

    return (
        <Card className='section sectionOffers'>
        <Card.Header className='sectionHeader headerAsks' 
        onClick={()=>setVisible(!visible)}>
          <div className='sectionName'>
          {visible ?
                <CaretUpFill className='caret'/>
                :
                <CaretDownFill className='caret'/>
            }
            Участники
          </div>
        </Card.Header>
        <div class="parentCarousel" ref={slider}>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
            <div class="childCarousel"></div>
        </div>
        </Card>
    )
}

export default Carousel