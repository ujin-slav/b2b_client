import React,{useEffect, useState,useContext} from 'react';
import {useParams} from 'react-router-dom';
import {
    Container,
    Row,
    Col
  } from "react-bootstrap";
import MessageList from '../components/MessageList';
import {Context} from "../index";
import UserBox from '../components/UserBox';
import {fetchUser} from "../http/askAPI";


const ChatPage = () => {

    const {idorg} = useParams();
    const [recevier, setRecevier] = useState()
    const {chat} = useContext(Context)

    useEffect(()=>{
        if(idorg){
            fetchUser(idorg).then((response)=>{
                const contact = {
                    id: response._id,
                    email: response.email,
                    name: response.name,
                    nameOrg: response.nameOrg,
                }
                chat.recevier = contact
                setRecevier(contact)
            })
        }
        return ()=>{
            chat.contacts = []
            chat.recevier = {}
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