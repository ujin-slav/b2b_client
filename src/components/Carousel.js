import {React,useEffect,useState,useRef,useContext} from 'react'
import {Card} from "react-bootstrap"
import {CaretDownFill,CaretUpFill,PlusCircle} from 'react-bootstrap-icons'
import CarouselService from '../services/CarouselService'
import ContrService from '../services/ContrService';
import {useHistory} from 'react-router-dom';
import {ORGINFO, CREATEPRICEASK, CREATEPRICEASKFIZ} from "../utils/routes";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import MyImage from '../components/MyImage'

const Carousel =  observer(() => {

    const[visible,setVisible] = useState(false)
    const history = useHistory()
    const[carousel,setCarousel] = useState([])
    const[fetching,setFetching] = useState(true)
    const[loading,setLoading] = useState(true)
    const[totalDocs,setTotalDocs] = useState(0)
    const[totalPage,setTotalPage] = useState(0)
    const {user} = useContext(Context);
    const {ask} = useContext(Context);
    const {myalert} = useContext(Context);
    const[page,setPage] = useState(1)
    const slider = useRef(null)

    let isDown = false
    let startX
    let scrollLeft
    let limit = 8
    
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
        console.log(e)
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
        if(visible){
            const element = slider.current;

            element.addEventListener('mousedown', mouseDownHandler )
            element.addEventListener('wheel', mouseWheelHandler )
            element.addEventListener('scroll', scrollHandler )
            return ()=>{
                element.removeEventListener('mousedown', mouseDownHandler )
                element.removeEventListener('wheel', mouseWheelHandler )
                element.addEventListener('scroll', scrollHandler )
            }
        }
      },[visible])

    useEffect(() => {
        if(user.isFetching){
            return
        }
        if(!loading){
                CarouselService.getCarousel({
                    filterCat:ask.categoryFilter,
                    filterRegion:ask.regionFilter,
                    searchInn:ask.searchInn,
                    limit,
                    page:1,
                    user:user.user.id}).then((data)=>{
                    setTotalDocs(data.totalDocs);
                    setCarousel(data.docs);
                    setPage(2)
                })}  
    },[ask.categoryFilter,ask.regionFilter,ask.searchText,ask.searchInn,user.isFetching]);

    useEffect(() => {
        if(user.isFetching){
            return
        }
        if(carousel.length===0 || carousel.length<=totalDocs) {
                CarouselService.getCarousel({
                    filterCat:ask.categoryFilter,
                    filterRegion:ask.regionFilter,
                    searchInn:ask.searchInn,
                    limit,
                    page,
                    user:user.user.id}).then((data)=>{
                if(data){
                    setTotalDocs(data.totalDocs);
                    setCarousel([...carousel, ...data.docs]);
                    setTotalPage(data.page)
                    setPage(prevState=>prevState + 1)
                }
            }).finally(()=>{
                setFetching(false)
                setLoading(false)
            })}
    },[fetching,user.isFetching]);

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
        {visible ?
            <div>
                <div class="parentCarousel" id="slider" ref={slider}>
                    {carousel.map((item,index)=>
                        <div key={index} class="childCarousel">
                            <div>
                                <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + item?._id)}>
                                    <div>{item?.nameOrg}</div>
                                    <div>{item?.name}</div>
                                </a>
                            </div>
                            <span className="mt-2 mb-3" style={{'display':'grid'}}>
                                <MyImage 
                                    className={"fotoSpec"}
                                    disabled={false}
                                    src={process.env.REACT_APP_API_URL + `getlogo/` + item?.logo?.filename} />
                                    <div className="ImgSpecWrapper">
                                        <MyImage
                                        src={process.env.REACT_APP_API_URL + `getlogo/` + item?.logo?.filename}
                                        disabled={false}
                                        className={"fotoSpecBack"}
                                        />
                                    </div>
                            </span>
                            {item.contrIs === false ? 
                                <button 
                                    className="myButtonMessage mt-0 w-100"
                                    onClick={(e)=>addContr(item)}>
                                    Добавить в контрагенты
                                </button>
                                : 
                                <div></div>
                            }
                            <button 
                                className="myButtonMessage mt-0 w-100"
                                onClick={()=>{
                                    if(user.isAuth){
                                        history.push(CREATEPRICEASK + '/' + item?._id)
                                    }else{
                                        history.push(CREATEPRICEASKFIZ + '/' + item?._id)
                                    }
                                }}>
                                Создать заявку
                            </button>
                        </div>
                    )}
                </div>
            </div>
        :
            <div></div>
        }
        </Card>
    )
})

export default Carousel