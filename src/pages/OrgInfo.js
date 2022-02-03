import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {fetchUser} from '../http/askAPI';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";

const OrgInfo = () => {
    const {id} = useParams();
    const [org, setOrg] = useState();

    useEffect(() => {
        fetchUser(id).then((data)=>{
            setOrg(data)
            console.log(data)
        })

      },[]);

    return (
        <div>
            <div>
            <Container style={{width: "70%"}}>
            <Row>
                <Col>
                <Form>
                     <h3>Реквизиты организации</h3>
                     <Table striped bordered hover size="sm">
                        <tbody>
                            <tr>
                            <td>Имя</td>
                            <td>{org?.name}</td>
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
        </Container>
        </div>
        </div>
    );
};

export default OrgInfo;