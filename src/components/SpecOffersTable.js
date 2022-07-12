import {React,useContext,useEffect,useState} from 'react';
import {Card,Col,Row} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import SpecOfferService from '../services/SpecOfferService'
import {useHistory} from 'react-router-dom';
import {Context} from "../index";

const SpecOffersTable = observer(() => {
    const {ask} = useContext(Context);
    const [specOffers, setSpecOffers] = useState([]);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0);
    const {user} = useContext(Context);
    const [currentPage,setCurrentPage] = useState(1)
    let limit = 10;

    useEffect(() => {
        SpecOfferService.getFilterSpecOffer({
          filterCat:ask.categoryFilter,
          filterRegion:ask.regionFilter,
          searchText:ask.searchText,
          searchInn:ask.searchInn,
          limit,page:currentPage}).then((data)=>{
          setSpecOffers(data.docs)
          setpageCount(data.totalPages);
          console.log(data.docs)
        })
      },[ask.categoryFilter,ask.regionFilter,ask.searchText,ask.searchInn]);

    const fetchComments = async (currentPage) => {
        SpecOfferService.getFilterSpecOffer({
        filterCat:ask.categoryFilter,
        filterRegion:ask.regionFilter,
        searchText:ask.searchText,
        searchInn:ask.searchInn,
        limit,page:currentPage}).then((data)=>{
        setSpecOffers(data.docs)
    })};

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchComments(data.selected + 1);
    };

    return (
        <div className='parentSpec'>
            {specOffers.map((item)=>{
                console.log(item)
            return(
                <div className='childSpec'>
                    <img 
                    className="fotoSpec"
                    src={process.env.REACT_APP_API_URL + `getpic/` + item.Files[0].filename} />
                    <div>
                        {item.Text}
                    </div>
                    <div>
                        {item.Price}
                    </div>
                    <div>
                        {item.NameOrg}
                    </div>
                    <div>
                        {item.Text}
                    </div>
                    <div>
                        {item.Date}
                    </div>
                </div>
            )
            })}
        </div>
    );
});

export default SpecOffersTable;