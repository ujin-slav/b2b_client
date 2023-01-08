import {React,useEffect,useState,useRef} from 'react'
import {Card} from "react-bootstrap"
import {CaretDownFill,CaretUpFill} from 'react-bootstrap-icons'
import CarouselService from '../services/CarouselService'
import {useHistory} from 'react-router-dom';
import {ORGINFO} from "../utils/routes";

const Carousel = () => {

    const[visible,setVisible] = useState(true)
    const history = useHistory()
    const[carousel,setCarousel] = useState([])
    const[fetching,setFetching] = useState(true)
    const[totalDocs,setTotalDocs] = useState(0)
    const[page,setPage] = useState(1)
    const slider = useRef(null)

    let isDown = false
    let startX
    let scrollLeft
    let limit = 10
    
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

    const scrollHandler =(e) => {
        if((e.target.scrollWidth - e.target.offsetWidth)<e.target.scrollLeft+1){
            setFetching(true)
        }
    }

    useEffect(() => {
        const element = slider.current;

        element.addEventListener('mousedown', mouseDownHandler )
        element.addEventListener('wheel', mouseWheelHandler )
        element.addEventListener('scroll', scrollHandler )
        return ()=>{
            element.removeEventListener('mousedown', mouseDownHandler )
            element.removeEventListener('wheel', mouseWheelHandler )
            element.addEventListener('scroll', scrollHandler )
        }
      },[])

    useEffect(() => {
        if(fetching){
            if(carousel.length===0 || carousel.length<totalDocs) {
                CarouselService.getCarousel({search:"",limit,page}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setCarousel([...carousel, ...data.docs]);
                setPage(prevState=>prevState + 1)
            }).finally(()=>setFetching(false))
            }
        }  
    },[fetching]);

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
        <div class="parentCarousel" id="slider" ref={slider}>
        {carousel.map((item,index)=>
            <div key={index} class="childCarousel">
                <div className="carouselHead">
                    <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + item?._id)}>
                    <div>{item?.nameOrg}</div>
                    </a>
                    <div>{item?.inn}</div>
                </div>
                <img className="logo" src={process.env.REACT_APP_API_URL + `getlogo/` + item?.logo?.filename} />
            </div>
        )}
        </div>
        </Card>
    )
}

export default Carousel