import React,{useState} from 'react';
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

const MyContr = () => {
    const [contragent,setContragent] = useState();
    const [listCont,setListContragent] =  useState([]);

    const handleClick = () => {
        setListContragent(((oldItems) => [...oldItems, contragent]));
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                    <Form.Group className="mx-auto my-2">
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Введите e-mail контрагента"
                            onChange={(e)=>setContragent(e.target.value)}
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={()=>handleClick()}>
                            +
                        </Button>
                    </InputGroup>    
                    </Form.Group>
                    </Col>
                </Row>
            <Row>
                <Col className="mx-auto my-2">
                <div className="row gy-3">
                    {listCont.map((item,index)=><div key={index}>{item}</div>)}   
                </div>
                </Col>
             </Row>
             </Container>
        </div>
    );
};

export default MyContr; 