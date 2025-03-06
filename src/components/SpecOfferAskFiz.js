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


const SpecOfferAskOrg = ({specOffer,setActive}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const {user} = useContext(Context);
  const {myalert} = useContext(Context);
  const {chat} = useContext(Context);
  const inputEl = useRef(null);
  const [sumTotal,setSumTotal] = useState(specOffer.Price); 
  const[specAsk,setSpecAsk] = useState({
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
  })

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
            To:specOffer.Author,
            SpecOffer:specOffer._id,
            Table: [{
              Name: specOffer.Name,
              Price: specOffer.Price,
              Code: specOffer.Code,
              Measure: specOffer.Measure,
              FIZ: true,
              Count: specAsk.data.amount
            }]
          })
          if (result.status===200){
            myalert.setMessage("Заявка успешно отправлена");
            chat.socket.emit("unread_specOfferAsk", {To:specOffer.Author});
            setActive(false)
          } else {
            myalert.setMessage(result?.data?.message)
          }
        } else {
          console.error("FORM INVALID");
          setErrorMessage("Не заполнены поля заявки");
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
            <div style={{textAlign:"left"}}>
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