import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {
  Table,
  Card
} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK } from '../utils/routes';
import { fetchFilterAsks,fetchUser } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import dateFormat, { masks } from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import { CircleFill,CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
import {checkAccessAsk} from '../utils/CheckAccessAsk'

const TableAsk = observer(({authorId}) => {
    const {ask} = useContext(Context);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const[visible,setVisible] = useState(false);
    const [pageCount, setpageCount] = useState(0);
    const {user} = useContext(Context);
    const [currentPage,setCurrentPage] = useState(1)
    let limit = 10;

    useEffect(() => {
        fetchFilterAsks({
          filterCat:ask.categoryFilter,
          filterRegion:ask.regionFilter,
          searchText:ask.searchText,
          searchInn:ask.searchInn,
          limit,page:currentPage}).then((data)=>{
          ask.setAsk(data.docs)
          setpageCount(data.totalPages);
        })
      },[ask.categoryFilter,ask.regionFilter,ask.searchText,ask.searchInn]);

    const fetchComments = async (currentPage) => {
      fetchFilterAsks({
        filterCat:ask.categoryFilter,
        filterRegion:ask.regionFilter,
        searchText:ask.searchText,
        searchInn:ask.searchInn,
        limit,page:currentPage}).then((data)=>{
        ask.setAsk(data.docs)
    })};

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchComments(data.selected + 1);
    };

    const redirect = (item)=>{
      if(checkAccessAsk(user,item).Open){
        history.push(CARDASK + '/' + item._id)
      } else {
        myalert.setMessage("Пользователь ограничил участников");
      }
    }

    return (
      <Card className='section'>
        <Card.Header className='sectionHeader headerAsks' 
        onClick={()=>setVisible(!visible)}>
          <div className='sectionName'>
          {visible ?
                <CaretUpFill className='caret'/>
                :
                <CaretDownFill className='caret'/>
            }
            Заявки
          </div>
        </Card.Header>
        {visible ?
        <div>
        <div className='parentSpec'>
        {ask?.getAsk().map((item,index)=>{
          if(checkAccessAsk(user,item).Open){
            return (
                <div onClick={()=>redirect(item)} className='childSpec'>
                <div className="specName">
                        {item.Name.length>15 ?
                        `${item.Name.substring(0, 15)}...`
                        :
                        item.Name
                        }
                </div>
                <div className="specPrice">
                        {Date.parse(item.EndDateOffers) > new Date().getTime() ?
                        <span className="tdGreen">
                        Активная
                        </span>
                        :
                        <span className="tdRed">
                        Истек срок
                        </span>
                        } 
                </div>
                <div className="specNameOrg">
                        <div>{item.Author.inn}</div>
                        <div>{item.Author.nameOrg}</div>
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
          } else{ 
            return ("No")
        }})}  
        </div>
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
          </div> 
          :
          <div></div>
          }
      </Card>
    );
});

export default TableAsk;