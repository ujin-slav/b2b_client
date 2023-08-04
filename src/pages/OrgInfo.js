import React,{useState,useEffect,useContext} from 'react';
import {useParams} from 'react-router-dom';
import {fetchUser} from '../http/askAPI';
import {Table, Col, Container, Row,Card} from "react-bootstrap";
import ModalCT from '../components/ModalCT';
import MessageBox from '../components/MessageBox'
import {Context} from "../index";
import UserSpecOfferTable from "../components/UserSpecOfferTable";
import UserAsk from "../components/UserAsk";
import UserPrice from '../components/UserPrice';
import ReviewOrgItems from '../components/ReviewOrgItems';
import '../fontawesome.css';
import { CREATEASK } from '../utils/routes';
import {useHistory} from 'react-router-dom'

const OrgInfo = () => {

    const {idorg,idprod} = useParams();
    const [org, setOrg] = useState();
    const [file, setFile] = useState([])
    const {user} = useContext(Context);  
    const [error, setError] = useState();
    const [modalActiveMessage,setModalActiveMessage] = useState(false)
    const history = useHistory()

    useEffect(() => {
        fetchUser(idorg).then((result)=>{
            if(result.status===200){
                if(result.data){
                    setOrg(result.data)
                    if(result.data.logo){
                        fetch(process.env.REACT_APP_API_URL + `getlogo/` + result.data.logo?.filename)
                        .then(res => res.blob())
                        .then(blob => {
                        setFile(blob)
                        })
                    }
                }
            }else{
                setError(result.data.errors)    
            }
        })

    },[]);

    const logo = () => {
        if(file.length!==0){
            return (
                <div className='dnd-list'>
                <div className='fotoContainer'>
                    <img 
                        className="foto" 
                        src={URL.createObjectURL(file)} 
                    /> 
                </div>
                </div>
            )    
        }else{
            return(
                <span></span>
            )
        }
    }

    if(error){
        return(
            <div>
              <Container
                      className="d-flex justify-content-center align-items-center"
                      style={{height: window.innerHeight - 54}}
                      >
                  <Card style={{width: 600}} className="p-5 ">
                      <h5>Пользователь не существует</h5>
                  </Card> 
              </Container>
            </div>
        )
      }

    return (
            <Container style={{widorgth: "80%"}}>
            <Row>
                <Col>
                    <Table >
                        <tbody>
                        <tr>
                            <td>Логотип</td>
                            <td>
                                {logo()}
                            </td>
                            </tr>
                            <tr>
                            <td>Имя</td>
                            <td>{org?.name}
                            </td>
                            </tr>
                            {user.isAuth ? 
                            <tr>
                            <td></td>
                            <td>
                                <div className="orgInfoMessageButton">
                                    <button className="myButtonMessage"
                                            onClick={()=>setModalActiveMessage(true)}>
                                            Написать сообщение
                                            <i className="fa fa-solidorg fa-paper-plane colorBlue"/>
                                    </button>
                                    <button className="myButtonMessage"
                                            onClick={()=>history.push(CREATEASK + '/' + idorg)}>
                                            <div>
                                            Отправить персональную заявку
                                            <i className="fa fa-solidorg fa-envelope-o colorBlue"/>
                                            </div>
                                    </button>
                                </div>
                            </td>
                            </tr>
                            :
                            <div></div>
                            }
                            <tr>
                            <td>Название организации</td>
                            <td>{org?.nameOrg}</td>
                            </tr>
                            <tr>
                            <td>Адрес организации</td>
                            <td>{org?.adressOrg}</td>
                            </tr>
                            <tr>
                            <td>ИНН</td>
                            <td>{org?.inn}</td>
                            </tr>
                            <tr>
                            <td>Описание</td>
                            <td>{org?.description}</td>
                            </tr>
                            <tr>
                            <td>Контактный телефон</td>
                            <td> 
                                {org?.telefon}
                            </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <UserAsk idorg={idorg}/>
            </Row>
            <Row>
                <UserSpecOfferTable id={idorg}/>
            </Row>
            <Row>
                <UserPrice idorg={idorg} idprod={idprod}/>
            </Row>
            <Row>
                <ReviewOrgItems id={idorg}/>
            </Row>
            <ModalCT 
                header="Сообщение" 
                active={modalActiveMessage}
                component={<MessageBox author={org} setActive={setModalActiveMessage}/>}
                setActive={setModalActiveMessage}   
            />
            </Container>
    );
};

export default OrgInfo;