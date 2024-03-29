import React,{useEffect,useState,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import ru from "date-fns/locale/ru"
import {Card, Form, InputGroup,Button,Col,Row} from "react-bootstrap";
import {Context} from "../index";
import ModalAlert from '../components/ModalAlert';
import AdminService from '../services/AdminService'
import { CircleFill, Search,StopFill,PlayFill,PlusCircleFill} from 'react-bootstrap-icons';
import ReactPaginate from "react-paginate";
import {observer} from "mobx-react-lite";
import dateFormat, { masks } from "dateformat";
import {ADMIN_ASK, ADMIN_PRICE,ADMIN_SPECOFFERS,ADMIN_UPLOADPRICE} from '../utils/routes';
import DatePicker, { registerLocale } from 'react-datepicker'
import {
  Table
} from "react-bootstrap";

const Admin = () => {
    var curr = new Date();
    var date = curr.setDate(curr.getDate() + 3);
    registerLocale("ru", ru)

    const [users,setUsers] = useState([]);
    const [modalActive,setModalActive] = useState(false);
    const history = useHistory();
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);
    const[fetching,setFetching] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [bannedReason, setBannedReason] = useState();
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [bannedTo,setBannedTo] = useState(date);
    const [endDate, setEndDate] = useState(new Date());
    const[search,setSearch] = useState("");
    const [currentPage,setCurrentPage] = useState(1)
    const {chat} =  useContext(Context)
    const [loading,setLoading] = useState(false)
    const[limit,setLimit] = useState(10);

    useEffect(() => {
      setLoading(true)
      AdminService.getUsers({
          limit,
          search,
          page:currentPage,
          startDate,
          endDate
          }).then((data)=>{
                console.log(data)
                setUsers(data.docs);
                setPageCount(data.totalPages);
                setCurrentPage(data.page)
      }).finally(
          ()=>setLoading(false)
      )
    },[fetching]);

    const fetchPage = async (currentPage) => {
      setCurrentPage(currentPage)
      setFetching(!fetching)
    };

    const handlePageClick = async (data) => {
      await fetchPage(data.selected + 1);
    }

    const handleSearch = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }

    const handleSearchInn = () =>{
      setCurrentPage(1)
      setFetching(!fetching)
    }

    const handleClickDate = () =>{
        setCurrentPage(1)
        setFetching(!fetching)
    }

    const handleSelect = (value) =>{
        setCurrentPage(1)
        setLimit(value)
        setFetching(!fetching)
    }

    const ban = (id) =>{
      AdminService.userBan({id,ban:true,bannedReason,bannedTo}).then((result)=>{
        if (result.status===200){
          myalert.setMessage("Успешно")
          chat.socket.emit("refreshUser",id)
          setFetching(!fetching)
        } else {
          myalert.setMessage(result?.data?.message)
        }
      })
    }

    const unban = (id) =>{
      AdminService.userBan({id,ban:false,bannedReason:""}).then((result)=>{
        if (result.status===200){
          myalert.setMessage("Успешно");
          chat.socket.emit("refreshUser",id);
          setFetching(!fetching)
        } else {
          myalert.setMessage(result?.data?.message)
        }
      })
    }

    const handleChange = e => {
        setBannedReason(e.target.value)
    }

    return (
      <div>
          <Button className="mx-1 mt-2" onClick={()=>history.push(ADMIN_SPECOFFERS)}>Спец. предложения</Button>
          <Button className="mx-1 mt-2" onClick={()=>history.push(ADMIN_ASK)}>Заявки</Button>
          <Button className="mx-1 mt-2" onClick={()=>history.push(ADMIN_PRICE)}>Прайс</Button>
          <Button className="mx-1 mt-2" onClick={()=>history.push(ADMIN_UPLOADPRICE)}>Загрузка прайса</Button>
          <Form className="searchFormMenu pb-3">
            <Row> 
             <InputGroup>
                    <Form.Control
                                  className="mx-1 mt-2"
                                  name="Text"
                                  onChange={handleChange}
                                  placeholder="Причина бана"
                                  as="textarea"
                    />
                    <div className='captionMenuSelect'>До:</div>
                    <DatePicker
                        locale="ru"
                        selected={bannedTo}
                        name="StartDateOffers"
                        className='form-control datePicker'
                        dateFormat="dd.MM.yyyy"
                        onChange={date=>setBannedTo(date)}
                    />
              </InputGroup>
            </Row>
            </Form>
          <Form className="searchFormMenu pb-3">
            <Row> 
                <InputGroup>
                    <Form.Control
                        onChange={(e)=>setSearch(e.target.value)}
                        placeholder="Название, инн организации"
                    />
                    <Button variant="outline-secondary" onClick={()=>handleSearch()}>
                        <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                    </Button>
                </InputGroup>
            </Row>   
            <Row>
            <div className='inputGroupMenuSelect'>
                    <div className='captionMenuSelect'>Период:</div>
                        <InputGroup>
                            <DatePicker
                                locale="ru"
                                selected={startDate}
                                name="StartDateOffers"
                                className='form-control datePicker'
                                dateFormat="dd.MM.yyyy"
                                onChange={date=>setStartDate(date)}
                            />
                            <Button 
                                variant="outline-secondary"
                                className='buttonSearchDataPicker'
                                onClick={()=>handleClickDate()}
                            >
                                <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                            </Button>
                        </InputGroup>
                        <InputGroup>
                            <DatePicker
                                locale="ru"
                                selected={endDate}
                                name="EndDateOffers"
                                className='form-control datePicker'
                                dateFormat="dd.MM.yyyy"
                                onChange={date=>setEndDate(date)}
                            />
                            <Button 
                                variant="outline-secondary" 
                                className='buttonSearchDataPicker'
                                onClick={()=>handleClickDate()}
                            >
                                <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                            </Button>
                        </InputGroup>
                    <div className='captionMenuSelect'>Показать:</div>
                    <Form.Control
                        as="select"  
                        value={limit}
                        className='searchFormMenuSelect'
                        onChange={(e)=>handleSelect(e.target.value)} 
                    >       
                            <option>10</option>
                            <option value='25'>25</option>
                            <option value='50'>50</option>
                            <option value='100'>100</option>
                    </Form.Control>
            </div>
            </Row>
        </Form>
          <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>NameOrg</th>
                  <th>Inn</th>
                  <th>Online</th>
                  <th>Last visit</th>
                  <th>Banned</th>
                  <th>ResBan</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((item,index)=>
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item.email}</td>
                    <td>{item.name}</td>
                    <td>{item.nameOrg}</td>
                    <td>{item.inn}</td>
                    <td>{
                          item.onLine ?
                          <CircleFill className='circleFillOnline'/>
                          :
                          <CircleFill/>
                        }
                    </td>
                    <td>{dateFormat(item.LastVisit, "dd/mm/yyyy HH:MM:ss")}</td>
                    <td>
                        {
                          item.banned ?
                          <StopFill className='banned' onClick={()=>unban(item._id)}/>
                          :
                          <PlayFill className='notBanned' onClick={()=>ban(item._id)}/>
                        }
                    </td>
                    <td title={item.bannedReason}>{item?.bannedReason?.substring(0, 10)}</td>
                  </tr>
                )}
              </tbody>
          </Table>
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
      </div>
    );
};

export default Admin;