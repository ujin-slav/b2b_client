import {React, useEffect,useContext,useState} from 'react';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Profile =  observer(() => {

    const {user} = useContext(Context);  
    const[profile,setProfile] = useState( {
        data: {
            id:null,
            name: null,
            nameOrg:  null,
            adressOrg: null,
            telefon: null,
            inn: null,
            fiz: null
          },
          formErrors: {
            name: "",
            nameOrg: "",
            adressOrg: "",
            telefon: "",
            Inn: "",
            fiz: ""
          }
      }
    );

    
    const handleChange = (e) =>{
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = profile.formErrors;
        let data = profile.data
        data[name] = value;
        console.log(e.target)
        setProfile({ data, formErrors});
    }

    const onSubmit = async (e)=>{
        e.preventDefault();
        let formErrors = profile.formErrors;
        let data = profile.data
        
        for (var key in data) {
            data[key] === null && (data[key] = user.user[key]);
        }
        setProfile({ data, formErrors});
        const result = await user.changeuser(profile);
    }
    
    return (
        <div>
            <Container>
            <Row>
                <Col>
                <Form onSubmit={onSubmit}>
                     <h3>Профаил</h3>
                     <Table striped bordered hover size="sm">
                        <tbody>
                            <tr>
                            <td>Имя</td>
                            <td><Form.Control
                                    name="name"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.name}
                                />  </td>
                            </tr>
                            <tr>
                            <td>Физическое лицо</td>
                            <td><Form.Check
                                    name="fiz"
                                    type="checkbox"
                                    onChange={handleChange}
                                    defaultValue={user.user.fiz}
                                />  </td>
                            </tr>
                            <tr>
                            <td>Название организации</td>
                            <td> <Form.Control
                                    name="nameOrg"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.nameOrg}
                                />  </td>
                            </tr>
                            <tr>
                            <td>Адрес организации</td>
                            <td> <Form.Control
                                    name="adressOrg"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.adressOrg}
                                /></td>
                            </tr>
                            <tr>
                            <td>ИНН</td>
                            <td> <Form.Control
                                    name="inn"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.inn}
                                /></td>
                            </tr>
                            <tr>
                            <td>Контактный телефон</td>
                            <td> 
                                <Form.Control
                                    name="telefon"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.telefon}
                                />  
                            </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button
                        variant="primary"
                        type="submit"
                        className="btn btn-success ml-auto mr-1"
                        >
                        Сохранить
                    </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        </div>
    );
});

export default Profile;