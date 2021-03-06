import {React, useEffect,useContext,useState} from 'react';
import {Card, Table, Col, Container, Row, Lable,Form,Button,InputGroup} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import ModalCT from '../components/ModalCT';
import {getCategoryName} from '../utils/Convert'
import { regionNodes } from '../config/Region';
import { categoryNodes } from '../config/Category';

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
            notiInvited:true,
            notiMessage:true,
            notiQuest:true
          },
          formErrors: {
            name: "",
            nameOrg: "",
            adressOrg: "",
            telefon: "",
            Inn: ""
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
        let data = profile.data
        let formErrors = profile.formErrors
        data.notiInvited = user.user.notiInvited
        data.notiMessage = user.user.notiMessage
        data.notiQuest = user.user.notiQuest
        setProfile({ data, formErrors});
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

        switch (name) {
            case "name":
              formErrors.name =
                value.length < 3 ? "?????????????? 3 ??????????????" : "";
              break;
            case "nameOrg":
              formErrors.nameOrg =
                value.length < 3 ? "?????????????? 3 ??????????????" : "";
              break;  
            case "inn":
              formErrors.inn =
                value.length < 8 ? "???????????????? ??????" : "";
              break;  
            case "adressOrg":
              formErrors.adressOrg =
                value.length < 3 ? "?????????????? 3 ??????????????" : "";
            break;   
            case "telefon":
              formErrors.telefon =
                value.length < 3 ? "?????????????? 3 ??????????????" : "";
            break;    
            default:
              break;
            }
        setProfile({ data, formErrors});
    }

    const onSubmit = async (e)=>{
        e.preventDefault();
        let formErrors = profile.formErrors;
        let data = profile.data
        
        for (var key in data) {
            data[key] === null && (data[key] = user.user[key]);
        }
        
        if (formValid(profile)) {
            data["category"] = JSON.stringify(checkedCat);
            data["region"] = JSON.stringify(checkedRegion);
            setProfile({ data, formErrors});
            const result = await user.changeuser(profile);
            if (result.status===200){
                myalert.setMessage("???????????? ?????????????? ??????????????????"); 
            } else {
                myalert.setMessage(result.data.message);
            }
        }else{
            myalert.setMessage("?????????? ?????????????????? ???? ??????????")
        }
    }

    const handleChecked = (e) =>{
        const { name, checked } = e.target;
        let data = profile.data
        let formErrors = profile.formErrors
        data[name] = checked
        setProfile({ data, formErrors});
    }
    
    return (
        <div>
            <Container style={{width: "70%"}} className="mx-auto my-4">
            <Row>
                <Col>
                <Form onSubmit={onSubmit}>
                     <Table>
                        <col style={{"width":"25%"}}/>
          	            <col style={{"width":"75%"}}/>
                        <tbody>
                            <tr>
                            <td>??????</td>
                            <td><Form.Control
                                    name="name"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.name}
                                /> 
                                <span className="errorMessage" style={{color:"red"}}>{profile.formErrors.name}</span></td>
                            </tr>
                            <tr>
                            <td>???????????????? ??????????????????????</td>
                            <td> <Form.Control
                                    name="nameOrg"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.nameOrg}
                                /> 
                                <span className="errorMessage" style={{color:"red"}}>{profile.formErrors.nameOrg}</span></td>
                            </tr>
                            <tr>
                            <td>?????????? ??????????????????????</td>
                            <td> <Form.Control
                                    name="adressOrg"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.adressOrg}
                                />
                                <span className="errorMessage" style={{color:"red"}}>{profile.formErrors.adressOrg}</span></td>
                            </tr>
                            <tr>
                            <td>??????</td>
                            <td> <Form.Control
                                    name="inn"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.inn}
                                />
                                <span className="errorMessage" style={{color:"red"}}>{profile.formErrors.inn}</span></td>
                            </tr>
                            <tr>
                            <td>???????????????????? ??????????????</td>
                            <td> 
                                <Form.Control
                                    name="telefon"
                                    type="text"
                                    onChange={handleChange}
                                    defaultValue={user.user.telefon}
                                />  
                                <span className="errorMessage" style={{color:"red"}}>{profile.formErrors.telefon}</span></td>
                            </tr>
                            <tr>
                            <td>??????????????????</td>
                            <td>
                            <Card body>{getCategoryName(checkedCat, categoryNodes).join(", ")}</Card>
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveCat(true)}>
                                ??????????
                                </Button></td>
                            </tr>
                            <tr>
                            <td>??????????????</td>
                            <td>
                            <Card body>{getCategoryName(checkedRegion, regionNodes).join(", ")}</Card>
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveReg(true)}>
                                ??????????
                                </Button></td>
                            </tr>
                            <tr>
                                <td>
                                    ???????????????? ?????????????????????? ???? email:             
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    ?????????? ?????????????????????? ???? ??????????????                
                                </td>
                                <td>
                                    <Form.Check
                                        name="notiInvited"
                                        type="checkbox"
                                        checked={profile.data.notiInvited}
                                        onChange={handleChecked}>
                                    </Form.Check>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    ?????????? ??????????????????                
                                </td>
                                <td>
                                    <Form.Check
                                        name="notiMessage"
                                        type="checkbox"
                                        checked={profile.data.notiMessage}
                                        onChange={handleChecked}>
                                    </Form.Check>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    ?????????? ??????????????                
                                </td>
                                <td>
                                    <Form.Check
                                        name="notiQuest"
                                        type="checkbox"
                                        checked={profile.data.notiQuest}
                                        onChange={handleChecked}>
                                    </Form.Check>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button
                        variant="primary"
                        type="submit"
                        className="btn btn-success ml-auto mr-1"
                        >
                        ??????????????????
                    </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        <ModalCT 
                header="??????????????" 
                active={modalActiveReg} 
                setActive={setModalActiveReg} 
                component={<RegionTree 
                checked={checkedRegion} expanded={expandedRegion} 
                setChecked={setCheckedRegion} setExpanded={setExpandedRegion}
                />}/>
           <ModalCT 
                header="??????????????????" 
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