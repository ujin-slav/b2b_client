import React,{useEffect, useState} from 'react';
import OrgService from '../services/OrgService'
import {
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
            OrgService.getOrgCat(currentPage,10,search).then((data)=>{
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
    },[]);
    
    const scrollHandler = (e) =>{
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
                setFetching(true)
            }
    }

    const handleSearch = (e) =>{
        OrgService.getOrgCat(currentPage,10,e.target.value).then((data)=>{
            setTotalDocs(data.totalDocs);
            setOrg(data.docs);
            setCurrentPage(prevState=>prevState + 1)
            setSearch(e.target.value)
        }).finally(()=>setFetching(false))
    }

    return (
        <div>
            <Container>
                <div>Test</div>
                <Row>
                    <Col>
                    <Form.Group className="mx-auto my-2">
                        <Form.Label>Поиск:</Form.Label>
                        <Form.Control
                            onChange={handleSearch}
                            placeholder="Начните набирать ИНН или название организации"
                        />
                    </Form.Group>
                    </Col>
                </Row>
            <Row>
                <Col className="mx-auto my-2">
                <div className="row gy-3">
                    {org.map((item)=><CardOrg item={item}/>)}
                </div>
                </Col>
             </Row>
             </Container>
        </div>
    );
};

export default CatOrg;