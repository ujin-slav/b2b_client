import React,{useState,useEffect,useContext,useRef} from 'react';
import {
Container,
Row,
Col,
Form,
Button,
Table,
Alert,
Card,
InputGroup
} from "react-bootstrap";
import { XCircle,PlusCircle } from 'react-bootstrap-icons';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import ContrService from '../services/ContrService';
import ReactPaginate from "react-paginate";

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const MyContr = observer(() => {
    const [contragent,setContragent] = useState();
    const [pageCount, setpageCount] = useState(0)
    const [search,setSearch] = useState("");
    const [contragentName,setContragentName] = useState();
    const [listCont,setListContragent] =  useState([]);
    const [currentPage,setCurrentPage] = useState(1)
    const [listUser,setListUser] =  useState([]);
    const [error, setError] = useState();
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);
    const [fetching,setFetching] = useState(true);
    const emailBox = useRef(null)
    const nameBox = useRef(null)
    let limit = 10

    useEffect(() => {
        fetchContr();
    },[user.user.id,fetching]);

    const fetchContr = () =>{
        ContrService.fetchContr(user.user.id).then((data)=>{
            setListContragent(data);
            setFetching(false)
        })
        ContrService.getUserList({search,limit,page:currentPage}).then((data)=>{
            setListUser(data.docs)
            setpageCount(data.totalPages)
        })
    }

    const fetchPage = async (currentPage) => {
        ContrService.getUserList({search,limit,page:currentPage}).then((data)=>{
            setListUser(data.docs)
         })
     };
 
    const handlePageClick = async (data) => {
        setCurrentPage(data.selected + 1)
       await fetchPage(data.selected + 1);
     };

    const handleClick = async() => {
        if(emailRegex.test(contragent)){
            const result = await ContrService.addContr({email:contragent,name:contragentName,userid:user.user.id})
            if (result.errors){
                setError(result.message)
            } else {
                setFetching(true)
                emailBox.current.value=""
                nameBox.current.value=""
            }
        } else {
            setError("Неверный e-mail")
        }    
    }

    const addContr = async(item)=>{
        const result = await ContrService.addContr({email:item.email,name:item.name,userid:user.user.id})
        if (result.errors){
            setError(result.message)
        } else {
            setFetching(true)
        }
    }

    const deleteContr = async(email) => {
        try {
           const result = await ContrService.delContr({email,userid:user.user.id});
           if(result.deletedCount===1){
            fetchContr();
           }
        } catch (error) {
            console.log(error);
        }       
        
    }
    const handleSearch = async(e)=>{
        ContrService.getUserList({search:e.target.value,limit,page:currentPage}).then((data)=>{
            setListUser(data.docs)
            setpageCount(data.totalPages)
        })
    }

    return (
        <div>
            <Container className="mx-auto my-4">
            <Row>
            <Col>   <div  className="mb-2">
                        Мои контрагенты
                    </div>
                    <InputGroup className="mb-3">
                    <Form.Control
                            placeholder="Введите имя контрагента"
                            onChange={(e)=>setContragentName(e.target.value)}
                            ref={nameBox}
                        />
                        <Form.Control
                            placeholder="Введите e-mail контрагента"
                            onChange={(e)=>setContragent(e.target.value)}
                            ref={emailBox}
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={()=>handleClick()}>
                            +
                        </Button>
                    </InputGroup>
                        <span className="errorMessage" style={{color:"red"}}>{error}</span>    
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Имя</th>
                        <th>E-mail</th>
                        <th>Удалить</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listCont.map((item,index)=>
                    <tr>
                        <td style={{"width":"10%"}}>{index+1}</td>
                        <td style={{"width":"50%"}}>{item.Name}</td>
                        <td>{item.Email}</td>
                        <td><XCircle color="red" style={{"width": "25px", "height": "25px"}}
                            onClick={(e)=>{deleteContr(item.Email)}} /></td>
                    </tr>
                    )}  
                    </tbody>
                </Table>
                </Col>
                <Col >
                    <div  className="mb-2">
                        Участники системы 
                    </div>
                    <Form.Control
                        onChange={handleSearch}
                        placeholder="Начните набирать инн или название фирмы"
                    />
                    <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Имя</th>
                        <th>Организация</th>
                        <th>Добавить</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listUser?.map((item,index)=>
                    <tr>
                        <td style={{"width":"10%"}}>{index+1}</td>
                        <td style={{"width":"50%"}}>{item.name}</td>
                        <td>{item.nameOrg}</td>
                        <td><PlusCircle color="#0D55FD" style={{"width": "25px", "height": "25px"}}
                            onClick={(e)=>{addContr(item)}} /></td>
                    </tr>
                    )}  
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
                    </Col>
                </Row>
             </Container>
        </div>
    );
});

export default MyContr; 