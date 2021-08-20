import React,{useState} from 'react';
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
import {upload} from "../http/askAPI";
import Forgot from './Forgot';


const CreateAsk = () => {

    const handleSubmit = () => {

    }

    const handleChange = () => {

    }
    const data = new FormData();
    const [loading, setLoading] = useState(false)
    const [filesNames, setFilesNames] = useState([])

    const onInputChange = (e) => {
      for(let i = 0; i < e.target.files.length; i++) { 
        try{
        setFilesNames(((oldItems) => [...oldItems, e.target.files[i].name]));
        data.append('file', e.target.files[i]);
        }catch(e){
          console.log(e)
        }
      }
    };

    const onSubmit = (e) => {
        setLoading(true)
        upload(data).then((response)=>{});      
        setLoading(false)  
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
            <form onSubmit={onSubmit}>
            <div className="form-group files">
                <label>Upload Your File </label>
                <input type="file"
                       onChange={onInputChange}
                       className="form-control"
                       multiple/>
            </div>

            <button>Submit</button>
            </form> 
            {filesNames.map((a)=><div key={a}>{a}</div>)}   
            </Col>
        </Row>    
        </Container> 
        </div>
    );
};

export default CreateAsk;