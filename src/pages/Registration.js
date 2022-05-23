import { useEffect ,useContext, useState} from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Card
} from "react-bootstrap";
import {Context} from "../index";
import RegInput from "../components/RegInput";
import {B2B_ROUTE} from "../utils/routes";
import {useHistory} from 'react-router-dom';
import ModalCT from '../components/ModalCT';
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
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


const RegistrationForm = () => {
  const history = useHistory();  
  const {user} = useContext(Context);
  const {myalert} = useContext(Context);
    const[userReg,setuserReg] = useState( {
        data: {
          name: null,
          email: null,
          nameOrg: null,
          adressOrg: null,
          telefon: null,
          inn: null,
          password: null,
          confirmPassword: null,
          fiz: false
        },
        formErrors: {
          name: "",
          email: "",
          nameOrg: "",
          adressOrg: "",
          telefon: "",
          Inn: "",
          password: "",
          confirmPassword: "",
        }
      }
    );
      const [checked, setChecked] = useState(false);
      const [captcha, setCaptcha] = useState(false);
      const [modalActiveReg,setModalActiveReg] = useState(false)
      const [modalActiveCat,setModalActiveCat] = useState(false)
      const [checkedRegion,setCheckedRegion] = useState([]);
      const [expandedRegion,setExpandedRegion] = useState([]);
      const [checkedCat,setCheckedCat] = useState([]);
      const [expandedCat,setExpandedCat] = useState([]);
 
      const handleChecked = () => {
          let data = userReg.data
          data["fiz"] = !checked;
          let formErrors = userReg.formErrors;
          console.log(data);
          setuserReg({ data, formErrors});
          setChecked(!checked);
      };

    const handleSubmit = async e => {
      e.preventDefault(); 
      if(captcha){
          if (formValid(userReg)) {
              const result = await user.registration(userReg.data);
              if(result.data?.errors){
                myalert.setMessage(result.data.message);
              } 
              if(result.data?.user){
                myalert.setMessage(<div>
                    <div>Пользователь "{result.data?.user.email}" успешно добавлен.</div>
                    <div>Активируйте аккаунт по ссылке отправленной на электронный адрес.</div>
                </div>
                );
                history.push(B2B_ROUTE);
              }
          } else {
            console.error("FORM INVALID");
          }
        } else {
          myalert.setMessage("Неверно введены данные с картинки(CAPTCHA)");
          console.error("FORM INVALID");
        }    
    };

    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = userReg.formErrors;
        let data = userReg.data
        data[name] = value;

        switch (name) {
          case "name":
            formErrors.name =
              value.length < 3 ? "минимум 3 символа" : "";
            break;
          case "nameOrg":
            formErrors.nameOrg =
              value.length < 3 ? "минимум 3 символа" : "";
            break;  
          case "inn":
            formErrors.inn =
              value.length < 8 ? "неверный инн" : "";
            break;  
          case "adressOrg":
            formErrors.adressOrg =
              value.length < 3 ? "минимум 3 символа" : "";
          break;   
          case "telefon":
            formErrors.telefon =
              value.length < 3 ? "минимум 3 символа" : "";
          break;    
          case "email":
            formErrors.email = emailRegex.test(value)
              ? ""
              : "неверный email";
            break;
          case "password":
            formErrors.password =
              value.length < 6 ? "минимум 6 символов" : "";
            break;
          case "confirmPassword":
            formErrors.confirmPassword =
              data.confirmPassword !== data.password ? "Пароли не совпадают" : "";
            break;  
          default:
            break;
        }
        setuserReg({ data, formErrors});
    };

    const handleChangeCaptcha = (value) => {
        if(value){
          setCaptcha(true)
        }
    }
    
    return (
    <Container style={{width: 800}}>
        <Row>
            <Col>
            <h1 className="text-success">Регистрация</h1>
            </Col>
        </Row>
        <Row>
            <Col>
            </Col>
        </Row>
        <Row>
            <Col>
            <Form onSubmit={handleSubmit}>
                <RegInput value={{Name: "name", Label: "Имя", handleChange, PlaceHolder: "Ваше имя", ErrorMessage: userReg.formErrors.name}} />
                <RegInput value={{Name: "email", Label: "E-mail", handleChange, PlaceHolder: "E-mail", ErrorMessage: userReg.formErrors.email}} />             
                <RegInput value={{Name: "nameOrg", Label: "Название организации", handleChange, PlaceHolder: "Название организации", ErrorMessage: userReg.formErrors.nameOrg}} />
                <RegInput value={{Name: "inn", Label: "ИНН", handleChange, PlaceHolder: "ИНН", ErrorMessage: userReg.formErrors.inn}} />
                <RegInput value={{Name: "adressOrg", Label: "Адрес организации", handleChange, PlaceHolder: "Адрес организации", ErrorMessage: userReg.formErrors.adressOrg}} />
                <RegInput value={{Name: "telefon", Label: "Контактный телефон", handleChange, PlaceHolder: "Контактный телефон", ErrorMessage: userReg.formErrors.telefon}} />
                <Form.Group>
                <Form.Label>Регионы</Form.Label>
                <Card body>{getCategoryName(checkedRegion, regionNodes)}</Card>
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveReg(true)}>
                                Выбор
                                </Button> 
                </Form.Group>  
                <Form.Group>         
                <Form.Label>Категории</Form.Label>
                <Card body>{getCategoryName(checkedCat, categoryNodes)}</Card>
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveCat(true)}>
                                Выбор
                                </Button>
                </Form.Group>
                <RegInput value={{Name: "password", Label: "Пароль", handleChange, PlaceHolder: "Пароль", ErrorMessage: userReg.formErrors.password}} />
                <RegInput value={{Name: "confirmPassword", Label: "Повторите пароль", handleChange, PlaceHolder: "Повторите пароль", ErrorMessage: userReg.formErrors.confirmPassword}} />
                <div style={{"margin":"20px 0px 20px 0px"}}>
                  <Captcha onChange={handleChangeCaptcha} placeholder="Введите символы"/>
                </div>  
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
        <ModalCT 
                header="Регионы" 
                active={modalActiveReg} 
                setActive={setModalActiveReg} 
                component={<RegionTree 
                checked={checkedRegion} expanded={expandedRegion} 
                setChecked={setCheckedRegion} setExpanded={setExpandedRegion}
                />}/>
           <ModalCT 
                header="Категории" 
                active={modalActiveCat} 
                setActive={setModalActiveCat} 
                component={<CategoryTree 
                checked={checkedCat} expanded={expandedCat} 
                setChecked={setCheckedCat} setExpanded={setExpandedCat}
          />}/>       
        </Container>
    );
};

export default RegistrationForm;