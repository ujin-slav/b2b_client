import React, {useState,
    useContext,
    useRef,
    useEffect,
    createRef} from "react";
import { Form,
    InputGroup,
    Button,
    Card,
    ListGroup,
 } from "react-bootstrap";
 import {Context} from "../index";

const MessageBox = ({author,setActive}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const {user} = useContext(Context);
    const {chat} = useContext(Context);
    const inputEl = useRef(null);

    const sendMessage = async () => {
        if (currentMessage !== "" && author!=="") {
          const messageData = {
            Author: user.user.id,
            Recevier: author._id, 
            Text: currentMessage,
            Date: new Date()
            };
        console.log(author)
          await chat.socket.emit("send_message", messageData);
          setCurrentMessage("");
          inputEl.current.value = "";
          setActive(false)
            }
    };
    

    return (
        <div>
             <Form.Control
                    name="Text"
                    placeholder="Текст сообщения"
                    as="textarea"
                    ref={inputEl}
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    style={{height:"120px"}}
            />
            <Button style={{marginTop:"10px"}} onClick={sendMessage}>Отправить</Button>
        </div>
    );
};

export default MessageBox;