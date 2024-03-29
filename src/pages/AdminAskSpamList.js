import React,{useEffect,useState,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import ru from "date-fns/locale/ru"
import {Card, Form, InputGroup,Button,Col,Row} from "react-bootstrap";
import {Context} from "../index";
import ModalAlert from '../components/ModalAlert';
import AdminService from '../services/AdminService'
import { XCircle, Search} from 'react-bootstrap-icons';
import ReactPaginate from "react-paginate";
import {observer} from "mobx-react-lite";
import {Eye} from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import {ADMIN_ASK, ADMIN_PRICE,ADMIN_UPLOADPRICE} from '../utils/routes';
import DatePicker, { registerLocale } from 'react-datepicker'
import {
  Table
} from "react-bootstrap";
import SentSpam from '../components/SentSpam';

const AdminAskSpamList = () => {
    registerLocale("ru", ru)

    const [listOrg,setListOrg] = useState([]);;
    const [modalActive,setModalActive] = useState(false);
    const history = useHistory();
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);
    const[fetching,setFetching] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const[search,setSearch] = useState("");
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    const[limit,setLimit] = useState(10);
    const {id} = useParams();

    useEffect(() => {
        setLoading(true)
        AdminService.getSpamListAsk({
            id,
            limit,
            search,
            page:currentPage,
            }).then((data)=>{
                    console.log(data)
                    setListOrg(data.docs);
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

    const handleSelect = (value) =>{
        setCurrentPage(1)
        setLimit(value)
        setFetching(!fetching)
    }

    const sendSpam = async ()=>{
        const list = listOrg.map(item=>item._id) 
        const result = await AdminService.sendSpamByAsk({id,list,limit,currentPage});
        if (result.status===200){
          myalert.setMessage("Успешно"); 
        } else {
          myalert.setMessage(result?.data?.message);
        }
    }

    if(loading){
        return (
            <div class="loader">Loading...</div>
        )
    }

    return (
        <div>
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
            <Row>
                
            </Row>
        </Form>
            {/* <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Email</th>
                    <th>Faks</th>
                    <th>Postcode</th>
                    <th>Site</th>
                    <th>Telefon</th>
                </tr>
                </thead>
                <tbody>
                {listOrg.map((item,index)=>
                    <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item.Name}</td>
                    <td>{item.City}</td>
                    <td>{item.Address}</td>
                    <td>{item.Category}</td>
                    <td>{item.Subcategory}</td>
                    <td>{item.Email}</td>
                    <td>{item.Faks}</td>
                    <td>{item.Postcode}</td>
                    <td>{item.Site}</td>
                    <td>{item.Telefon}</td>
                    </tr>
                )}
                </tbody>
            </Table> */}
            <Card className="mx-2 my-2">
                <Card.Header></Card.Header>
                <div className='cardPadding'>
                    {listOrg.map((item,index)=>
                        <div key={index}>{item._id}</div>
                    )}
                </div>
                <div>
                    <Button onClick={()=>sendSpam()} className="mx-1 my-1">
                        Отправить
                    </Button>
                </div>
            </Card>
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
            <SentSpam Ask={id}/>
        </div>
    );
};

export default AdminAskSpamList;