import React,{useState,useRef,useContext,useEffect} from 'react';
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru"
import RegInput from "../components/RegInput";
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
import {modifyAsk} from "../http/askAPI";
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import ModalCT from '../components/ModalCT';
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import {Context} from "../index";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import AskService from '../services/AskService';
import ModalAlert from '../components/ModalAlert';
import EmailList from '../components/EmailList'
import {observer} from "mobx-react-lite";
import NoPermission from './NoPermission';
import {MYORDERS} from "../utils/routes";

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


const ModifyAsk = observer((askId) => {

  var curr = new Date();
    //curr.setDate(curr.getDate() + 3);
    //var date = curr.toISOString().substr(0,10);
    var date = curr.setDate(curr.getDate() + 3);
  registerLocale("ru", ru)

  const {user} = useContext(Context);  
  const {chat} =  useContext(Context)
  const [files, setFiles] = useState([])
  const [modalActiveReg,setModalActiveReg] = useState(false)
  const [modalActiveCat,setModalActiveCat] = useState(false)
  const [checkedRegion,setCheckedRegion] = useState([]);
  const [expandedRegion,setExpandedRegion] = useState([]);
  const [checkedCat,setCheckedCat] = useState([]);
  const [expandedCat,setExpandedCat] = useState([]);
  const [deletedFiles,setDeletedFiles] = useState([]);
  const {myalert} = useContext(Context);
  const [checkedEmail,setCheckedEmail] =  useState([]);
  const [startDate, setStartDate] = useState(date);
  const [fileSize, setFileSize] = useState(0);
  const [permission, setPermission] = useState(true);
  const [modalActiveMember,setModalActiveMember] = useState(false)
  const [error, setError] = useState();
  const history = useHistory();
  const {id} = useParams();

  const[ask,setAsk] = useState( {
    data: {},
    formErrors: {
      Name: "",
      Text: "",
    }
  }
  );

    useEffect(() => {
      AskService.fetchOneAsk(id).then((result)=>{
        if(result.status===200){
          let formErrors = ask.formErrors;
          let data = Object.assign(ask.data, result.data);
          setCheckedRegion(result.data.Region);
          setCheckedCat(result.data.Category);
          setAsk({ data, formErrors});  
          setFiles(result.data.Files);
          setCheckedEmail(result.data.Party)
          ask.data.MaxPrice=0
          if(ask?.data?.Author?._id!==user.user.id){
            setPermission(false)
          }
        }else{
          setError(result.data.errors)
        }
      })
    },[]);

    const onSubmit = async(e) => {
      e.preventDefault();
      if (formValid(ask)) {
        const data = new FormData();
        files.forEach((item)=>data.append("file", item));
        data.append("Id", id)
        data.append("Author", user.user.id)
        data.append("Name", ask.data.Name)
        data.append("MaxPrice", ask.data.MaxPrice)
        data.append("Telefon", ask.data.Telefon)
        data.append("EndDateOffers", ask.data.EndDateOffers)
        data.append("Text", ask.data.Text)
        data.append("Category", JSON.stringify(checkedCat))
        data.append("Region", JSON.stringify(checkedRegion))
        data.append("Date", new Date())
        data.append("Private", ask.data.Private)
        data.append("Hiden", ask.data.Hiden)
        data.append("Comment", ask.data.Comment)
        data.append("DeletedFiles", JSON.stringify(deletedFiles))
        data.append("Send", ask.data.Send)
        data.append("Party", JSON.stringify(checkedEmail))
        const result = await modifyAsk(data)
        if (result.ok===1){
          myalert.setMessage("Заявка успешно изменена"); 
          if(checkedEmail.length>0){
            chat.socket.emit("unread_invited", checkedEmail);
          }
          history.push(MYORDERS)
        } else {
          myalert.setMessage(result?.message);
        }
      } else {
        console.error("FORM INVALID");
      }
    };

    const handleChange = e => {
      e.preventDefault();
      const { name, value } = e.target;
      let formErrors = ask.formErrors;
      let data = ask.data
      data[name] = value;
      
      switch (name) {
        case "Name":
          formErrors.Name =
            value.length < 3 ? "минимум 3 символа" : "";
          break;   
        case "Text":
          formErrors.Text =
            value.length < 3 ? "минимум 3 символа" : "";
          break;
        default:
          break;
      }
      setAsk({ data, formErrors});
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
              myalert.setMessage("Превышен размер файлов");
            }  
          }catch(e){
            console.log(e)
          }
        }
      }else{
        myalert.setMessage("Превышено количество файлов");
      }
    };
    
    const removeFile = (id) => {
      setDeletedFiles(((oldItems) => [...oldItems,files[id]]));
      setFileSize(fileSize - files[id].size)
      const newFiles = files.filter((item,index,array)=>index!==id);
      setFiles(newFiles);
    }

    const handleChecked = (e) =>{
      const { name, checked } = e.target;
      let data = ask.data
      let formErrors = ask.formErrors
      data[name] = checked
      setAsk({ data, formErrors});
    }

    if(!permission){
      return(
        <NoPermission/>
      )
    }

    if(error){
      return(
          <div>
            <Container
                    className="d-flex justify-content-center align-items-center"
                    style={{height: window.innerHeight - 54}}
                    >
                <Card style={{width: 600}} className="p-5 ">
                    <h5>Заяка не существует, или удалена.</h5>
                </Card> 
            </Container>
          </div>
      )
    }

    return (
        <div>
          <Container>
          <Form onSubmit={onSubmit}>
          <Table>
                        <tbody>
                            <tr>
                            <td>Название заявки</td>
                            <td><Form.Control
                                  type="text"
                                  name="Name"
                                  defaultValue={ask.data.Name}
                                  onChange={handleChange}
                                  placeholder="Название заявки"
                              />
                              <span className="errorMessage" style={{color:"red"}}>{ask.formErrors.Name}</span></td>
                            </tr>
                            <tr>
                            <td>Дата окончания предложений</td>
                            <td><DatePicker
                                  locale="ru"
                                  selected={startDate}
                                  name="EndDateOffers"
                                  timeInputLabel="Время:"
                                  dateFormat="dd/MM/yyyy HH:mm"
                                  onChange={(date) => {setStartDate(date);ask.data.EndDateOffers=date}}
                                  showTimeInput
                                />
                            </td>
                            </tr>
                            <tr>
                            <td>Участники торгов</td>
                            <td>
                              <div style={{"text-indent": "30px", "color":"blue"}}> 
                              В данном поле вы можете указать кому из ваших контрагентов придет уведомление на участие в торгах. Также вы можете 
                              жестко ограничить участников для того чтобы другие организации не имели возможность делать ценовые предложения.
                              </div>
                              <div style={{"text-indent": "30px"}}>
                                Чтобы пригласить на участие, можно скопировать ссылку из раздела мои заявки.
                                </div>  
                                <Form.Control
                                  name="Party"
                                  defaultValue={checkedEmail.map((item)=>
                                    "(" + item.name + ") " + item.nameOrg
                                    )}
                                  placeholder="Участники"
                                  onChange={handleChange}
                                  disabled={true}
                              />
                               <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveMember(true)}>
                                Выбор
                              </Button>
                              <InputGroup>
                                <Form.Check
                                      name="Private"
                                      type="checkbox"
                                      checked={ask.data.Private}
                                      onChange={handleChecked}>
                                </Form.Check>
                                Ограничить выбранными участниками.                    
                              </InputGroup>
                              <InputGroup>
                              <Form.Check
                                    name="Hiden"
                                    type="checkbox"
                                    checked={ask.data.Hiden}
                                    onChange={handleChecked}>
                              </Form.Check>
                                Скрыть возможность участников видеть предложения друг друга. 
                              </InputGroup>
                            </td>                      
                            </tr>
                            <tr>
                            <td>Текст заявки</td>
                            <td><Form.Control
                                  name="Text"
                                  onChange={handleChange}
                                  defaultValue={ask.data.Text}
                                  placeholder="Текст заявки"
                                  as="textarea"
                              />
                              <span className="errorMessage" style={{color:"red"}}>{ask.formErrors.Text}</span>
                            </td>
                            </tr>
                            <tr>
                            <td>Контактные данные</td>
                            <td> <Form.Control
                                name="Telefon"
                                onChange={handleChange}
                                defaultValue={ask.data.Telefon}
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
                            <td>Файлы(будут храниться не более 30 дней)</td>
                            <td>
                            <input type="file"
                                onChange={onInputChange}
                                className="form-control"
                                multiple/> {files.map((a,key)=><div key={key}>{a.name||a.originalname}
                                <button onClick={()=>removeFile(key)}>X</button>
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
                                  onChange={handleChange}
                                  defaultValue={ask.data.Comment}
                                  placeholder="Комментарий"
                                  as="textarea"
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
            <ModalCT 
                    header="Регионы" 
                    active={modalActiveReg} 
                    setActive={setModalActiveReg}
                    text={
                      <div className='mx-3 pb-2 text-warning'>
                        Не более 3
                      </div>
                    } 
                    component={<RegionTree 
                    checked={checkedRegion} expanded={expandedRegion} max={3} 
                    setChecked={setCheckedRegion} setExpanded={setExpandedRegion}
                    />}/>
            <ModalCT 
                header="Категории" 
                active={modalActiveCat} 
                setActive={setModalActiveCat} 
                text={
                  <div className='mx-3 pb-2 text-warning'>
                    Не более 3
                  </div>
                }
                component={<CategoryTree 
                checked={checkedCat} expanded={expandedCat} max={3} 
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
        </div>
    );
});

export default ModifyAsk;