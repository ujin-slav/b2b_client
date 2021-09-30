import React,{useState,useRef,useContext} from 'react';
import RegInput from "../components/RegInput";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    InputGroup,
    Card,
  } from "react-bootstrap";
import {upload} from "../http/askAPI";
import Forgot from './Forgot';
import ModalCT from '../components/ModalCT';
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import {Context} from "../index";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';

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


const data = new FormData();

const CreateAsk = () => {
    const[ask,setAsk] = useState( {
        data: {
          Author: "",
          Name: "",
          MaxPrice: "",
          Telefon: "",
          MaxDate: "",
          EndDateOffers: "",
          Comment: "",
          Text: null,
          Category: "",
          Region: "",
        },
        formErrors: {
          Name: "",
          MaxPrice: "",
          MaxDate: "",
          DateExp: "",
          Text: "",
        }
      }
    );
    const {user} = useContext(Context);  
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState([])
    const [modalActiveReg,setModalActiveReg] = useState(false)
    const [modalActiveCat,setModalActiveCat] = useState(false)
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [expandedRegion,setExpandedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const [expandedCat,setExpandedCat] = useState([]);
    const {myalert} = useContext(Context);

    const onSubmit = async(e) => {
      e.preventDefault();
      if (formValid(ask)) {
        const data = new FormData();
        files.forEach((item)=>data.append("file", item));
        data.append("Author", user.user.id)
        data.append("Name", ask.data.Name)
        data.append("MaxPrice", ask.data.MaxPrice)
        data.append("Telefon", ask.data.Telefon)
        data.append("MaxDate", ask.data.MaxDate)
        data.append("EndDateOffers", ask.data.EndDateOffers)
        data.append("Comment", ask.data.Comment)
        data.append("Text", ask.data.Text)
        data.append("Category", ask.data.Category)
        data.append("Region", ask.data.Region)
        data.append("Date", new Date())
        const result = await upload(data)
        if(result.ask){
          myalert.setMessage("Заявка успешно добавлена");
        } else if(!result.errors){
          myalert.setMessage(result.errors?.message);
        }
      } else {
        console.error("FORM INVALID");
        myalert.setMessage("Не заполнено поле текст заявки");
      }
    };

    const handleChange = e => {
      e.preventDefault();
      const { name, value } = e.target;
      let formErrors = ask.formErrors;
      let data = ask.data
      data[name] = value;
      
      switch (name) {
        case "Name":
          formErrors.Name =
            value.length < 3 ? "минимум 3 символа" : "";
          break;   
        case "Text":
          formErrors.Text =
            value.length < 3 ? "минимум 3 символа" : "";
          break;
        default:
          break;
      }
      setAsk({ data, formErrors});
    }

    const onInputChange = (e) => {
      for(let i = 0; i < e.target.files.length; i++) { 
        try{
        setFiles(((oldItems) => [...oldItems, e.target.files[i]]));
        }catch(e){
          console.log(e)
        }
      }
    };
    
    const removeFile = (id) => {
      console.log(id);
      const newFiles = files.filter((item,index,array)=>index!==id);
      setFiles(newFiles);
    }

    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substr(0,10);

    return (
        <div>
           <Container style={{width: 800}}>
        <Row>
            <Col>
            <h1>Создать заявку</h1>
            </Col>
        </Row>
        <Row>
            <Col>
            </Col>
        </Row>
        <Row>
            <Col>
            <Form onSubmit={onSubmit}>
                <RegInput value={{Name: "Name", Label: "Название заявки", handleChange, PlaceHolder: "Название заявки",ErrorMessage: ask.formErrors.Name}} />
                <Form.Group>
                <Form.Label>Максимальная цена</Form.Label>
                <Form.Control
                    type="number"
                    name="MaxPrice"
                    onChange={handleChange}
                    placeholder="Максимальная стоимость"
                />
                <span className="errorMessage" style={{color:"red"}}></span>
                </Form.Group>
                <Form.Group>
                <Form.Label>Максимальный срок поставки (дней)</Form.Label>
                <Form.Control
                    type="number"
                    name="MaxDate"
                    onChange={handleChange}
                    placeholder="Максимальный срок поставки (дней)"
                />
                <span className="errorMessage" style={{color:"red"}}></span>
                </Form.Group>
                <Form.Group>
                <Form.Label>Дата окончания предложений</Form.Label>
                <Form.Control
                    type="date"
                    name="EndDateOffers"
                    onChange={handleChange}
                    defaultValue={date} 
                    placeholder="Дата окончания предложений"
                />
                <span className="errorMessage" style={{color:"red"}}></span>
                </Form.Group>
                <Form.Group>
                <Form.Label>Текст заявки</Form.Label>
                <Form.Control
                    name="Text"
                    onChange={handleChange}
                    placeholder="Текст заявки"
                    as="textarea"
                />
                <span className="errorMessage" style={{color:"red"}}>{ask.formErrors.Text}</span>
                </Form.Group>
                <Form.Group>
                <Form.Label>Комментарий</Form.Label>
                <Form.Control
                    name="Comment"
                    onChange={handleChange}
                    placeholder="Комментарий"
                />
                </Form.Group>
                <Form.Group>
                <Form.Label>Контактный телефон</Form.Label>
                <Form.Control
                    name="Telefon"
                    onChange={handleChange}
                    placeholder="Контактный телефон"
                />
                </Form.Group>
                <Form.Group>
                <Form.Label>Категории</Form.Label>
                <InputGroup className="mb-3">
                <Card body>{getCategoryName(checkedCat, categoryNodes)}</Card>
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveCat(true)}>
                                ...
                                </Button>
                </InputGroup>
                </Form.Group>
                <Form.Group>
                <Form.Label>Регион</Form.Label>
                <InputGroup className="mb-3">
                <Card body>{getCategoryName(checkedRegion, regionNodes)}</Card>
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveReg(true)}>
                                ...
                                </Button>
                </InputGroup>
                </Form.Group>
                <div className="form-group files">
                  <label>Файлы </label>
                  <input type="file"
                        onChange={onInputChange}
                        className="form-control"
                        multiple/>
                </div>
                <Button
                variant="primary"
                type="submit"
                className="btn btn-success ml-auto mr-1"
                >
                Отправить
                </Button>
            </Form>
            {files.map((a,key)=><div key={key}>{a.name}
              <button onClick={()=>removeFile(key)}>X</button>
            </div>
            )}   
            </Col>
        </Row>    
        </Container> 
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
        </div>
    );
};

export default CreateAsk;