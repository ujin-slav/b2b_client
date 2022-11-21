import {React,useRef,useEffect,useState} from 'react'
import SpecOfferService from '../services/SpecOfferService'
import {useHistory} from 'react-router-dom'
import { CARDSPECOFFER } from '../utils/routes'
import {getCategoryName} from '../utils/Convert'
import { regionNodes } from '../config/Region'
import dateFormat from "dateformat"

const SimilarSpecOffers = ({categoryFilter,regionFilter,redirect}) => {

    let limit = 10
    const [specOffers, setSpecOffers] = useState([]);
    const [loading,setLoading] = useState(true) 
    const[fetching,setFetching] = useState(true)
    const[totalDocs,setTotalDocs] = useState(0)
    const[page,setPage] = useState(1)
    const history = useHistory()
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
            if(specOffers.length===0 || specOffers.length<totalDocs) {
            SpecOfferService.getFilterSpecOffer({
              filterCat:categoryFilter,
              filterRegion:regionFilter,          
              searchText:"",
              searchInn:"",
              limit,page:1}).then((data)=>{
              setSpecOffers([...specOffers, ...data.docs])
              setTotalDocs(data.totalDocs)
              setPage(prevState=>prevState + 1)
            }).finally(()=>setLoading(false))
            }
        }  
    },[fetching]);

    return (
        <div>
            <div className="specContact">
                <span>Похожие предложения</span>
            </div>
            <div class="parentCarousel" id="slider" ref={slider}>
            {specOffers.map((item,index)=>
                    <div key={index} class="childCarouselSimilar">
                        <img 
                        className="logo"
                        src={process.env.REACT_APP_API_URL + `getpic/` + item?.Files[0]?.filename} />
                        <div className="specName" onClick={(e)=>redirect(e,item._id)}>
                            {item.Name}
                        </div>
                        <div className="specPrice">
                            {item.Price} ₽
                        </div>
                        <div className="specNameOrg">
                            {item.NameOrg}
                        </div>
                        <div className="specCloudy">
                            {getCategoryName(item.Region, regionNodes).join(", ").length>40 ?
                            `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 40)}...`
                            :
                            getCategoryName(item.Region, regionNodes).join(", ")
                            }
                        </div>
                        <div className="specCloudy">
                            {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
                        </div>
                </div>
            )}
            </div>
        </div>
    )

}

export default SimilarSpecOffers;