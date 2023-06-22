import React,{useState,useRef,useContext,useEffect} from 'react';
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru"
import RegInput from "../components/RegInput";
import {useHistory} from 'react-router-dom';
import {
    Container,
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
import {useParams} from 'react-router-dom';
import { fetchUser} from '../http/askAPI';
import dateFormat, { masks } from "dateformat";

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


const CreateAsk = observer(() => {
    var curr = new Date();
    var date = curr.setDate(curr.getDate() + 3);
    registerLocale("ru", ru)

    const {id} = useParams();
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
    const [startDate, setStartDate] = useState(date);
    const [fileSize, setFileSize] = useState(0);
    const {myalert} = useContext(Context);
    const history = useHistory();
    const {chat} =  useContext(Context)
    const inputName = useRef(null);

    const[ask,setAsk] = useState( {
      data: {
        Author: "",
        Name: "",
        MaxPrice: "",
        Telefon: "",
        EndDateOffers: startDate,
        Text: null,
        Category: "",
        Region: "",
        Private:false,
        Send:false,
        Hiden:false,
        Comment:"",
        Party:""
      },
      formErrors: {
        Name: "",
        Text: "не заполнено",
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
      if(id){
        fetchUser(id).then((data)=>{
            let tempArray = []
            tempArray.push( 
              {
                idContr: data?._id,
                name: data?.name,
                nameOrg: data?.nameOrg
              }
            )
            document.getElementById("Private").checked = true
            ask.data.Private=!ask.data.Private
            setCheckedEmail(tempArray)
        })
      }
    },[user.user])

    const onSubmit = async(e) => {
      e.preventDefault();
      if(captcha){
        if (formValid(ask)) {
          const data = new FormData();
          files.forEach((item)=>data.append("file", item));
          data.append("Author", user.user.id)
          data.append("Name", ask.data.Name || inputName.current.value)
          data.append("MaxPrice", ask.data.MaxPrice)
          data.append("Telefon", ask.data.Telefon || user.user.telefon)
          data.append("EndDateOffers", ask.data.EndDateOffers)
          data.append("Text", ask.data.Text)
          data.append("Category", JSON.stringify(checkedCat))
          data.append("Region", JSON.stringify(checkedRegion))
          data.append("Date", new Date())
          data.append("Private", checkedEmail.length>0)
          data.append("Hiden", ask.data.Hiden)
          data.append("Comment", ask.data.Comment)
          data.append("Send", ask.data.Send)
          data.append("Party", JSON.stringify(checkedEmail))
          const result = await upload(data)
          if(result.ask){
            myalert.setMessage("Заявка успешно добавлена");
            if(checkedEmail.length>0){
                chat.socket.emit("unread_invited", checkedEmail);
                console.log(checkedEmail)
            }
            history.push(B2B_ROUTE)
          } else if(result.errors){
            myalert.setMessage(result.message);
          }
        } else {
          console.error("FORM INVALID");
          //myalert.setMessage("Не заполнено поле текст заявки");
        }
      }else{
        console.error("FORM INVALID");
        myalert.setMessage("Неверно введены данные с картинки(CAPTCHA)");
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
      setFileSize(fileSize - files[id].size)
      const newFiles = files.filter((item,index,array)=>index!==id);
      setFiles(newFiles);
    }
    const handleChangeCaptcha = (value) => {
      if(value){
        setCaptcha(true)
    }
  }

    return (
        <div>
          <Container>
          <Form onSubmit={onSubmit}>
          <Table>
            <col style={{"width":"15%"}}/>
          	<col style={{"width":"85%"}}/>
                        <tbody>
                            <tr>
                            <td>Название заявки</td>
                            <td><Form.Control
                                  type="text"
                                  name="Name"
                                  onChange={handleChange}
                                  ref={inputName}
                                  defaultValue={'Заявка №' + dateFormat(new Date(), "ddmmyyyyHHMMss")}
                                  placeholder="Название заявки"
                              />
                              <span className="errorMessage" style={{color:"red"}}>{ask.formErrors.Name}</span></td>
                            </tr>
                            <tr>
                            <td>Дата окончания предложений</td>
                            <td>
                               <DatePicker
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
                              <Form.Control
                                  name="Party"
                                  defaultValue={checkedEmail.map((item)=>
                                    "(" + item.name + ") " + item.nameOrg
                                    )}
                                  placeholder="Участники"
                                  onChange={handleChange}
                                  disabled={true}
                              />
                               <Button variant="outline-secondary" id="button-addon2" onClick={()=>!id && setModalActiveMember(true)}>
                                Выбор
                              </Button>
                              <InputGroup>
                                <Form.Check
                                      id="Private"
                                      name="Private"
                                      type="checkbox"
                                      onChange={()=>{ask.data.Private=!ask.data.Private}}>
                                </Form.Check>
                                Ограничить выбранными участниками.                    
                              </InputGroup>
                              {/* <InputGroup>
                              <Form.Check
                                    id="Send"
                                    name="Send"
                                    type="checkbox"
                                    onChange={()=>{ask.data.Send=!ask.data.Send}}>
                              </Form.Check>
                                Разослать приглашение на участие.
                              </InputGroup> */}
                              <InputGroup>
                              <Form.Check
                                    id="Hiden"
                                    name="Hiden"
                                    type="checkbox"
                                    onChange={()=>{ask.data.Hiden=!ask.data.Hiden}}>
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
                                defaultValue={user.user.telefon}
                                placeholder="Контактные данные"
                            /></td>
                            </tr>
                            <tr>
                            <td>Категории</td>
                            <td>
                            <Card body>
                              {getCategoryName(checkedCat, categoryNodes).join(", ")}
                            </Card>
                            <Button 
                                variant="outline-secondary" 
                                id="button-addon2" 
                                onClick={()=>setModalActiveCat(true)
                            }>
                                Выбор
                            </Button></td>
                            </tr>
                            <tr>
                              <td>Регионы</td>
                              <td>
                              <Card body>
                                {getCategoryName(checkedRegion, regionNodes).join(", ")}
                              </Card>
                              <Button 
                                variant="outline-secondary"
                                id="button-addon2" 
                                onClick={()=>setModalActiveReg(true)
                              }>
                                  Выбор
                              </Button>
                              </td>
                            </tr>
                            <tr>
                            <td>Файлы(будут храниться не более 30 дней, не более 5 файлов по 5Mb)</td>
                            <td>
                            <input type="file"
                                onChange={onInputChange}
                                className="form-control"
                                multiple/> {files.map((a,key)=><div key={key}>{a.name}
                                <button onClick={()=>removeFile(key)}>X</button>
                              </div>
                              )}   </td>
                            </tr>
                            <tr>
                            <td>Комментарий</td>
                            <td>
                            <div style={{"color":"blue"}}>
                              Комментарий будет виден только вам, в разделе мои закупки,
                               в нем например вы можете указать с какой целью производится закупка. 
                              </div>
                              <Form.Control
                                  name="Comment"
                                  onChange={handleChange}
                                  placeholder="Комментарий"
                                  as="textarea"
                              />
                            </td>
                            </tr>
                            
                        </tbody>
           </Table>   
           <Captcha onChange={handleChangeCaptcha} placeholder="Введите символы"/>                
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
          </Form>
          </Container>
        </div>
    );
});

export default CreateAsk;