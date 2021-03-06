import React,{useState,useEffect,useContext} from 'react';
import {useParams} from 'react-router-dom';
import { fetchOneAsk, fetchOffers, fetchUser} from '../http/askAPI';
import {Card, Table, Col, Container, Row, Button,Form} from "react-bootstrap";
import {uploadOffer} from "../http/askAPI";
import {Context} from "../index";
import Question from '../components/Question';
import GoogleDocsViewer from "react-google-docs-viewer";
import dateFormat, { masks } from "dateformat";
import {Eye} from 'react-bootstrap-icons';
import "../style.css";
import waiting from "../waiting.gif";
import {useHistory} from 'react-router-dom';
import {ORGINFO} from "../utils/routes";
import ModalCT from '../components/ModalCT';
import {observer} from "mobx-react-lite";
import MessageBox from '../components/MessageBox'
import { checkAccessAsk } from '../utils/CheckAccessAsk';

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
            console.log(data)
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
                myalert.setMessage("?????????????????????? ?????????????? ????????????????????????.");
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
                myalert.setMessage("???????????????? ???????????? ????????????");
              }  
            }catch(e){
              console.log(e)
            }
          }
        }else{
          myalert.setMessage("?????????????????? ???????????????????? ????????????");
        }
      };

    const handleChange = e => {
      e.preventDefault();
      const { name, value } = e.target;
      let formErrors = offer.formErrors;
      let data = offer.data;
      data[name] = value;
      formErrors.Price = e.target.value <= 0 ? "???????????? ???????? ???????????? 0" : "";
      setOffer({data,formErrors});
    } 
  
    if(user===undefined || ask===undefined){
      return(
        <p className="waiting">
            <img height="320" src={waiting}/>
        </p>
    )
    }

    const offersRender = (item,index) =>{
      return(
        <tr key={index}>
          <td>{index+1}</td>
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
                            <td>??????????</td>
                            <td>
                              <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + ask?.Author?._id)}>
                                {ask?.Author?.name}</a><span style={{marginLeft:"10px"}}></span>
                                {(user.user.id === ask?.Author._id) || user.isAuth == false  ? 
                                <div></div> 
                                : 
                                  <Button style={{fontSize:"13px",padding:"2px"}} 
                                    onClick={()=>setModalActiveMessage(true)}>
                                    ???????????????? ??????????????????
                                  </Button>
                                }
                                </td>
                            </tr>
                            <tr>
                            <td>????????????????</td>
                            <td>{ask?.Name}</td>
                            </tr>
                            <tr>
                            <td>????????????</td>
                            <td>{Date.parse(ask?.EndDateOffers) > new Date().getTime() ?
                                      <td className="tdGreen">
                                      ????????????????
                                      </td>
                                      :
                                      <td className="tdRed">
                                      ?????????? ????????
                                      </td>
                                      }</td>
                            </tr>
                            <tr>
                            <td>???????????????????? ????????????</td>
                            <td>{ask?.Author?.telefon}</td>
                            </tr>
                            <tr>
                            <td>?????????? ?????????????????? ??????????????????????</td>
                            <td>{dateFormat(ask?.EndDateOffers, "dd/mm/yyyy HH:MM:ss")}</td>
                            </tr>
                            <tr>
                            <td>?????????? ????????????</td>
                            <td>{ask?.Text}</td>
                            </tr>
                            <tr>
                            <td>?????????? ????????????</td>
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
            <Card>
                <Card.Header style={{"background":"#282C34", "color":"white"}}>??????????????????????</Card.Header>
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
                        <th>??????????</th>
                        <th>????????</th>
                        <th>??????????????????</th>
                        <th>??????????</th>
                        <th>????????</th>
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
            <Card>
                <Card.Header style={{"background":"#282C34", "color":"white"}}>????????????-??????????</Card.Header>
                <Question ask={ask} 
                          author={ask?.Author} 
                          id={id} 
                          user={user}/>
            </Card>
            { checkAccessAsk(user,ask).AddOffer  ?       
            <Card>
            <Card.Header style={{"background":"#282C34", "color":"white"}}>?????? ??????????????????????</Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>????????</Form.Label>
                    <Form.Control type="number" placeholder="????????" name="Price" step=".01" onChange={handleChange}/>
                </Form.Group>
                <span className="errorMessage" style={{color:"red"}}>{offer.formErrors.Price}</span>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>??????????????????:</Form.Label>
                    <Form.Control as="textarea" name="Text"  onChange={handleChange} rows={3} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <div className="form-group files">
                    <label>??????????(?????????? ?????????????????? ???? ?????????? 30 ????????, ???? ?????????? 5 ???????????? ???? 5Mb)</label>
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
                    ??????????????????
                </Button>
                </Form.Group>
                </Form>
            </Card.Body>
            </Card>
                          :
                          <div></div> 
                        
            }       
        <ModalCT 
                  header="??????????????????" 
                  active={modalActiveMessage}
                  component={<MessageBox author={ask?.Author} setActive={setModalActiveMessage}/>}
                  setActive={setModalActiveMessage}   
        />
        </Container>

    );
});

export default CardAsk;