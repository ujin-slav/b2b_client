import React,{useEffect, useState,useContext} from 'react';
import {useParams} from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Card
  } from "react-bootstrap";
import MessageList from '../components/MessageList';
import {Context} from "../index";
import UserBox from '../components/UserBox';
import {fetchUser} from "../http/askAPI";
import { PlusCircle,DashCircle} from 'react-bootstrap-icons';


const ChatPage = () => {

    const {idorg} = useParams()
    const [recevier, setRecevier] = useState()
    const {chat} = useContext(Context)
    const[visibleUser,setVisibleUser] = useState(false)
    const[visibleMessage,setVisibleMessage] = useState(false)
    const [width,setWidth] = useState()

    
    useEffect(()=>{
        window.addEventListener('resize',resizeWindow)
        setWidth(window.innerWidth)
        return ()=>{
            window.removeEventListener('resize',resizeWindow) 
        }
    },[])


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

    const resizeWindow = () => {
        setWidth(window.innerWidth)
    }

    const desktop = () => {
        return (
            <Container fluid>
                <Row className='chatRow'>
                    <Col className="col-3 chatCol"> 
                        <UserBox recevier={recevier} setRecevier={setRecevier}/>
                    </Col>
                    <Col className="col-9 chatCol">
                        <MessageList recevier={recevier} setRecevier={setRecevier}/>
                    </Col>
                </Row>
            </Container>
        )
    }

    const mobile = () => {
        return (
            <Container fluid>
            <Row className='chatRow'>
                <Card className='section'>
                    <Card.Header className='sectionHeaderSearch headerAsks' 
                            onClick={()=>setVisibleUser(!visibleUser)}>
                            {visibleUser ?
                                <DashCircle className='caret'/>
                                :
                                <PlusCircle className='caret'/>
                            }
                            &nbsp;Контакты
                    </Card.Header>
                    {visibleUser ? 
                        <UserBox recevier={recevier} setRecevier={setRecevier}/>
                        :
                        <div></div>
                    }
                </Card>
                <Card className='section'>
                    <Card.Header className='sectionHeaderSearch headerAsks' 
                            onClick={()=>setVisibleMessage(!visibleMessage)}>
                            {visibleMessage ?
                                <DashCircle className='caret'/>
                                :
                                <PlusCircle className='caret'/>
                            }
                            &nbsp;Чат
                    </Card.Header>
                    {visibleMessage ? 
                        <MessageList recevier={recevier} setRecevier={setRecevier}/>
                        :
                        <div></div>
                    }
                </Card>
                </Row>
            </Container>
        )
    }

    return (
        <div>
            {width>1050 ? desktop() : mobile()}  
        </div>    
    )
};

export default ChatPage;