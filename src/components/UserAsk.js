import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {
  Table,
  Card
} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK,CREATEASK } from '../utils/routes';
import { fetchUserAsks} from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import dateFormat, { masks } from "dateformat";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import { PlusCircleFill,CaretDownFill,CaretUpFill, TypeH3} from 'react-bootstrap-icons';
import {checkAccessAsk} from '../utils/CheckAccessAsk'
import StatusAsk from '../components/StatusAsk';


const UserAsk = observer(({id}) => {
    const [loading,setLoading] = useState(true) 
    const [ask,setAsk] = useState([]) 
    const {myalert} = useContext(Context);
    const history = useHistory();
    const [visible,setVisible] = useState(false);
    const [pageCount, setpageCount] = useState(0);
    const {user} = useContext(Context);
    const [currentPage,setCurrentPage] = useState(1)
    let limit = 10;

    useEffect(() => {
      if(visible){
        setLoading(true)
        fetchUserAsks({
          id,limit,page:currentPage}).then((data)=>{
          setAsk(data.docs)
          setpageCount(data.totalPages);
          console.log(data)
        }).finally(()=>setLoading(false))
      }
      },[visible]);

    const fetchComments = async (currentPage) => {
        fetchUserAsks({
        id,limit,page:currentPage}).then((data)=>{
        setAsk(data.docs)
        setpageCount(data.totalPages);
       }).finally(()=>setLoading(false))
    };

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

    if (loading){
      return(
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
              <div class="loader">Loading...</div>
              :
              <div></div>
            }
            </Card>
      )
     }
    if(ask?.length===0){
      return(
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
          {
            visible ?
            <h5 className="text-center pt-1">
                Записей нет.
            </h5>
            :
            <div></div> 
            }
        </Card>
      )
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
        <div className='parentSpecAsk'>
        {ask?.map((item,index)=>{
          if(!checkAccessAsk(user,item).Open){
            return (
              <div onClick={()=>redirect(item)} className='childSpecAsk'>
              <div className="blurry-text">
                  Название
              </div>
              <div className="blurry-text">
                  Текст
              </div>
              <div className="blurry-text">
                  <StatusAsk 
                    EndDateOffers={item.EndDateOffers}
                    Winner={item.Winner}
                  />
              </div>
              <div className="blurry-text">
                      <div>ИНН: 8888888888</div>
                      <div>Орг: Название</div>
              </div>
              <div className="blurry-text">
                  Регионы
              </div>
              <div className="blurry-text">
                  Категории
              </div>
              <div className="blurry-text">
                  {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
              </div>
              </div>
            )
          }else{
            return( 
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
        )}})}  
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

export default UserAsk;