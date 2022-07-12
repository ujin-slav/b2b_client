
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
import SpecOfferService from '../services/SpecOfferService'
import {Context} from "../index";
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import {observer} from "mobx-react-lite";
import Captcha from "demos-react-captcha";
import "../style.css";
import {B2B_ROUTE} from "../utils/routes";
import { XCircle} from 'react-bootstrap-icons';

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


const CreateSpecOffer = observer(() => {
    var curr = new Date();
    var date = curr.setDate(curr.getDate() + 30);
    registerLocale("ru", ru)

    const {user} = useContext(Context);  
    const [captcha, setCaptcha] = useState(false);
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState(date);
    const [files, setFiles] = useState([])
    const [modalActiveReg,setModalActiveReg] = useState(false)
    const [modalActiveCat,setModalActiveCat] = useState(false)
    const [modalActiveMember,setModalActiveMember] = useState(false)
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [expandedRegion,setExpandedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const [expandedCat,setExpandedCat] = useState([]);
    const [checkedEmail,setCheckedEmail] =  useState([]);
    const [fileSize, setFileSize] = useState(0);
    const {myalert} = useContext(Context);
    const history = useHistory();
    let sourceElement = null
    const [sortedList, setSortedList] = useState([])

    const[specOffer,setSpecOffer] = useState( {
      data: {
        Author: "",
        Name: null,
        EndDateOffers: startDate,
        Telefon:"",
        Text: null,
        Price: null,
        Category: "",
        Region: "",
      },
      formErrors: {
        Price: "",
        Name: "",
        Text: "",
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
    },[user.user])

    const handleDragStart = (event) => {
      event.target.style.opacity = 0.5
      sourceElement = event.target
      event.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move' 
    }

    const handleDragEnter = (event) => {
      event.target.classList.add('over')    
    }
  
    const handleDragLeave = (event) => {
      event.target.classList.remove('over')
    }
  
    const handleDrop = (event) => {
      event.stopPropagation()
      if (sourceElement !== event.target) {
        const list = sortedList.filter((item, i) => 
          i.toString() !== sourceElement.id)
        const removed = sortedList.filter((item, i) => 
          i.toString() === sourceElement.id)[0]
        let insertAt = Number(event.target.id)
  
        let tempList = []

        if (insertAt >= list.length) {
          tempList = list.slice(0).concat(removed)
          setSortedList(tempList)
          event.target.classList.remove('over')
        } else
        if ((insertAt < list.length)) {
          tempList = list.slice(0,insertAt).concat(removed)

          const newList = tempList.concat(list.slice(
            insertAt))
  
          setSortedList(newList)
          event.target.classList.remove('over')
        }
      }else
      event.target.classList.remove('over') 
    }
  
    const handleDragEnd = (event) => {
      event.target.style.opacity = 1
    }
  
    const handleChange = (event) => {
      event.preventDefault()
      const list = sortedList.map((item, i) => {
        if (i !== Number(event.target.id)) { 
          return item }
        else return event.target.value   
      })
      setSortedList(list)
    }
    const handleDelete = (event,id) => {
      event.preventDefault()
      const list = sortedList.filter((item, i) => 
      i !== Number(event.target.id))
      setSortedList(list)

      URL.revokeObjectURL(files.find(item=>item.id===id))
      setFileSize(fileSize - files.find(item=>item.id===id).size)
      const newFiles = files.filter((item,index,array)=>item.id!==id);
      setFiles(newFiles);

      console.log(id)
    }
    
    const onInputChange = (e) => {
      if(files.length+e.target.files.length<6){
        for(let i = 0; i < e.target.files.length; i++) { 
          try{
            if(fileSize + e.target.files[i].size < 5242880){
              e.target.files[i].id = Date.now() + Math.random()
              setFileSize(fileSize + e.target.files[i].size)
              setSortedList(((oldItems) => [...oldItems, e.target.files[i].id]))
              setFiles(((oldItems) => [...oldItems, e.target.files[i]]))
              console.log(files)
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
    
    const removeFile = (file,id) => {
      URL.revokeObjectURL(file)
      setFileSize(fileSize - files[id].size)
      const newFiles = files.filter((item,index,array)=>index!==id);
      setFiles(newFiles);
    }

    const listItems = () => {

      return sortedList.map((item, i) => {
        return(
              <div key={i} className='dnd-list'>
                <div className='fotoContainer'>
                    <img 
                    id={i}
                    draggable='true' 
                    onDragStart={handleDragStart} 
                    onDragOver={handleDragOver} 
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    onChange={handleChange}
                    className="foto" src={URL.createObjectURL(files.find(item=>item.id===sortedList[i]))} /> 
                    <div id={i} className='delButton' onClick={(event)=>handleDelete(event,sortedList[i])}>X</div>
                </div>
              </div>
        )
      }
      )
    }
  
    const handleChangeControl = e => {
      e.preventDefault();
      const { name, value } = e.target;
      let formErrors = specOffer.formErrors;
      let data = specOffer.data
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
        case "Price":
          formErrors.Price =
            value <= 0 ? "Цена должна быть больше ноля" : "";
          break;
        default:
          break;
      }
      setSpecOffer({ data, formErrors});
    }

    const onSubmit = async(e) => {
      e.preventDefault();
      if(captcha){
        if (formValid(specOffer)) {
          const data = new FormData();
          sortedList.forEach((i)=>{
                  data.append(
                    "file", 
                    files.find(item=>item.id===i)
                  )
                });
          data.append("Author", user.user.id)
          data.append("Name", specOffer.data.Name)
          data.append("Telefon", specOffer.data.Telefon)
          data.append("EndDateOffers", specOffer.data.EndDateOffers)
          data.append("Text", specOffer.data.Text)
          data.append("Price", specOffer.data.Price)
          data.append("Category", JSON.stringify(checkedCat))
          data.append("Region", JSON.stringify(checkedRegion))
          const result = await SpecOfferService.addSpecOffer(data)
          console.log(result)
          if (result.status===200){
            myalert.setMessage("Предложение успешно добавлено");
            //history.push(B2B_ROUTE)
          } else {
            myalert.setMessage(result?.data?.message)
          }
        } else {
          console.error("FORM INVALID");
          myalert.setMessage("Не заполнено поле текст заявки");
        }
      }else{
        console.error("FORM INVALID");
        myalert.setMessage("Неверно введены данные с картинки(CAPTCHA)");
      }
    }

    const handleChangeCaptcha = (value) => {
      if(value){
        setCaptcha(true)
      }
    }

    return (
        <Container>
          <Form onSubmit={onSubmit}>
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
                                  onChange={handleChangeControl}
                                  placeholder="Название"
                              />
                              <span className="errorMessage" style={{color:"red"}}>{specOffer.formErrors.Name}</span></td>
                            </tr>
                            <tr>
                            <td>Цена</td>
                            <td><Form.Control
                                  type="number" 
                                  name="Price"
                                  step=".01"
                                  onChange={handleChangeControl}
                                  placeholder="Цена"
                              />
                              <span className="errorMessage" style={{color:"red"}}>{specOffer.formErrors.Price}</span></td>
                            </tr>
                            <tr>
                            <td>Дата окончания предложения</td>
                            <td>
                            <DatePicker
                                  locale="ru"
                                  selected={startDate}
                                  name="EndDateOffers"
                                  timeInputLabel="Время:"
                                  dateFormat="dd/MM/yyyy HH:mm"
                                  onChange={(date) => {setStartDate(date);specOffer.data.EndDateOffers=date}}
                                  showTimeInput
                                />
                            </td>
                            </tr>
                            <tr>
                            <td>Текст</td>
                            <td><Form.Control
                                  name="Text"
                                  placeholder="Текст заявки"
                                  onChange={handleChangeControl}
                                  as="textarea"
                              />
                               <span className="errorMessage" style={{color:"red"}}>{specOffer.formErrors.Text}</span>
                            </td>
                            </tr>
                            <tr>
                            <td>Контактные данные</td>
                            <td> <Form.Control
                                name="Telefon"
                                onChange={handleChangeControl}
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
                              Разместите фото в нужном порядке, первое станет заглавным.
                            <input type="file"
                                onChange={onInputChange}
                                className="form-control"
                                multiple/>
                                {listItems()}
                                </td>
                            </tr>
                            <tr>
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
});

export default CreateSpecOffer;