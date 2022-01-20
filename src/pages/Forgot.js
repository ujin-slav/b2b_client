import { useState,useContext,useEffect} from "react";
import {Card, Button, Form, Container, Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {Context} from "../index";
import {B2B_ROUTE} from "../utils/routes";
import {observer} from "mobx-react-lite";

const Forgot = observer(() => {
    const [email,setEmail] = useState('');
    const {user} = useContext(Context);
    const history = useHistory();

    useEffect(() => {
        user.errorString = "";
    }, [user])

    const sendMail = async ()=> {
        try {
            let result = await user.forgot(email);
            if (result.data.result===true) {
                setInterval(()=> history.push(B2B_ROUTE),3000)
            }
          } catch (error) {
            console.log(error)
          }
    }

    return (
        <div>
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{height: window.innerHeight - 54}}
                >
                <Card style={{width: 600}} className="p-5">
                    <h2 className="m-auto">Восстановление пароля</h2>
                    <Form className="d-flex flex-column">
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите ваш email..."
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </Form>
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        <Button
                        variant={"outline-success"}
                        onClick={()=>sendMail()}>
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

export default Forgot;