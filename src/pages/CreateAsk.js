import React from 'react';
import RegInput from "../components/RegInput";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Spinner,
    Alert,
  } from "react-bootstrap";

const CreateAsk = () => {

    const handleChange = () => {

    }

    const handleSubmit = () => {

    }

    return (
        <div>
           <Container style={{width: 800}}>
        <Row>
            <Col>
            <h1 className="text-success">Создать заявку</h1>
            </Col>
        </Row>
        <Row>
            <Col>
            </Col>
        </Row>
        <Row>
            <Col>
            <Form onSubmit={handleSubmit}>
                <RegInput value={{Name: "name", Label: "Название заявки", handleChange, PlaceHolder: "Ваше имя"}} />
                <RegInput value={{Name: "email", Label: "E-mail", handleChange, PlaceHolder: "E-mail"}} />             
                <RegInput value={{Name: "nameOrg", Label: "Название организации", handleChange, PlaceHolder: "Название организации", }} />
                <RegInput value={{Name: "inn", Label: "ИНН", handleChange, PlaceHolder: "ИНН"}} />
                <RegInput value={{Name: "adressOrg", Label: "Адрес организации", handleChange, PlaceHolder: "Адрес организации"}} />
                <RegInput value={{Name: "password", Label: "Пароль", handleChange, PlaceHolder: "Пароль"}} />
                <RegInput value={{Name: "confirmPassword", Label: "Повторите пароль", handleChange, PlaceHolder: "Повторите пароль"}} />
                <Button
                variant="primary"
                type="submit"
                className="btn btn-success ml-auto mr-1"
                >
                Отправить
                </Button>
                
            </Form>
            </Col>
        </Row>    
        </Container> 
        </div>
    );
};

export default CreateAsk;