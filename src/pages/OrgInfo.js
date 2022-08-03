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

const OrgInfo = () => {
    const {id} = useParams();
    const [org, setOrg] = useState();
    const [modalActiveMessage,setModalActiveMessage] = useState(false)

    useEffect(() => {
        fetchUser(id).then((data)=>{
            setOrg(data)
        })

    },[]);

    return (
        <div>
            <div>
            <Container style={{width: "80%"}}>
            <Row>
                <Col>
                <Form>
                     <Table >
                        <tbody>
                            <tr>
                            <td>Имя</td>
                            <td>{org?.name}
                            <Button style={{fontSize:"13px",padding:"2px"}} 
                                    onClick={()=>setModalActiveMessage(true)}>
                                    Написать сообщение
                            </Button>
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
                <UserAsk id={id}/>
            </Row>
            <Row>
                <UserSpecOfferTable id={id}/>
            </Row>
                <UserPrice id={id}/>
            </Row>
            <Row>
                <Card>
                    <Card.Header style={{"background":"#282C34", "color":"white"}}>Вопрос-ответ</Card.Header>
                    <ReviewOrgItems id={id}/>
            </Card>
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