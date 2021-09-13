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
          Name: "",
          MaxPrice: "",
          MaxDate: "",
          DateExp: "",
          Text: "",
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

    const onSubmit = e => {
      e.preventDefault();
  
      if (formValid(ask)) {
        files.forEach((item)=>data.append("file", item));
        data.append("Name", ask.data.Name)
        data.append("maxPrice", ask.data.MaxPrice)
        data.append("maxDate", ask.data.MaxDate)
        data.append("DateExp", ask.data.DateExp)
        data.append("Text", ask.data.Text)
        setLoading(true)
        upload(data).then((response)=>{});      
        setLoading(false)  
      } else {
        console.error("FORM INVALID");
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
                    name="DateExp"
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