import React, {useState,
    useContext,
    useRef
} from "react";
import { Form,Button} from "react-bootstrap";
 import {Context} from "../index";

const MessageBoxComplaint = ({author,from}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const {user} = useContext(Context)
    const inputEl = useRef(null)

    const sendMessage = async () => {
        if (currentMessage !== "" && author!=="") {
          const messageData = {
            Author: user.user.id,
            Recevier: author._id, 
            Text: currentMessage,
            Date: new Date()
        }
    }}

    return (
        <div>
            <Form.Control
                    name="Text"
                    placeholder="Опишите жалобу"
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

export default MessageBoxComplaint;