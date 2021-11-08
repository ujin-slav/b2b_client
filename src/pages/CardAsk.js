import React,{useState,useEffect,useContext} from 'react';
import {useParams} from 'react-router-dom';
import { fetchOneAsk, fetchOffers, fetchUser} from '../http/askAPI';
import {Card, Table, Col, Container, Row, Button,Form} from "react-bootstrap";
import {uploadOffer} from "../http/askAPI";
import {Context} from "../index";
import Question from '../components/Question';
import GoogleDocsViewer from "react-google-docs-viewer";

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
const CardAsk = () => {
    const [ask, setAsk] = useState();
    const [offers, setOffers] = useState();
    const {user} = useContext(Context);  
    const [offer, setOffer] = useState({
        data: {
          Price: "",
          Text: ""
        },
        formErrors: {
          Price: "",
        }
      });
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        fetchOneAsk(id).then((data)=>{
            setAsk(data)
        })
        fetchOffers(id).then((data)=>{
            setOffers(data);
        })
      },[]);

    const onSubmit = e => {
        if (formValid(offer)) {
            files.forEach((item)=>data.append("file", item));
            data.append("Price", offer.data.Price);
            data.append("Text", offer.data.Text)
            data.append("Ask", id)
            data.append("UserId", user.user.id)
            setLoading(true)
            uploadOffer(data).then((response)=>{});      
            setLoading(false)  
        }
      };  
      const removeFile = (id) => {
        console.log(id);
        const newFiles = files.filter((item,index,array)=>index!==id);
        setFiles(newFiles);
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
    const handleChange = e => {
      e.preventDefault();
      const { name, value } = e.target;
      let formErrors = offer.formErrors;
      let data = offer.data;
      data[name] = value;
      formErrors.Price = e.target.value <= 0 ? "Должно быть больше 0" : "";
      setOffer({data,formErrors});
    }  

    return (
        <Container>
            <Row>
                <Col>
                     <Table striped bordered hover size="sm">
                        <tbody>
                            <tr>
                            <td>Автор</td>
                            <td>{ask?.Author}</td>
                            </tr>
                            <tr>
                            <td>Название</td>
                            <td>{ask?.Name}</td>
                            </tr>
                            <tr>
                            <td>Статус</td>
                            <td>{ask?.Status}</td>
                            </tr>
                            <tr>
                            <td>Контактные данные</td>
                            <td>{ask?.FIO}</td>
                            </tr>
                            <tr>
                            <td>Время окончания предложений</td>
                            <td>{ask?.EndDateOffers}</td>
                            </tr>
                            <tr>
                            <td>Текст заявки</td>
                            <td>{ask?.Text}</td>
                            </tr>
                            <tr>
                            <td>Файлы заявки</td>
                            <td> {ask?.Files?.map((item,index)=><div key={index}>
                              <a href={process.env.REACT_APP_API_URL + `download/` + item.filename}>{item.originalname}</a>
                          </div>)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Card>
                <Card.Header style={{"background":"#282C34", "color":"white"}}>Вопрос-ответ</Card.Header>
                <Question offers={offers} 
                          author={ask?.Author} 
                          id={id} 
                          user={user}/>
            </Card>   
            <Card>
                <Card.Header style={{"background":"#282C34", "color":"white"}}>Предложения</Card.Header>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Автор</th>
                        <th>Цена</th>
                        <th>Сообщение</th>
                        <th>Файлы</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers?.map((item,index)=>
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{item.Author}</td>
                          <td>{item.Price}</td>
                          <td>{item.Text}</td>
                          <td>{item.Files?.map((item,index)=><div key={index}>
                              <a href={process.env.REACT_APP_API_URL + `download/` + item.filename}>{item.originalname}</a>
                          </div>)}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
            </Card>   
            <Card>
            <Card.Header style={{"background":"#282C34", "color":"white"}}>Мое предложение</Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Цена</Form.Label>
                    <Form.Control type="number" placeholder="Цена" name="Price" onChange={handleChange}/>
                </Form.Group>
                <span className="errorMessage" style={{color:"red"}}>{offer.formErrors.Price}</span>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Сообщение:</Form.Label>
                    <Form.Control as="textarea" name="Text"  onChange={handleChange} rows={3} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <div className="form-group files">
                    <label>Файлы(будут храниться не более 30 дней)</label>
                    <input type="file"
                            onChange={onInputChange}
                            className="form-control"
                            multiple/>
                    </div>
                    {files.map((a,key)=><div key={key}>{a.name}
                    <button onClick={()=>removeFile(key)}>X</button>
                    </div>
                    )}   
                    <Button
                    variant="primary"
                    type="submit"  >
                    Отправить
                </Button>
                </Form.Group>
                </Form>
            </Card.Body>
            </Card>
            <GoogleDocsViewer
        width="600px"
        height="780px"
        fileUrl="https://disk.yandex.ru/d/g9ncsDazGberMg"
      />
        </Container>
    );
};

export default CardAsk;