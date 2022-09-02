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
    const[currentPage,setCurrentPage] = useState(1);
    const[fetching,setFetching] = useState(true);
    const[totalDocs,setTotalDocs] = useState(0);
    const[search,setSearch] = useState("");

    useEffect(() => {
            OrgService.getOrgCat().then((data)=>{
                console.log(data.docs)
                setOrg(data.docs)
            })   
    },[])

    return (
        <div>
            <Container>
                {org?.map((item)=>
                <div>
                    <div>{item.Name}</div>
                    <div>{item.Email}</div>
                </div>
                )}
             </Container>
        </div>
    );
};

export default CatOrg;