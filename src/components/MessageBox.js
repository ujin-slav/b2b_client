import React, {
    useState,
    useContext,
    useRef
} from "react";
import { Form, Button } from "react-bootstrap";
import { Context } from "../index";
import { useHistory } from 'react-router-dom';
import { CHAT } from "../utils/routes";

const MessageBox = ({ author, setActive }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const { user } = useContext(Context)
    const { chat } = useContext(Context)
    const inputEl = useRef(null)
    const history = useHistory()

    const sendMessage = async () => {
        if (currentMessage !== "" && author !== "") {
            const messageData = {
                Author: user.user.id,
                Recevier: author._id,
                Text: currentMessage,
                Date: new Date()
            }
            await chat.socket.emit("send_message", messageData);
            setCurrentMessage("");
            inputEl.current.value = "";
            setActive(false)
        }
    };

    const openChat = () => {
        history.push(CHAT + '/' + author)
    }

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
                style={{ height: "120px" }}
            />
            <div>
                <button className="myButtonMessage mt-2"  onClick={() => openChat()}>
                    Открыть переписку
                </button>
            </div>
            <button className="myButtonMessage mt-1" onClick={sendMessage}>
                Отправить
            </button>
        </div>
    );
};

export default MessageBox;