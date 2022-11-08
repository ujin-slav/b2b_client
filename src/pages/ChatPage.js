import React,{useEffect, useState,useContext} from 'react';
import {
    Container,
    Row,
    Col
  } from "react-bootstrap";
import MessageList from '../components/MessageList';
import {Context} from "../index";
import UserBox from '../components/UserBox';


const ChatPage = () => {

    const [recevier, setRecevier] = useState()
    const {chat} = useContext(Context)

    useEffect(()=>{

        return ()=>{
            chat.contacts = []
        }
    },[])

    return (
            <Container fluid>
                <Row className="overflow-auto">
                    <Col className="col-3"> 
                        <UserBox recevier={recevier} setRecevier={setRecevier}/>
                    </Col>
                    <Col className="col-9">
                        <MessageList recevier={recevier} setRecevier={setRecevier}/>
                    </Col>
                </Row>
            </Container>
    );
};

export default ChatPage;