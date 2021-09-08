import React,{useState,useRef} from 'react';
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

const data = new FormData();
const CreateAsk = () => {
    const[ask,setAsk] = useState( {
        data: {
          Name: null,
          MaxPrice: null,
          MaxDate: null,
          DateExp: null,
          Text: null,
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

    const handleSubmit = () => {

    }

    const handleChange = e => {
      e.preventDefault();
      const { name, value } = e.target;
      let formErrors = ask.formErrors;
      let data = ask.data
      data[name] = value;
      
      switch (name) {
        case "nameOrder":
          formErrors.Name =
            value.length < 3 ? "минимум 3 символа" : "";
          break;
        case "MaxPrice":
          formErrors.NameOrg =
            value.length < 3 ? "минимум 3 символа" : "";
          break;  
        case "MaxDate":
          formErrors.Inn =
            value.length < 3 ? "минимум 3 символа" : "";
          break;  
        case "DateExp":
          formErrors.Inn =
            value.length < 3 ? "минимум 3 символа" : "";
        break;    
        case "Text":
          formErrors.Inn =
            value.length < 3 ? "минимум 3 символа" : "";
          break;
        default:
          break;
      }
      setAsk({ data, formErrors});
    }
    
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState([])

    const onInputChange = (e) => {
      for(let i = 0; i < e.target.files.length; i++) { 
        try{
        setFiles(((oldItems) => [...oldItems, e.target.files[i]]));
        }catch(e){
          console.log(e)
        }
      }
    };

    const onSubmit = (e) => {
        files.forEach((item)=>data.append("file", item));
        data.append("Name", ask.data.Name)
        data.append("maxPrice", ask.data.MaxPrice)
        data.append("maxDate", ask.data.MaxDate)
        data.append("DateExp", ask.data.DateExp)
        data.append("Text", ask.data.Text)
        setLoading(true)
        upload(data).then((response)=>{});      
        setLoading(false)  
    }
    
    const removeFile = (id) => {
      console.log(id);
      const newFiles = files.filter((item,index,array)=>index!==id);
      setFiles(newFiles);
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
            <Form onSubmit={onSubmit}>
                <RegInput value={{Name: "Name", Label: "Название заявки", handleChange, PlaceHolder: "Название заявки"}} />
                <Form.Group>
                <Form.Label>Максимальная цена</Form.Label>
                <Form.Control
                    name="MaxPrice"
                    onChange={handleChange}
                    placeholder="Максимальная стоимость"
                />
                <span className="errorMessage" style={{color:"red"}}></span>
                </Form.Group>
                <Form.Group>
                <Form.Label>Максимальный срок поставки</Form.Label>
                <Form.Control
                    name="MaxDate"
                    onChange={handleChange}
                    placeholder="Максимальный срок поставки"
                />
                <span className="errorMessage" style={{color:"red"}}></span>
                </Form.Group>
                <Form.Group>
                <Form.Label>Дата окончания предложений</Form.Label>
                <Form.Control
                    type="date"
                    name="DateExp"
                    onChange={handleChange}
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
                <span className="errorMessage" style={{color:"red"}}></span>
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
        </div>
    );
};

export default CreateAsk;