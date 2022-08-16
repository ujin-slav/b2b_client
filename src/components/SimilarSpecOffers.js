import {React,useContext,useEffect,useState} from 'react';
import SpecOfferService from '../services/SpecOfferService'
import {useHistory} from 'react-router-dom';
import dateFormat from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { regionNodes } from '../config/Region';
import { CARDSPECOFFER } from '../utils/routes';

const SimilarSpecOffers = ({categoryFilter,regionFilter}) => {

    let limit = 6 
    const [specOffers, setSpecOffers] = useState([]);
    const [loading,setLoading] = useState(true) 
    const history = useHistory();

    useEffect(() => {
            SpecOfferService.getFilterSpecOffer({
              filterCat:categoryFilter,
              filterRegion:regionFilter,          
              searchText:"",
              searchInn:"",
              limit,page:1}).then((data)=>{
              setSpecOffers(data.docs)
            }).finally(()=>setLoading(false))
    },[]);

    return (
        <div>
             {specOffers?.map((item)=>{
            return(
                <div onClick={()=>history.push(CARDSPECOFFER + '/' + item._id)} className='childSpec'>
                    <img 
                    className="fotoSpec"
                    src={process.env.REACT_APP_API_URL + `getpic/` + item?.Files[0]?.filename} />
                    <div className="specName">
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
            )
            })}
        </div>
    );
};

export default SimilarSpecOffers;