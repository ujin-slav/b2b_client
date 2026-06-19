import React, { useState, useContext, useRef } from 'react';
import {
    Form,
    InputGroup,
    Button,
    Card,
    ListGroup,
} from "react-bootstrap";
import ReviewOrgService from '../services/ReviewOrgService';
import { Context } from "../index";

const AnswerCardReviewOrg = ({ ...props }) => {
    const { user, id, item, setFetchAnswer } = props
    const inputEl = useRef(null);
    const [textAnswer, setTextAnswer] = useState('')
    const [visible, setVisible] = useState(false)
    const { myalert } = useContext(Context);
    const { chat } = useContext(Context)

    const handleAnswer = async (e) => {
        e.preventDefault();
        const data = {
            Host: item.ID,
            Text: textAnswer,
            Author: item.Author,
            Org: item.Org
        }
        const result = await ReviewOrgService.addReviewOrg(data)
        if (result.data?.errors) {
            myalert.setMessage(result.data.message);
        } else {
            inputEl.current.value = "";
            chat.socket.emit("unread_answer_org", data);
            setVisible(false)
            setFetchAnswer(true)
        }

    }

    return (
        <div>
            <ListGroup>
                <ListGroup.Item className="answer border-0">
                    <button className="myButtonMessage mt-2" onClick={() => setVisible(!visible)}>
                        Ответить
                    </button>
                </ListGroup.Item>
            </ListGroup>
            {visible ?
                <Card className="border-0">
                    <Form.Control
                        name="Text"
                        placeholder="Текст сообщения"
                        ref={inputEl}
                        as="textarea"
                        onChange={(e) => setTextAnswer(e.target.value)}
                    />
                    <button className="myButtonMessage mt-2 w-auto" onClick={(e) => handleAnswer(e)}>
                        Отправить
                    </button>
                </Card>
                :
                <div></div>
            }
        </div>
    );
};

export default AnswerCardReviewOrg;