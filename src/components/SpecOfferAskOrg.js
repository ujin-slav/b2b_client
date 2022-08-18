import React, {useState,
    useContext,
    useRef} from "react";
import { Form,Button} from "react-bootstrap";
 import {Context} from "../index";
 import SpecOfferService from '../services/SpecOfferService'
 import Captcha from "demos-react-captcha";

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
  

const SpecOfferAskOrg = ({receiver,specOffer,setActive}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [captcha, setCaptcha] = useState(false);
    const {user} = useContext(Context);
    const {myalert} = useContext(Context);
    const {chat} = useContext(Context);
    const inputEl = useRef(null);
    const[specAsk,setSpecAsk] = useState( {
        data: {
          comment:"",
          amount:""
        },
        formErrors: {
          amount:""
        }
      }
      );

    const sendMessage = async (e) => {
        e.preventDefault();
        if(captcha){
          if (formValid(specAsk)) {
            const result = await SpecOfferService.specAskOrg({
              Author:user.user.id,
              Comment:specAsk.data.comment,
              Amount:specAsk.data.amount,
              Receiver:receiver,
              SpecOffer:specOffer
            })
            if (result.status===200){
              myalert.setMessage("Заявка успешно отправлена");
              chat.socket.emit("unread_specOfferAsk", {To:receiver});
              setActive(false)
            } else {
              myalert.setMessage(result?.data?.message)
            }
          } else {
            console.error("FORM INVALID");
            setErrorMessage("Не заполнено поле текст заявки");
          }
        }else{
          console.error("FORM INVALID");
          setErrorMessage("Неверно введены данные с картинки(CAPTCHA)");
        }
    };
    
    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = specAsk.formErrors;
        let data = specAsk.data
        data[name] = value;
        
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
        setSpecAsk({ data, formErrors});
    }

    const handleChangeCaptcha = (value) => {
      if(value){
        setCaptcha(true)
      }
    }

    return (
        <div>
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
            <div className="errorMessage" style={{color:"red"}}>{errorMessage}</div>  
            <Captcha onChange={handleChangeCaptcha} placeholder="Введите символы"/>  
            <Button style={{marginTop:"10px"}} onClick={sendMessage}>Отправить</Button>
        </div>
    );
};

export default SpecOfferAskOrg;