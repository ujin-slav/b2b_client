import React, {useState,
    useContext,
    useRef} from "react";
import { Form,Button,Row,Col} from "react-bootstrap";
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
    const [sumTotal,setSumTotal] = useState(specOffer.Price); 
    const[specAsk,setSpecAsk] = useState( {
        data: {
          comment:"",
          amount:1
        },
        formErrors: {
          amount:""
        }
      }
      );

    const sendMessage = async (e) => {
        if(specAsk.data.amount <= 0){
          myalert.setMessage("Количество должно быть больше 0")
          return
        }
        if(captcha){
          if (formValid(specAsk)) {
            const result = await SpecOfferService.specAskOrg({
              Author:user.user.id,
              Comment:specAsk.data.comment,
              Amount:specAsk.data.amount,
              Receiver:specOffer.Author,
              SpecOffer:specOffer._id
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
        const { name, value } = e.target;
        let formErrors = specAsk.formErrors;
        let data = specAsk.data
        data[name] = value;
        setSpecAsk({ data, formErrors});
        setSumTotal(specOffer.Price * data.amount)
    }

    const handleChangeCaptcha = (value) => {
      if(value){
        setCaptcha(true)
      }
    }

    return (
        <div>
            <div class="mb-3">
                    <span class="align-items-center text-break">{specOffer.Name} </span>
                    <Form.Control 
                        defaultValue="1"
                        type="number"
                        name="amount"
                        min="0"
                        className="mx-2 d-inline w-auto"
                        onChange={handleChange}
                    />
            </div>
            <hr style={{"border": "none","background-color": "black","height": "5px"}}/>
            <div class="total-sum mb-5">
                Сумма итого:<span style={{"font-weight":"500"}}> {sumTotal.toFixed(2)}</span>
            </div>
            <Form.Control 
                type="text"  
                name="comment" 
                placeholder="Комментарий к заказу"
                className="w-100 mb-3"
                as="textarea"
                onChange={handleChange}/>
            <div className="errorMessage" style={{color:"red"}}>{errorMessage}</div>  
            <Captcha onChange={handleChangeCaptcha} placeholder="Введите символы"/>  
            <button className="myButtonMessage mt-3" onClick={sendMessage}>Отправить</button>
        </div>
    );
};

export default SpecOfferAskOrg;