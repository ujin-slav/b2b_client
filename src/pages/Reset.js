import { useState,useContext,useEffect} from "react";
import {Card, Button, Form, Container, Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {Context} from "../index";
import {B2B_ROUTE} from "../utils/routes";
import {observer} from "mobx-react-lite";
import {useParams} from 'react-router-dom'

const Reset = observer(() => {
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const {user} = useContext(Context);
    const {token} = useParams()

    useEffect(() => {
        user.errorString = "";
    }, [user])

    const savePassword = async ()=> {
        try {
            let result = await user.reset(token,password)
            console.log(result)
          } catch (error) {
          }
    }
    
    return (
        <div>
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{height: window.innerHeight - 54}}
                >
                <Card style={{width: 600}} className="p-5">
                    <h2 className="m-auto">Установка нового пароля</h2>
                    <Form className="d-flex flex-column">
                        <Form.Control
                            className="mt-3"
                            placeholder="Пароль"
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </Form>
                    <Form className="d-flex flex-column">
                        <Form.Control
                            className="mt-3"
                            placeholder="Повторите пароль "
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                        />
                    </Form>
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        <Button
                        variant={"outline-success"}
                        onClick={()=>savePassword()}>
                        Отправить
                        </Button>
                    </Row>   
                    <div style={{ color:"red"}}>    
                        {user.errorString}
                    </div>     
                </Card>
            </Container>
        </div>
    );
});

export default Reset;