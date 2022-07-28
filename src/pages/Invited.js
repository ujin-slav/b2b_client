import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK } from '../utils/routes';
import { fetchInvitedAsks} from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import dateFormat, { masks } from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import { CircleFill } from 'react-bootstrap-icons';
import {checkAccessAsk} from '../utils/CheckAccessAsk'

const Invited = observer(({authorId}) => {
    const {ask} = useContext(Context);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0);
    const [currentPage,setCurrentPage] = useState(1)
    const {user} = useContext(Context);
    const {chat} =  useContext(Context)
    let limit = 10;

    useEffect(() => {
        fetchInvitedAsks({
          email:user.user.email,
          limit,
          page:currentPage,
          userId:user.user.id
          }).then((data)=>{
          ask.setAsk(data.docs)
          setpageCount(data.totalPages);
          chat.socket.emit("get_unread");
        })
      },[]);

    const fetchComments = async (currentPage) => {
        fetchInvitedAsks({
        email:user.user.email,
        limit,page:currentPage}).then((data)=>{
        ask.setAsk(data.docs)
    })};

    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1);
      await fetchComments(data.selected + 1);
    };

    const redirect = (item)=>{
        history.push(CARDASK + '/' + item._id)
    }

    return (
      <div>
      <div className='parentSpecAsk'>
        {ask?.getAsk()?.map((item,index)=>{
          return (
            <div onClick={()=>redirect(item)} className='childSpecAsk'>
            <Card>
              <Card.Header>
              <div className="specName">
                    {item.Name.length>15 ?
                    `${item.Name.substring(0, 15)}...`
                    :
                    item.Name
                    }
            </div>
            </Card.Header>
            <div className='cardPadding'>
            <div>
            Текст: {item.Text.length>50 ?
            `${item.Text.substring(0, 50)}...`
             :
             item.Text
             }
            </div>
            <div>
                    {Date.parse(item.EndDateOffers) > new Date().getTime() ?
                    <div style={{color:"green"}}>
                    Активная
                    </div>
                    :
                    <div style={{color:"red"}}>
                    Истек срок
                    </div>
                    } 
            </div>
            <div>
                    <div>ИНН: {item.Author.inn}</div>
                    <div>Орг: {item.Author.nameOrg}</div>
            </div>
            <div className="specCloudy">
                {getCategoryName(item.Region, regionNodes).join(", ").length>40 ?
                `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 40)}...`
                :
                getCategoryName(item.Region, regionNodes).join(", ")
                }
            </div>
            <div className="specCloudy">
                {getCategoryName(item.Category, categoryNodes).join(", ").length>40 ?
                `${getCategoryName(item.Category, categoryNodes).join(", ").substring(0, 40)}...`
                :
                getCategoryName(item.Category, categoryNodes).join(", ")
                }
            </div>
            <div className="specCloudy">
                {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
            </div>
            </div>
            </Card>
            </div>
        )})}  
       
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
    );
});

export default Invited;