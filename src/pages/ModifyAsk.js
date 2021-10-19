import React,{useState,useRef,useContext,useEffect} from 'react';
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


const ModifyAsk = (askId) => {
    const[ask,setAsk] = useState( {
        data: {
          Author: "",
          Name: "",
          Telefon: "",
          EndDateOffers: "",
          Comment: "",
          Text: null,
          Category: "",
          Region: "",
        },
        formErrors: {
          Name: "",
          Text: "",
        }
      }
    );
    const {user} = useContext(Context);  
    const [files, setFiles] = useState([])
    const [modalActiveReg,setModalActiveReg] = useState(false)
    const [modalActiveCat,setModalActiveCat] = useState(false)
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [expandedRegion,setExpandedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const [expandedCat,setExpandedCat] = useState([]);
    const [deletedFiles,setDeletedFiles] = useState([]);
    const {myalert} = useContext(Context);
    const {id} = useParams();

    useEffect(() => {
      AskService.fetchOneAsk(id).then((result)=>{
        let formErrors = ask.formErrors;
        let data = Object.assign(ask.data, result);
        setCheckedRegion(result.Region);
        setCheckedCat(result.Category);
        setAsk({ data, formErrors});  
        setFiles(result.Files);
      })
    },[]);

    const onSubmit = async(e) => {
      e.preventDefault();
      if (1===1) {
        const data = new FormData();
        files.forEach((item)=>data.append("file", item));
        data.append("id", id)
        data.append("Author", user.user.id)
        data.append("Name", ask.data.Name)
        data.append("Telefon", ask.data.Telefon)
        data.append("EndDateOffers", ask.data.EndDateOffers)
        data.append("Text", ask.data.Text)
        data.append("Category", JSON.stringify(checkedCat))
        data.append("Region", JSON.stringify(checkedRegion))
        data.append("DeletedFiles", JSON.stringify(deletedFiles))
        data.append("Date", new Date())
        const result = await modifyAsk(data)
        //window.location.reload();
        console.log(result);
        if(result.ok===1){
          myalert.setMessage("Заявка успешно изменена");
        } else if(!result.errors){
          myalert.setMessage(result.errors?.message);
        }
      } else {
        console.error("FORM INVALID");
        myalert.setMessage("Не заполнено поле текст заявки");
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
      for(let i = 0; i < e.target.files.length; i++) { 
        try{
        setFiles(((oldItems) => [...oldItems, e.target.files[i]]));
        }catch(e){
          console.log(e)
        }
      }
    };
    
    const removeFile = (id) => {
      setDeletedFiles(((oldItems) => [...oldItems,files[id]]));
      const newFiles = files.filter((item,index,array)=>index!==id);
      setFiles(newFiles);
    }

    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substr(0,10);

    return (
        <div>
          <Container>
          <Form onSubmit={onSubmit}>
          <h3>Редактировать заявку</h3> 
          <Table striped bordered hover size="sm">
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
                            <td><Form.Control
                                  type="date"
                                  name="EndDateOffers"
                                  defaultValue={ask.data.EndDateOffers}
                                  onChange={handleChange}
                                  placeholder="Дата окончания предложений"
                              />
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
                            <Card body>{getCategoryName(checkedCat, categoryNodes)}</Card>
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveCat(true)}>
                                Выбор
                                </Button></td>
                            </tr>
                            <tr>
                            <td>Регионы</td>
                            <td>
                            <Card body>{getCategoryName(checkedRegion, regionNodes)}</Card>
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
                            
                        </tbody>
           </Table>                   
            <Button
            variant="primary"
            type="submit"
            className="btn btn-success ml-auto mr-1"
            >
            Отправить
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
          </Form>
        </Container>
        </div>
    );
};

export default ModifyAsk;