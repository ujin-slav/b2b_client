import {React, useEffect,useContext} from 'react';
import {Card, Table, Col, Container, Row, Lable} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Profile =  observer(() => {

    const {user} = useContext(Context);  
    
    return (
        <div>
            <Container>
            <Row>
                <Col>
                     <h3>Профаил</h3>
                     <Table striped bordered hover size="sm">
                        <tbody>
                            <tr>
                            <td>Имя</td>
                            <td>{user.isAuth?
                                <div>{user.user.email}</div>
                            :
                                <div>2</div>}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <h3>Мои заявки</h3>
                    <Table striped bordered hover size="sm">
                        <tbody>
                            <tr>
                            <td>Имя</td>
                            <td></td>
                            </tr>
                        </tbody>
                    </Table>
                    <h3>Мои предложения</h3>
                    <Table striped bordered hover size="sm">
                        <tbody>
                            <tr>
                            <td>Имя</td>
                            <td></td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
            
        </div>
    );
});

export default Profile;