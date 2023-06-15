import {React,useEffect,useState,useRef,useContext} from 'react'
import {Card} from "react-bootstrap"
import {CaretDownFill,CaretUpFill,PlusCircle} from 'react-bootstrap-icons'
import CarouselService from '../services/CarouselService'
import ContrService from '../services/ContrService';
import {useHistory} from 'react-router-dom';
import {ORGINFO} from "../utils/routes";
import {Context} from "../index";

const Carousel = () => {

    const[visible,setVisible] = useState(true)
    const history = useHistory()
    const[carousel,setCarousel] = useState([])
    const[fetching,setFetching] = useState(true)
    const[totalDocs,setTotalDocs] = useState(0)
    const {user} = useContext(Context);
    const {myalert} = useContext(Context);
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
                CarouselService.getCarousel({search:"",limit,page,user:user.user.id}).then((data)=>{
                if(data){
                    setTotalDocs(data.totalDocs);
                    setCarousel([...carousel, ...data.docs]);
                    setPage(prevState=>prevState + 1)
                }
            }).finally(()=>setFetching(false))
            }
        }  
    },[fetching]);

    const addContr = async(item)=>{
        console.log(item)
        const result = await ContrService.addContr({contragent:item._id,userid:user.user.id})
        if (result.errors){
            myalert.setMessage(result.message); 
        } else {
            myalert.setMessage("Успешно") 
            const newCarousel = carousel.map((el)=>{
                if(el._id === item._id){
                    el.contrIs = true
                }
                return el
            })
            console.log(newCarousel)
            setCarousel(newCarousel)
        }
    }

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
                <div className="cardContrHead">
                    <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + item?._id)}>
                    <div>{item?.nameOrg}</div>
                    </a>
                    <div>{item?.inn}</div>
                    {user.isAuth && !item.contrIs ? 
                        <PlusCircle 
                            class='plusContr'
                            onClick={(e)=>addContr(item)}
                        /> 
                        : 
                        <div></div>
                    }
                </div>
                <img className="logo" src={process.env.REACT_APP_API_URL + `getlogo/` + item?.logo?.filename} />
            </div>
        )}
        </div>
        </Card>
    )
}

export default Carousel