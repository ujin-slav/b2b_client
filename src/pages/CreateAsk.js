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

const data = new FormData();
const CreateAsk = () => {

    const handleSubmit = () => {

    }

    const handleChange = () => {

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
            <Form onSubmit={handleSubmit}>
                <RegInput value={{Name: "nameOrder", Label: "Название заявки", handleChange, PlaceHolder: "Название заявки"}} />
                <Form.Group>
                <Form.Label>Максимальная цена</Form.Label>
                <Form.Control
                    name="maxPrice"
                    onChange={handleChange}
                    placeholder="Максимальная стоимость"
                />
                <span className="errorMessage" style={{color:"red"}}></span>
                </Form.Group>
                <Form.Group>
                <Form.Label>Максимальный срок поставки</Form.Label>
                <Form.Control
                    name="maxDate"
                    onChange={handleChange}
                    placeholder="Максимальный срок поставки"
                />
                <span className="errorMessage" style={{color:"red"}}></span>
                </Form.Group>
                <Form.Group>
                <Form.Label>Текст заявка</Form.Label>
                <Form.Control
                    name="maxDate"
                    onChange={handleChange}
                    placeholder="Текст заявки"
                    as="textarea"
                />
                <span className="errorMessage" style={{color:"red"}}></span>
                </Form.Group>
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