import {React,useContext,useEffect,useState} from 'react';
import {Card,Col,Row} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import SpecOfferService from '../services/SpecOfferService'
import {useHistory} from 'react-router-dom';
import {Context} from "../index";
import dateFormat from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { regionNodes } from '../config/Region';
import CardSpecOffer from '../pages/CardSpecOffer';
import { CARDSPECOFFER, CREATESPECOFFER } from '../utils/routes';
import ReactPaginate from "react-paginate";
import {CaretDownFill,CaretUpFill,PlusCircleFill} from 'react-bootstrap-icons';
import waiting from "../waiting.gif";

const UserSpecOffersTable = observer(({id}) => {
    const [loading,setLoading] = useState(true) 
    const {ask} = useContext(Context);
    const [specOffers, setSpecOffers] = useState([]);
    const[visible,setVisible] = useState(false);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0);
    const {user} = useContext(Context);
    const [currentPage,setCurrentPage] = useState(1)
    let limit = 10;

    useEffect(() => {
    if(visible){
        SpecOfferService.getSpecOfferUser({
          id,limit,page:currentPage}).then((data)=>{
          setSpecOffers(data.docs)
          setpageCount(data.totalPages)
        }).finally(()=>setLoading(false))
    }
      },[ask.categoryFilter,ask.regionFilter,ask.searchText,ask.searchInn,visible]);

    const fetchComments = async (currentPage) => {
        SpecOfferService.getSpecOfferUser({
            id,limit,page:currentPage}).then((data)=>{
            setSpecOffers(data.docs)
            setpageCount(data.totalPages)
        }).finally(()=>setLoading(false))
    };

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchComments(data.selected + 1);
    };

    
    if (loading){
        return(
            <Card className='section sectionOffers'>
            <Card.Header className='sectionHeaderOffer headerOffers' 
            onClick={()=>setVisible(!visible)}>
              <div className='sectionName'>
              {visible ?
                    <CaretUpFill className='caret'/>
                    :
                    <CaretDownFill className='caret'/>
                }
                Специальные предложения
              </div>
            </Card.Header>
              {visible ?
                  <img className="gifWaiting" src={waiting}/>
                :
                <div></div>
              }
              </Card>
        )
       }

    return (
        <Card className='section sectionOffers'>
        <Card.Header className='sectionHeaderOffer headerOffers' 
        onClick={()=>setVisible(!visible)}>
          <div className='sectionName'>
          {visible ?
                <CaretUpFill className='caret'/>
                :
                <CaretDownFill className='caret'/>
            }
            Специальные предложения
          </div>
        </Card.Header>
        {visible ?
        <div>
        <div className='parentSpec'>
            {specOffers.map((item)=>{
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
        {pageCount>2 ?
        <ReactPaginate
            previousLabel={"предыдущий"}
            nextLabel={"следующий"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
        />
        :
        <div></div>
        }
        </div>
        :
        <div></div>
        }
        </Card>
    );
});

export default UserSpecOffersTable;