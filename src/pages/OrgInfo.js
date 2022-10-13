import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {fetchUser} from '../http/askAPI';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import PriceService from '../services/PriceService'
import dateFormat, { masks } from "dateformat";
import ModalCT from '../components/ModalCT';
import MessageBox from '../components/MessageBox'
import {CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
import UserSpecOfferTable from "../components/UserSpecOfferTable";
import Prices from "../components/Price";
import UserAsk from "../components/UserAsk";
import UserPrice from '../components/UserPrice';
import ReviewOrgItems from '../components/ReviewOrgItems';
import '../fontawesome.min.css';
import { CREATEASK } from '../utils/routes';
import {useHistory} from 'react-router-dom'

const OrgInfo = () => {

    const {idorg,idprod} = useParams();
    const [org, setOrg] = useState();
    const [file, setFile] = useState([])
    const [modalActiveMessage,setModalActiveMessage] = useState(false)
    const history = useHistory()

    useEffect(() => {
        fetchUser(idorg).then((data)=>{
            setOrg(data)
            if(data.logo){
                fetch(process.env.REACT_APP_API_URL + `getlogo/` + data.logo?.filename)
                .then(res => res.blob())
                .then(blob => {
                  setFile(blob)
                })
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

    return (
        <div>
            <div>
            <Container style={{widorgth: "80%"}}>
            <Row>
                <Col>
                <Form>
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
                            <tr>
                            <td></td>
                            <td>
                            <button className="myButtonMessage"
                                    onClick={()=>setModalActiveMessage(true)}>
                                    <div>
                                    Написать сообщение
                                    </div>
                            </button>
                            <i className="fa fa-solidorg fa-paper-plane colorBlue"/>
                            <button className="myButtonMessage"
                                    onClick={()=>history.push(CREATEASK + '/' + idorg)}>
                                    <div>
                                    Отправить персональную заявку
                                    </div>
                            </button>
                            <i className="fa fa-solidorg fa-envelope-o colorBlue"/>
                            </td>
                            </tr>
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
                    </Form>
                </Col>
            </Row>
            <Row>
            <Row>
                <UserAsk idorg={idorg}/>
            </Row>
            <Row>
                <UserSpecOfferTable idorg={idorg}/>
            </Row>
                <UserPrice idorg={idorg} idprod={idprod}/>
            </Row>
            <Row>
                <ReviewOrgItems idorg={idorg}/>
            </Row>
        </Container>
        </div>
        <ModalCT 
                  header="Сообщение" 
                  active={modalActiveMessage}
                  component={<MessageBox author={org} setActive={setModalActiveMessage}/>}
                  setActive={setModalActiveMessage}   
        />
        </div>
    );
};

export default OrgInfo;