import React,{useState,useEffect,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import QuestService from '../services/QuestService'; 
import {Context} from "../index";
import ReactPaginate from "react-paginate";
import {    Form,
            InputGroup,
            Button,
            Table,
            Container
            } from "react-bootstrap";
import dateFormat, { masks } from "dateformat";
import { CARDASK } from '../utils/routes';
import {observer} from "mobx-react-lite";

const Quest = observer(() => {
    const {user} = useContext(Context);
    const [quest,setQuest] = useState([]); 
    const [search,setSearch] = useState(1)
    const [currentPage,setCurrentPage] = useState(1)
    const [pageCount, setpageCount] = useState(0);
    const history = useHistory();
    const {chat} = useContext(Context);
    let limit = 10;

    useEffect(() => {
        QuestService.fetchQuestUser({dest:"1",userId:user.user.id, limit,page:currentPage}).then((response)=>{
            if(response.status===200){
                setQuest(response.data.docs)
                setpageCount(response.data.totalPages);
            }                
        })
    },[chat.questUnread]);

    const fetchPage = async (currentPage) => {
        QuestService.fetchQuestUser({dest:search,userId:user.user.id,limit,page:currentPage}).then((response)=>{
            setQuest(response.data.docs);
      })
      };

    const handlePageClick = async (data) => {
        setCurrentPage(data.selected + 1);
        await fetchPage(currentPage);
      };

    const changeDest = (value) => {
        setSearch(value)
        QuestService.fetchQuestUser({dest:value,userId:user.user.id, limit,page:1}).then((response)=>{
            if(response.status===200){
                setQuest(response.data.docs)
                setpageCount(response.data.totalPages);
            }                
        })
    }  

    return (
        <div>
            <InputGroup className="mx-auto my-4"> 
            <Form.Label className="px-3 mt-2">Кому:</Form.Label>
                <Form.Control
                    as="select" 
                    onChange={(e)=>changeDest(e.target.value)}        
                >       
                        <option value="1">Вопросы для меня</option>
                        <option value="2">Вопросы от меня</option>
                </Form.Control> 
            </InputGroup>
             <Table striped hover className="tableAsk">
                    <col style={{"width":"1%"}}/>
                    <col style={{"width":"3%"}}/>
                    <col style={{"width":"5%"}}/>
                    <col style={{"width":"15%"}}/>
                    <col style={{"width":"15%"}}/>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Время</th>
                    <th>Автор вопроса</th>
                    <th>Ответ</th>
                    <th>Текст</th>
                </tr>
                </thead>
                <tbody>
                     {quest.map((item,index)=>{
                         console.log(item)
                     return(
                    <tr key={index} onClick={()=>history.push(CARDASK + '/' + item.Ask)}>
                        <td style={{width:"5%"}}>{index+1}</td>
                        <td style={{width:"10%"}}>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
                        <td style={{width:"10%"}}>
                            <div>{item.Author?.name}</div>
                            <div>{item.Author?.nameOrg}</div>
                        </td>
                        <td>{item.Status===null ? 
                        <div style={{color:"red"}}>Нет</div> 
                        : item.Status.Text}</td>
                        <td>{item.Text.length>100 ?
                                `${item.Text.substring(0, 100)}...`
                                :
                                item.Text
                                }</td>
                    </tr>
                   )})}
                </tbody>
               </Table> 
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

export default Quest;