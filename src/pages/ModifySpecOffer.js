
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
import {useParams} from 'react-router-dom';
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

function blobCreationFromURL(inputURI) {
  
  var binaryVal;

  // mime extension extraction
  var inputMIME = inputURI.split(',')[0].split(':')[1].split(';')[0];

  // Extract remaining part of URL and convert it to binary value
  if (inputURI.split(',')[0].indexOf('base64') >= 0)
      binaryVal = atob(inputURI.split(',')[1]);

  // Decoding of base64 encoded string
  else
      binaryVal = unescape(inputURI.split(',')[1]);

  // Computation of new string in which hexadecimal
  // escape sequences are replaced by the character 
  // it represents

  // Store the bytes of the string to a typed array
  var blobArray = [];
  for (var index = 0; index < binaryVal.length; index++) {
      blobArray.push(binaryVal.charCodeAt(index));
  }

  return new Blob([blobArray], {
      type: inputMIME
  });
}


const ModifySpecOffer = observer(() => {
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
    const {id} = useParams();

    const[specOffer,setSpecOffer] = useState( {
      data: {},
      formErrors: {
        Price: "",
        Name: "",
        Text: "",
      }
    }
    );

    useEffect(() => {
        SpecOfferService.getSpecOfferId({id}).then((result)=>{
            let formErrors = specOffer.formErrors;
            let data = Object.assign(specOffer.data, result);
            setCheckedRegion(result.Region);
            setSpecOffer({ data, formErrors}); 
            result?.Files?.map((item)=>{
              fetch(process.env.REACT_APP_API_URL + `getpic/` + item.filename)
              .then(res => res.blob()) // Gets the response and returns it as a blob
              .then(blob => {
                setSortedList(((oldItems) => [...oldItems,blob]))
            });
            })
          })
    },[])

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
      const newFiles = files.filter((item,index,array)=>item.id!==id);
      setFiles(newFiles);

      console.log(id)
    }
    
    const onInputChange = (e) => {
      if(files.length+e.target.files.length<6){
        for(let i = 0; i < e.target.files.length; i++) { 
          try{
            if(fileSize + e.target.files[i].size < 5242880){
              let file = e.target.files[i]
              setSortedList(((oldItems) => [...oldItems,file]))
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
    
    const getImageURL = (id) => {
      let file = files.find(item=>item.id===id)
      if(file){
        return URL.createObjectURL(file)
      }else{
        return URL.createObjectURL(id) 
      }
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
                    className="foto"  src={getImageURL(sortedList[i])} /> 
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

    const blobToFile=(item)=>{
      return new File([item],"load",{type:item.type})
    }

    const onSubmit = async(e) => {
      e.preventDefault();
      if(captcha){
        if (formValid(specOffer)) {
          const data = new FormData();
          sortedList.forEach((item)=>{
                  data.append(
                    "file", 
                    blobToFile(item)
                  )
                });
          data.append("ID", id)
          data.append("Author", user.user.id)
          data.append("Name", specOffer.data.Name)
          data.append("Telefon", specOffer.data.Telefon)
          data.append("Contact", specOffer.data.Contact)
          data.append("EndDateOffers", specOffer.data.EndDateOffers)
          data.append("Text", specOffer.data.Text)
          data.append("Price", specOffer.data.Price)
          data.append("Code", specOffer.data.Code)
          data.append("Balance", specOffer.data.Balance)
          data.append("Category", JSON.stringify(checkedCat))
          data.append("Region", JSON.stringify(checkedRegion))
          const result = await SpecOfferService.modifySpecOffer(data)
          console.log(result)
          if (result.status===200){
            myalert.setMessage("Предложение успешно изменено");
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
          <h3>Редактировать спец. предложение</h3> 
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
                                  defaultValue={specOffer.data.Name}
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
                                  defaultValue={specOffer.data.Price}
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
                            <td>Артикул</td>
                            <td> <Form.Control
                                name="Code"
                                onChange={handleChangeControl}
                                placeholder="не обязательно"
                            /></td>
                            </tr>
                            <tr>
                            <td>Остаток</td>
                            <td> <Form.Control
                                name="Balance"
                                onChange={handleChangeControl}
                                placeholder="не обязательно"
                            /></td>
                            </tr>
                            <tr>
                            <td>Текст</td>
                            <td><Form.Control
                                  name="Text"
                                  defaultValue={specOffer.data.Text}
                                  onChange={handleChangeControl}
                                  as="textarea"
                              />
                               <span className="errorMessage" style={{color:"red"}}>{specOffer.formErrors.Text}</span>
                            </td>
                            </tr>
                            <tr>
                            <td>Контактное лицо</td>
                            <td> <Form.Control
                                name="Telefon"
                                onChange={handleChangeControl}
                                defaultValue={user.user.name}
                                placeholder="Контактный телефон"
                            /></td>
                            </tr>
                            <tr>
                            <td>Контактный телефон</td>
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
            Сохранить
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

export default ModifySpecOffer;