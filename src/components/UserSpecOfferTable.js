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

const UserSpecOffersTable = observer(({id}) => {
    const [loading,setLoading] = useState(true) 
    const {ask} = useContext(Context);
    const [specOffers, setSpecOffers] = useState([]);
    const[visible,setVisible] = useState(false);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const [pageCount, setPageCount] = useState(0);
    const {user} = useContext(Context);
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const [fetching,setFetching] = useState(true)
    const [currentPage,setCurrentPage] = useState(1)
    let limit = 10;

    useEffect(() => {
    if(visible){
        setLoading(true)
        SpecOfferService.getSpecOfferUser({
            id,
            limit,
            search:"",
            page:currentPage,
            startDate,
            endDate
            }).then((data)=>{
                    setSpecOffers(data.docs);
                    setPageCount(data.totalPages);
                    setCurrentPage(data.page)
        }).finally(
            ()=>setLoading(false)
        )
    }
      },[fetching,visible]);


    const fetchPage = async (currentPage) => {
        setCurrentPage(currentPage)
        setFetching(!fetching)
    };

    const handlePageClick = async (data) => {
        await fetchPage(data.selected + 1);
    }

    
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
                  <div class="loader">Loading...</div>
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
            forcePage = {currentPage-1}
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