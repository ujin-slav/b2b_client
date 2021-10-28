import React,{useState,useEffect} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    InputGroup,
    Card,
    ListGroup,
  } from "react-bootstrap";
  import {Envelope} from 'react-bootstrap-icons';
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import "../style.css"

const socket = io("http://localhost:5000");

const ChatPage = () => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: "room",
        author: "username",
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
        setMessageList((list) => [...list, data]);
        });
    }, []);

    return (
            <Container fluid>
                <Row className="overflow-auto">
                    <Col className="col-3"> 
                    <div className="userBox">
                    </div>
                    </Col>
                    <Col className="col-9">
                        <div className="messageBox">
                            {messageList.map((messageContent) => {
                                return (
                                <div className="messageItem">    
                                    {messageContent.message}
                                </div>    
                                );
                            })}
                        </div>
                        <InputGroup className="mt-3">
                                <Form.Control as="textarea" 
                                rows={2} 
                                placeholder="Введите сообщение " 
                                style={{marginRight:"15px"}}
                                onChange={(event) => {
                                    setCurrentMessage(event.target.value);
                                  }}
                                  onKeyPress={(event) => {
                                    event.key === "Enter" && sendMessage();
                                }}/>
                                <div style={{display: "flex",
                                justifyContent:"center",
                                alignItems:"center"}}>
                                    <Envelope color="blue" 
                                    style={{"width": "50px",
                                    "height": "50px"}}
                                    onClick={sendMessage}/>
                                </div>
                         </InputGroup>
                    </Col>
                </Row>
            </Container>
    );
};

export default ChatPage;