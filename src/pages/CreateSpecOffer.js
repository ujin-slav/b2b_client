
import React,{useState,useRef,useContext,useEffect} from 'react';
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru"
import RegInput from "../components/RegInput";
import {useHistory} from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    InputGroup,
    Card,
    Table,
  } from "react-bootstrap";
import {upload} from "../http/askAPI";
import ModalCT from '../components/ModalCT';
import EmailList from '../components/EmailList'
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import {Context} from "../index";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import {observer} from "mobx-react-lite";
import Captcha from "demos-react-captcha";
import "../style.css";
import {B2B_ROUTE} from "../utils/routes";

const CreateSpecOffer = () => {
    const {user} = useContext(Context);  
    const [captcha, setCaptcha] = useState(false);
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState([])
    const [modalActiveReg,setModalActiveReg] = useState(false)
    const [modalActiveCat,setModalActiveCat] = useState(false)
    const [modalActiveMember,setModalActiveMember] = useState(false)
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [expandedRegion,setExpandedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const [expandedCat,setExpandedCat] = useState([]);
    const [checkedEmail,setCheckedEmail] =  useState([]);


    return (
        <Container>
          <Form>
          <h3>Создать спец. предложение</h3> 
          <Table striped hover  className="createAsk">
            <col style={{"width":"15%"}}/>
          	<col style={{"width":"85%"}}/>
                        <tbody>
                            <tr>
                            <td>Название</td>
                            <td><Form.Control
                                  type="text"
                                  name="Name"
                                  placeholder="Название"
                              />
                              <span className="errorMessage" style={{color:"red"}}>{}</span></td>
                            </tr>
                            <tr>
                            <td>Дата окончания предложения</td>
                            <td>
                               <DatePicker
                                  locale="ru"
                                  name="EndDateOffers"
                                  timeInputLabel="Время:"
                                  dateFormat="dd/MM/yyyy HH:mm"
                                  showTimeInput
                                />
                            </td>
                            </tr>
                            <tr>
                            <td>Текст</td>
                            <td><Form.Control
                                  name="Text"
                                  placeholder="Текст заявки"
                                  as="textarea"
                              />
                              <span className="errorMessage" style={{color:"red"}}></span>
                            </td>
                            </tr>
                            <tr>
                            <td>Контактные данные</td>
                            <td> <Form.Control
                                name="Telefon"
                                defaultValue={user.user.telefon}
                                placeholder="Контактный телефон"
                            /></td>
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
                            <tr>
                            <td>Фото(будут храниться не более 30 дней, не более 5 файлов по 5Mb)</td>
                            <td>
                            <input type="file"
                                className="form-control"
                                multiple/> {files.map((a,key)=><div key={key}>{a.name}
                                <button>X</button>
                              </div>
                              )}   </td>
                            </tr>
                            <tr>
                            <td>Комментарий</td>
                            <td>
                            <div style={{"color":"blue"}}>
                              Комментарий будет виден только вам в разделе мои закупки,
                               в нем например вы можете указать с какой целью производится закупка. 
                              </div>
                              <Form.Control
                                  name="Comment"
                                  placeholder="Комментарий"
                                  as="textarea"
                              />
                            </td>
                            </tr>
                            
                        </tbody>
           </Table>   
           <Captcha placeholder="Введите символы"/>                
            <Button
            variant="primary"
            type="submit"
            className="btn btn-success ml-auto mr-1"
            >
            Создать
            </Button>
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
          <ModalCT 
                header="Участники" 
                active={modalActiveMember}  
                component={<EmailList checked={checkedEmail} setChecked={setCheckedEmail}/>}
                setActive={setModalActiveMember} 
          />
          </Form>
          </Container>
    );
};

export default CreateSpecOffer;