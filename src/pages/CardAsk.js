import React,{useState,useEffect,useContext} from 'react';
import {useParams} from 'react-router-dom';
import { fetchOneAsk, fetchOffers, fetchUser} from '../http/askAPI';
import {Card, Table, Col, Container, Row, Button,Form} from "react-bootstrap";
import {uploadOffer} from "../http/askAPI";
import {Context} from "../index";

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
                            <td>Название</td>
                            <td>{ask?.Name}</td>
                            </tr>
                            <tr>
                            <td>Статус</td>
                            <td>{ask?.Status}</td>
                            </tr>
                            <tr>
                            <td>Начальная цена</td>
                            <td>{ask?.Price}</td>
                            </tr>
                            <tr>
                            <td>Имя контактного лица</td>
                            <td>{ask?.FIO}</td>
                            </tr>
                            <tr>
                            <td>Телефон контактного лица</td>
                            <td>{ask?.Telefon}</td>
                            </tr>
                            <tr>
                            <td>Телефон контактного лица</td>
                            <td>{ask?.Telefon}</td>
                            </tr>
                            <tr>
                            <td>Поставка до:</td>
                            <td>{ask?.DeliveryTime}</td>
                            </tr>
                            <tr>
                            <td>Поставка до</td>
                            <td>{ask?.DeliveryTime}</td>
                            </tr>
                            <tr>
                            <td>Место поставки</td>
                            <td>{ask?.DeliveryAddress}</td>
                            </tr>
                            <tr>
                            <td>Условия оплаты</td>
                            <td>{ask?.TermsPayments}</td>
                            </tr>
                            <tr>
                            <td>Время окончания предложений</td>
                            <td>{ask?.EndDateOffers}</td>
                            </tr>
                            <tr>
                            <td>Комментарий</td>
                            <td>{ask?.Comment}</td>
                            </tr>
                            <tr>
                            <td>Текст заявки</td>
                            <td>{ask?.TextAsk}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {ask?.Files?.map((item)=><div>
                <a href={process.env.REACT_APP_API_URL + `download/` + item.filename}>{item.originalname}</a>
            </div>)}
            <Card>
                <Card.Header>Предложения</Card.Header>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Автор</th>
                        <th>Цена</th>
                        <th>Сообщение</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers?.map((item)=>
                        <tr>
                          <td>1</td>
                          <td>{item.Author}</td>
                          <td>{item.Price}</td>
                          <td>{item.Text}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
            </Card>   
            <Card>
            <Card.Header>Мое предложение</Card.Header>
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
                    <label>Файлы </label>
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

        </Container>
    );
};

export default CardAsk;