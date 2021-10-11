import React,{useEffect, useState} from 'react';
import OrgService from '../services/OrgService'
import {
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
    },[]);
  

    return (
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
             </Container>
        </div>
    );
};

export default CatOrg;