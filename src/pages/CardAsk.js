import React,{useState,useEffect,useContext} from 'react';
import {useParams} from 'react-router-dom';
import { fetchOneAsk, fetchOffers, fetchUser} from '../http/askAPI';
import {Card, Table, Col, Container, Row, Button,Form} from "react-bootstrap";
import {uploadOffer,setWinnerAPI} from "../http/askAPI";
import {Context} from "../index";
import Question from '../components/Question';
import GoogleDocsViewer from "react-google-docs-viewer";
import dateFormat, { masks } from "dateformat";
import {Eye,StarFill} from 'react-bootstrap-icons';
import "../style.css";
import waiting from "../waiting.gif";
import {useHistory} from 'react-router-dom';
import {ORGINFO} from "../utils/routes";
import ModalCT from '../components/ModalCT';
import ModalAlert from '../components/ModalAlert';
import {observer} from "mobx-react-lite";
import MessageBox from '../components/MessageBox'
import { checkAccessAsk } from '../utils/CheckAccessAsk';
import '../fontawesome.min.css';

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
  

const CardAsk = observer(() => {
    const history = useHistory();
    const {myalert} = useContext(Context);
    const [modalActive,setModalActive] = useState(false);
    const [winnerDTO,setWinnerDTO] = useState();
    const [ask, setAsk] = useState();
    const [offers, setOffers] = useState([{}]);
    const [fileSize, setFileSize] = useState(0);
    const [modalActiveMessage,setModalActiveMessage] = useState(false)
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
    const {chat} =  useContext(Context)

    useEffect(() => {
        fetchOneAsk(id).then((data)=>{
            setAsk(data)
        })
        fetchOffers(id).then((data)=>{ 
          setOffers(data);
        })
      },[]);

    const onSubmit = e => {
        e.preventDefault();
        if (formValid(offer)) {
          const data = new FormData();
            files.forEach((item)=>data.append("file", item));
            data.append("Price", offer.data.Price);
            data.append("Text", offer.data.Text)
            data.append("Ask", id)
            data.append("UserId", user.user.id)
            setLoading(true)
            uploadOffer(data).then((response)=>{
              fetchOffers(id).then((data)=>{ 
                setOffers(data);
                myalert.setMessage("Предложение успешно опубликовано.");
              })
            });      
            setLoading(false)  

        }
      };  
      const removeFile = (id) => {
        console.log(id);
        const newFiles = files.filter((item,index,array)=>index!==id);
        setFiles(newFiles);
      }

      const onInputChange = (e) => {
        if(files.length+e.target.files.length<6){
          for(let i = 0; i < e.target.files.length; i++) { 
            try{
              if(fileSize + e.target.files[i].size < 5242880){
                setFileSize(fileSize + e.target.files[i].size)
                setFiles(((oldItems) => [...oldItems, e.target.files[i]]))
                console.log(fileSize)
              } else {
                myalert.setMessage("Превышен размер файлов");
              }  
            }catch(e){
              console.log(e)
            }
          }
        }else{
          myalert.setMessage("Превышено количество файлов");
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
  
    if(user===undefined || ask===undefined){
      return(
        <p className="waiting">
            <img height="320" src={waiting}/>
        </p>
    )
    }

    const setWinner = ()=>{
      setWinnerAPI({winnerDTO,id}).then((result)=>{
        if (result.status===200){
          myalert.setMessage("Успешно");
        } else {
          myalert.setMessage(result?.data?.message)
        }
      })
    }

    const possChoise = (item) => {
      if(user.user.id === ask?.Author._id && !ask?.Winner){
        return (<StarFill className='starFillSetWinner' onClick={(e)=>{setWinnerDTO(item);setModalActive(true)}}/>)
      }else{
        return (<div></div>)
      }
    }

    const winnerDef = () => {
      console.log(ask?.Winner)
      if(user.user.id === ask?.Author._id && !ask?.Winner){
        return (
          <div className='exampleWinner'>
          <StarFill className='starFillExample'/>
            - Выбрать победителя(после этого торги будут прекращены).
          </div>
        )
      }else if(ask?.Winner){
        const winner = offers.find(item => item.AuthorID === ask?.Winner)
        return (
          <div className='exampleWinner'>
          <span className="boldtext">Победителем выбран: {winner?.AuthorName} {winner?.AuthorOrg}</span>
          </div>
        )
      }else{
          return(<div></div>)
      }
    }

    const offersRender = (item,index) =>{
      return(
        <tr key={index}>
          <td>{index+1}{possChoise(item)}
          </td>
          <td>
            <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + item.AuthorID)}>
              {item.AuthorName} 
            <div>{item.AuthorOrg}</div></a>
          </td>
          <td>{item.Price}</td>
          <td>{item.Text}</td>
          <td>{item.Files?.map((item,index)=><div key={index}>
              <a href={process.env.REACT_APP_API_URL + `download/` + item.filename}>{item.originalname}</a>
              <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
              ${process.env.REACT_APP_API_URL}download/${item.filename}`)}/>
          </div>)}</td>
          <td>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
        </tr>
      )
    }

    return (
        <Container className="mx-auto my-4">
            <Row>
                <Col>
                     <Table>
                        <tbody>
                            <tr>
                            <td>Автор</td>
                            <td>
                              <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + ask?.Author?._id)}>
                                {ask?.Author?.name}</a><span style={{marginLeft:"10px"}}></span>
                                {(user.user.id === ask?.Author._id) || user.isAuth == false  ? 
                                <div></div> 
                                : 
                                <span>
                                <button className="myButtonMessage"
                                onClick={()=>setModalActiveMessage(true)}>
                                  <div>
                                  Написать сообщение
                                </div>
                                </button>
                                <i className="col-2 fa fa-solid fa-paper-plane colorBlue"/>
                                </span>
                                }
                                </td>
                            </tr>
                            <tr>
                            <td>Название</td>
                            <td>{ask?.Name}</td>
                            </tr>
                            <tr>
                            <td>Статус</td>
                            <td>{Date.parse(ask?.EndDateOffers) > new Date().getTime() ?
                                      <td className="tdGreen">
                                      Активная
                                      </td>
                                      :
                                      <td className="tdRed">
                                      Истек срок
                                      </td>
                                      }</td>
                            </tr>
                            <tr>
                            <td>Контактные данные</td>
                            <td>{ask?.Author?.telefon}</td>
                            </tr>
                            <tr>
                            <td>Время окончания предложений</td>
                            <td>{dateFormat(ask?.EndDateOffers, "dd/mm/yyyy HH:MM:ss")}</td>
                            </tr>
                            <tr>
                            <td>Текст заявки</td>
                            <td>{ask?.Text}</td>
                            </tr>
                            <tr>
                            <td>Файлы заявки</td>
                            <td> {ask?.Files?.map((item,index)=><div key={index}>
                              <a href={process.env.REACT_APP_API_URL + `download/` + item.filename}>{item.originalname}</a>
                              <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                              ${process.env.REACT_APP_API_URL}download/${item.filename}`)}/>
                          </div>)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {winnerDef()}
            <Card>
                <Card.Header style={{"background":"#282C34", "color":"white"}}>Предложения</Card.Header>
                  <Table striped bordered hover>
                  <col style={{"width":"3%"}}/>
                  <col style={{"width":"15%"}}/>
                  <col style={{"width":"5%"}}/>
                  <col style={{"width":"30%"}}/>
                  <col style={{"width":"40%"}}/>
                  <col style={{"width":"5%"}}/>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Автор</th>
                        <th>Цена</th>
                        <th>Сообщение</th>
                        <th>Файлы</th>
                        <th>Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers?.map((item,index)=>{
                         if(!ask?.Hiden || user.user.id === ask?.Author._id){
                          return(offersRender(item,index))
                        }else if(item.AuthorID===user.user.id){
                          return(offersRender(item,index))
                        }
                      })}
                    </tbody>
                  </Table>
            </Card>   
                <Question ask={ask} 
                          author={ask?.Author} 
                          id={id} 
                          user={user}/>
            { checkAccessAsk(user,ask).AddOffer  ?       
            <Card>
            <Card.Header style={{"background":"#282C34", "color":"white"}}>Мое предложение</Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Цена</Form.Label>
                    <Form.Control type="number" placeholder="Цена" name="Price" step=".01" onChange={handleChange}/>
                </Form.Group>
                <span className="errorMessage" style={{color:"red"}}>{offer.formErrors.Price}</span>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Сообщение:</Form.Label>
                    <Form.Control as="textarea" name="Text"  onChange={handleChange} rows={3} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <div className="form-group files">
                    <label>Файлы(будут храниться не более 30 дней, не более 5 файлов по 5Mb)</label>
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
                          :
                          <div></div> 
                        
            }       
        <ModalCT 
                  header="Сообщение" 
                  active={modalActiveMessage}
                  component={<MessageBox author={ask?.Author} setActive={setModalActiveMessage}/>}
                  setActive={setModalActiveMessage}   
        />
        <ModalAlert header={`Вы действительно хотите назначить победителем `
         + winnerDTO?.AuthorName + ` ` 
         + winnerDTO?.AuthorOrg + 
        `. Возобновить торги будет уже нельзя.`}
              active={modalActive} 
              setActive={setModalActive} funRes={setWinner}/>
        </Container>

    );
});

export default CardAsk;