import { useState,useContext,useEffect} from "react";
import {Card, Button, Form, Container, Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {Context} from "../index";
import {B2B_ROUTE} from "../utils/routes";
import {observer} from "mobx-react-lite";
import {useParams} from 'react-router-dom'

const passwordRegex = RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,40})"
  );

const formValid = ({ data, formErrors }) => {
    let valid = true;

    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    // validate the form was filled out
    Object.values(data).forEach(val => {
        val === null && (valid = false);
});

return valid;
};


const Reset = observer(() => {
    const [password,setPassword] = useState('');
    const {myalert} = useContext(Context);
    const [confirmPassword,setConfirmPassword] = useState('');
    const {user} = useContext(Context);
    const {token} = useParams()
    const[userReg,setUserReg] = useState( {
        data: {
          password: null,
          confirmPassword: null,
        },
        formErrors: {
          password: "",
          confirmPassword: "",
        }
    })

    const savePassword = async ()=> {
        if (formValid(userReg)) {
            try {
                await user.reset(token,userReg.data.password)
            } catch (error) {
                console.log(error)  
            }
        }else{
            myalert.setMessage("Неверно введены данные");
        }
    }

    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = userReg.formErrors;
        let data = userReg.data
        data[name] = value;

        switch (name) {
          case "password":
            formErrors.password = passwordRegex.test(value)
              ? ""
              : "Пароль слишком слабый. Пароль должен иметь 8-40 латинских символов,содержать не менее одной цифры" +
              ", хотя бы одну строчную букву, хотя бы одну заглавную букву.";
            break;
          case "confirmPassword":
            formErrors.confirmPassword =
              data.confirmPassword !== data.password ? "Пароли не совпадают" : "";
            break;  
          default:
            break;
        }
        setUserReg({ data, formErrors});
        console.log(userReg)
    };
    
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
                            name="password"
                            type="password"
                            className="mt-3"
                            placeholder="Пароль"
                            onChange={handleChange}
                        />
                    </Form>
                    <span className="errorMessage" style={{color:"red"}}>{userReg.formErrors.password}</span>
                    <Form className="d-flex flex-column">
                        <Form.Control
                            name="confirmPassword"
                            type="password"
                            className="mt-3"
                            placeholder="Повторите пароль "
                            onChange={handleChange}
                        />
                    </Form>
                    <span className="errorMessage" style={{color:"red"}}>{userReg.formErrors.confirmPassword}</span>
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        <Button
                        name="confirmPassword"
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