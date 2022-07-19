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
 import SpecOfferService from '../services/SpecOfferService'

 const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
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
  

const SpecOfferAskFiz = ({receiver,setActive}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const {user} = useContext(Context);
    const {myalert} = useContext(Context);
    const {chat} = useContext(Context);
    const inputEl = useRef(null);
    const[specAsk,setPriceAsk] = useState( {
        data: {
          name: null,
          email: null,
          telefon:"",
          city:"",
          comment:"",
          amount:""
        },
        formErrors: {
          name: "",
          email: "",
        }
      }
      );

    const sendMessage = async (e) => {
        e.preventDefault();
        if(true){
          if (formValid(specAsk)) {
            const data = new FormData();
            data.append("Name", specAsk.data.Name)
            data.append("Email", specAsk.data.Email)
            data.append("Telefon", specAsk.data.Telefon)
            data.append("City", specAsk.data.City)
            data.append("Comment", specAsk.data.Comment)
            data.append("Amount", specAsk.data.Amount)
            const result = await SpecOfferService.modifySpecOffer(data)
            console.log(result)
            if (result.status===200){
              myalert.setMessage("Предложение успешно изменено");
              //history.push(B2B_ROUTE)
            } else {
              myalert.setMessage(result?.data?.message)
            }
          } else {
            console.error("FORM INVALID");
            myalert.setMessage("Не заполнено поле текст заявки");
          }
        }else{
          console.error("FORM INVALID");
          myalert.setMessage("Неверно введены данные с картинки(CAPTCHA)");
        }
    };
    
    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = specAsk.formErrors;
        let data = specAsk.data
        data[name] = value;
        console.log(name)
        
    switch (name) {
        case "name":
        formErrors.Name =
            value.length < 3 ? "минимум 3 символа" : "";
        break;   
        case "email":
            formErrors.Email = emailRegex.test(value)
                ? ""
                : "неверный email";
        break;
        default:
        break;
    }
    setPriceAsk({ data, formErrors});
    }

    return (
        <div>
             <Form.Label><span class="boldtext">Ваши контактные данные:</span></Form.Label>
            <div class="mb-3 row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Имя</label>
                <div class="col-sm-10">
                <Form.Control type="text" name="name" placeholder="Обязательно" onChange={handleChange}/>
                <span className="errorMessage" style={{color:"red"}}>{specAsk.formErrors.Name}</span>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-2 col-form-label">E-mail</label>
                <div class="col-sm-10">
                <Form.Control type="text" name="email" placeholder="Обязательно" onChange={handleChange}/>
                <span className="errorMessage" style={{color:"red"}}>{specAsk.formErrors.Email}</span>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-2 col-form-label">Телефон</label>
                <div class="col-sm-10">
                <Form.Control type="text" name="telefon" onChange={handleChange}/>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-2 col-form-label">Город</label>
                <div class="col-sm-10">
                <Form.Control type="text" name="city" onChange={handleChange}/>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-2 col-form-label">Кол-во</label>
                <div class="col-sm-10">
                <Form.Control type="text" name="amount" onChange={handleChange}/>
                </div>
            </div>
            <div class="mb-3 row">
                <div class="col-sm-10">
                <Form.Control 
                    type="text"  
                    name="comment" 
                    placeholder="Комментарий к заказу"
                    as="textarea"
                    onChange={handleChange}/>
                </div>
            </div>
            <Button style={{marginTop:"10px"}} onClick={sendMessage}>Отправить</Button>
        </div>
    );
};

export default SpecOfferAskFiz;