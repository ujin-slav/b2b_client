import {React, useEffect,useContext,useState} from 'react';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import ModalCT from '../components/ModalCT';
import {getCategoryName} from '../utils/Convert'
import { regionNodes } from '../config/Region';
import { categoryNodes } from '../config/Category';

const Profile =  observer(() => {

    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);
    const[profile,setProfile] = useState( {
        data: {
            id:null,
            name: null,
            nameOrg:  null,
            adressOrg: null,
            telefon: null,
            inn: null,
            fiz: null,
            region: null,
            category: null
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

    useEffect(() => {
        if(user.user.category){
            setCheckedCat(Object.values(user.user.category))
        }
        if(user.user.region){
            setCheckedRegion(Object.values(user.user.region))
        }
      },[user.user]);

    const [modalActiveReg,setModalActiveReg] = useState(false)
    const [modalActiveCat,setModalActiveCat] = useState(false)
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [expandedRegion,setExpandedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const [expandedCat,setExpandedCat] = useState([]);
    
    const handleChange = (e) =>{
        const { name, value } = e.target;
        let formErrors = profile.formErrors;
        let data = profile.data
        data[name] = value;
        setProfile({ data, formErrors});
    }

    const onSubmit = async (e)=>{
        e.preventDefault();
        let formErrors = profile.formErrors;
        let data = profile.data
        
        for (var key in data) {
            data[key] === null && (data[key] = user.user[key]);
        }
        data["category"] = JSON.stringify(checkedCat);
        data["region"] = JSON.stringify(checkedRegion);
        setProfile({ data, formErrors});
        console.log(data)
        const result = await user.changeuser(profile);
        if (result.status===200){
            myalert.setMessage("Данные успешно сохранены"); 
        } else {
            myalert.setMessage(result.data.message);
        }
    }
    
    return (
        <div>
            <Container style={{width: "70%"}}>
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
                            <tr>
                            <td>Категории</td>
                            <td>
                            <Card body>{getCategoryName(checkedCat, categoryNodes).join(", ")}</Card>
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveCat(true)}>
                                Выбор
                                </Button></td>
                            </tr>
                            <tr>
                            <td>Регионы</td>
                            <td>
                            <Card body>{getCategoryName(checkedRegion, regionNodes).join(", ")}</Card>
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveReg(true)}>
                                Выбор
                                </Button></td>
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
        <ModalCT 
                header="Регионы" 
                active={modalActiveReg} 
                setActive={setModalActiveReg} 
                component={<RegionTree 
                checked={checkedRegion} expanded={expandedRegion} 
                setChecked={setCheckedRegion} setExpanded={setExpandedRegion}
                />}/>
           <ModalCT 
                header="Категории" 
                active={modalActiveCat} 
                setActive={setModalActiveCat} 
                component={<CategoryTree 
                checked={checkedCat} expanded={expandedCat} 
                setChecked={setCheckedCat} setExpanded={setExpandedCat}
          />}/>       
        </div>
    );
});

export default Profile;