import React,{useEffect, useState} from 'react';
import OrgService from '../services/OrgService'
import {
<<<<<<< HEAD
    Card,
    Col,
    Container,
    Row
  } from "react-bootstrap";

const CatOrg = () => {
    const[org,setOrg] = useState([]);

    useEffect(() => {
        OrgService.getOrg(1,3).then((data)=>{
              setOrg(data.docs);
          })
=======
    Container,
    Row,
    Col,
    Form,
    Button,
    Spinner,
    Alert,
    Card,
    InputGroup
  } from "react-bootstrap";
 import CardOrg from '../components/CardOrg'; 

const CatOrg = () => {
    const[org,setOrg] = useState([]);
    const[currentPage,setCurrentPage] = useState();
    const[fetching,setFetching] = useState(true);
    const[totalDocs,setTotalDocs] = useState(0);
    const[search,setSearch] = useState("");

    useEffect(() => {
        if(fetching){
            if(org.length===0 || org.length<totalDocs) {
            OrgService.getOrg(currentPage,10,search).then((data)=>{
                setTotalDocs(data.totalDocs);
                setOrg([...org, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
                console.log(search)
            }).finally(()=>setFetching(false))
            }
        }  
    },[fetching]);

    useEffect(() => {
        document.addEventListener('scroll',scrollHandler);
        return function(){
            document.removeEventListener('scroll',scrollHandler);
        }
>>>>>>> 1b18fc15dd4be535604b7693647de2d65e2411b4
    },[]);
    
    const scrollHandler = (e) =>{
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
                setFetching(true)
            }
    }

    const handleSearch = (e) =>{
        setSearch(e.target.value)
    }

    return (
<<<<<<< HEAD
        <div >
            <Container>
             {org?.map((item)=>
            <Row style={{ padding: "5px" }}>
                <Col>
                    <Card>
                    <Card.Header>{item.NameOrg}</Card.Header>
                    <Card.Body>
                    <Card.Text>
                            <div>ИНН: {item.INN} КПП:{item.KPP}</div>
                            <div>{item.Address}</div>
                            <div>{item.Surname}</div>
                            <div>{item.Name}</div>
                            <div>{item.Patron}</div>
                            <div>{item.Category}</div>
                            <div>{item.Telefon}</div>
                            <div>{item.email}</div>
                            <div>{item.Debt}</div>
                            <div>{item.Price}</div>
                            <div>{item.OKPO}</div>
                            <div>{item.Site}</div> 
                    </Card.Text>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>    
             )} 
=======
        <div>
            <input type="text" onChange={(e)=>handleSearch(e)} />
            <Container>
            <div class="row gy-3">
                {org.map((item)=><CardOrg item={item}/>)}
             </div>
>>>>>>> 1b18fc15dd4be535604b7693647de2d65e2411b4
             </Container>
        </div>
    );
};

export default CatOrg;