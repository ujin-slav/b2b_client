import React, { useContext, useState, useRef, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Table,
    Card,
    ProgressBar
} from "react-bootstrap";
import { uploadPrice } from '../http/askAPI';
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import ModalCT from '../components/ModalCT';
import { regionNodes } from '../config/Region';
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import * as XLSX from 'xlsx';
import PriceService from '../services/PriceService'
import ModalAlert from '../components/ModalAlert';
import { PlusCircleFill, PencilSquare, FileEarmarkX} from 'react-bootstrap-icons';
import {generateUUID} from '../utils/getUID'

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

const CreatePrice = observer(() => {

    const { myalert } = useContext(Context);
    const [modalActive, setModalActive] = useState(false);
    const [file, setFile] = useState([])
    const { user } = useContext(Context);
    const [fetch, setFetch] = useState(false);
    const [price, setPrice] = useState([]);
    const[searchResult, setSearchResult] = useState([]);
    const[search,setSearch] = useState("");
    const [priceForm, setPriceForm] = useState({
        data: {
          Author: "",
          Name: null,
          Desciption: "",
          Category: "",
          Region: "",
        },
        formErrors: {
          Name: "не заполнено"
        }
    });
    const [fetching, setFetching] = useState(true);
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const [modalActiveReg,setModalActiveReg] = useState(false)
    const [modalActiveCat,setModalActiveCat] = useState(false)
    const [help, setHelp] = useState(false);
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [expandedRegion,setExpandedRegion] = useState([]);
    const [expandedCat,setExpandedCat] = useState([]);
    const input = useRef(null);

    const onInputChange = (e) => {
        try {
            if (e.target.files[0].size < 5242880) {
                setFile(e.target.files[0])
                const reader = new FileReader();
                const rABS = !!reader.readAsBinaryString;
                reader.onload = e => {
                    /* Parse data */
                    const bstr = e.target.result;
                    const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
                    /* Get first worksheet */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    /* Convert array of arrays */
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: true, defval: '', });
                    /* Update state */
                    if(Array.isArray(data)){
                        let newData = data.map((item,index)=>{
                            let newItem = {}
                            newItem._id = generateUUID()
                            newItem.editing = false
                            newItem.show = true
                            newItem.Code = item[0]
                            newItem.Name = item[1]
                            newItem.Price = item[2]
                            newItem.Balance = item[3]
                            newItem.Measure = item[4]
                            return newItem
                        })
                        setPrice(newData);
                        console.log(newData)
                    }
                    input.current.value = null
                };
                if (rABS) reader.readAsBinaryString(e.target.files[0]);
                else reader.readAsArrayBuffer(e.target.files[0]);
            } else {
                myalert.setMessage("Превышен размер файла");
            }
        } catch (e) {
            console.log(e)
        }
    };

    if (fetch) {
        return (
            <p className="waiting">
                <div class="loader">Loading...</div>
            </p>
        )
    }

    const checkPrice = () => {
        let result = true
        price?.map((item, index) => {
            const numStr = index + 1
            if (!item.Name) {
                myalert.setMessage("В строке № " + numStr + " не заполнено поле наименование");
                result = false
            }
            if (!item.Price) {
                myalert.setMessage("В строке № " + numStr + " не заполнено поле цена");
                result = false
            }
            if (!item.Balance) {
                myalert.setMessage("В строке № " + numStr + " не заполнено поле остаток");
                result = false
            }
            if (!Number(item.Price)) {
                myalert.setMessage("В строке № " + numStr + " поле цена не является числом");
                result = false
            }
            if (!Number(item.Balance)) {
                myalert.setMessage("В строке № " + numStr + " поле остаток не является числом");
                result = false
            }
            let newName = item.Name.replaceAll(' ', '').toLowerCase()
            price?.map((itemInner, indexInner) => {
                if(index!==indexInner){
                    if(newName==itemInner.Name.replaceAll(' ', '').toLowerCase()){
                        const numInnerStr = indexInner + 1
                        myalert.setMessage("В строке № " + numInnerStr + " и строке № " + numStr + " совпадают наименования");
                        result = false
                    }
                } 
            })
        })
        return result
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const options = {
            onUploadProgress: (progressEvent) => {
              const {loaded, total} = progressEvent;
              let percent = Math.floor( (loaded * 100) / total )
              console.log( `${loaded}kb of ${total}kb | ${percent}%` );
              if( percent < 100 ){
                setProgress(percent)
              }
              setInterval(percent,10)
            }
        }
        if(checkedCat.length==0){
            myalert.setMessage("Не заполнены категории");
            return
          }
        if(checkedRegion.length==0){
            myalert.setMessage("Не заполнены регионы");
            return
        }
        if (!formValid(priceForm)){
            myalert.setMessage("Не заполнено поле текст");
            return
        }
        if (file.length !== 0) {
            if (checkPrice()) {
                const data = new FormData()
                data.append("price", JSON.stringify(price))
                data.append("userID", user.user.id)
                data.append("name", priceForm.data.Name)
                data.append("description", priceForm.data.Desciption)
                data.append("category", JSON.stringify(checkedCat))
                data.append("region", JSON.stringify(checkedRegion))
                const result = await uploadPrice(data, options)
                if (result.result) {
                    myalert.setMessage("Прайс загружен");
                } else if (result.errors) {
                    myalert.setMessage(result.message);
                }
                setFile([])
            }
        } else {
            myalert.setMessage("Выберите файл");
        }
        checkPrice()
    };

    const clearPrice = async () => {
        setFetch(true)
        const result = await PriceService.clearPrice({ org: user.user.id });
        if (result.status === 200) {
            myalert.setMessage("Успешно");
        } else {
            myalert.setMessage(result.data.message);
        }
        setPrice([])
        setFetch(false)
    }

    const handleChangeControl = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = priceForm.formErrors;
        let data = priceForm.data
        data[name] = value;
        
        switch (name) {
          case "Name":
            formErrors.Name =
              value.length < 3 ? "минимум 3 символа" : "";
            break;
          default:
            break;
        }
        setPriceForm({ data, formErrors});
        console.log(priceForm)
      }

      const handleClickEdit = (e,item) =>{
        item.editing=!item.editing
        let newPrice = JSON.parse(JSON.stringify(price))
        setPrice(newPrice)
    }

    const handleClickDelete = (e,item) =>{
       let newPrice = price.filter((el) => el._id !== item._id)
       setPrice(newPrice)
    }

    const handleChange = (e,item) =>{
        const { name, value } = e.target;
        item[name] = value;
    }

    const handleSearch = (e) =>{
        const { value } = e.target;
        setSearch(value)
        const regex = value.replace(/\\/g, "\\\\").toLowerCase();
        price.map((item,index)=>{
            if(item.Name.toLowerCase().match(regex) 
                || item.Code.toLowerCase().match(regex)){
                    item.show = true
            }else{
                item.show = false
            }
        })
        setPrice(price)
        console.log(price)
    }

    const newRow = (e) =>{
        const newItem = {
            _id:generateUUID(),
            Code: "",
            Name: "",
            Price: 0,
            Balance: 0,
            editing: true
        }
        price.unshift(newItem)
        let newPrice = JSON.parse(JSON.stringify(price))
        setPrice(newPrice)
    }

    const getTr =(item,index)=>{
        if(!item.show){
            return(
                <></>
            )
        }
        if(item.editing){
            return(
                <tr key={index}>
                <td>{index+1}</td>
                <td onClick ={(e)=>handleClickEdit(e,item)} class="pointer"><PencilSquare/></td>
                <td>
                    <Form.Control 
                        name="Code"
                        type="text"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Code}
                    />
                </td>
                <td>
                    <Form.Control 
                        name="Name"
                        type="text"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Name}
                        as="textarea"
                    />
                </td>
                <td>
                    <Form.Control 
                        name="Price"
                        type="number"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Price}
                    />
                </td>
                <td>
                    <Form.Control 
                        name="Balance"
                        type="number"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Balance}
                    />
                </td>
                <td>
                    <Form.Control 
                        name="Measure"
                        type="text"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Measure}
                    />
                </td>
                <td onClick ={(e)=>handleClickDelete(e,item)} class="pointer"><FileEarmarkX/></td>
                </tr>
            )
        }
        return(
            <tr key={index} >
            <td>{index+1}</td>
            <td onClick ={(e)=>handleClickEdit(e,item)} class="pointer"><PencilSquare/></td>
            <td>{item.Code || <div style={{ "color": "green" }}>нет</div>}</td>
            <td>{item.Name || <div style={{ "color": "red" }}>нет</div>}</td>
            <td>{item.Price || <div style={{ "color": "red" }}>нет</div>}</td>
            <td>{item.Balance || <div style={{ "color": "red" }}>нет</div>}</td>
            <td>{item.Measure || <div style={{ "color": "green" }}>нет</div>}</td>
            <td onClick ={(e)=>handleClickDelete(e,item)} class="pointer"><FileEarmarkX/></td>
            </tr>
        )
    }

    const getTablePrice =()=>{
        if(search==""){
            return(
                <>
                    {price?.map((item,index)=>
                        <> 
                            {getTr(item,index)}
                        </>
                    )}
                </>
            )
        }else{
            return(
                <>
                    {searchResult?.map((item,index)=>
                        <> 
                            {getTr(item,index)}
                        </>
                    )}
                </>
            )
        }
    }

    return (
        <div>
            <Container className="profile">
                <h3>Создать прайс лист</h3> 
                <Row>
                    <Col>
                        <Table>
                            <col style={{"width":"25%"}}/>
                            <col style={{"width":"75%"}}/>
                            <tbody>
                                <tr>
                                <td>Название</td>
                                <td>
                                    <Form.Control
                                      type="text"
                                      name="Name"
                                      onChange={handleChangeControl}
                                      placeholder="Название"
                                    />
                                    <span className="errorMessage" style={{color:"red"}}>{priceForm.formErrors.Name}</span></td>
                                </tr>
                                <tr>
                                <td>Описание</td>
                                <td>
                                    <Form.Control
                                      type="text"
                                      name="Desciption"
                                      onChange={handleChangeControl}
                                      placeholder="Описание"
                                      as="textarea"
                                    />
                                </td>
                                </tr>
                                <tr>
                                    <td>Загрузить фаил прайс листа</td>
                                    <td> 
                                        <input
                                        onChange={onInputChange}
                                        class="form-control"
                                        type="file"
                                        accept=".xlsx, .xls,"
                                        ref={input}
                                        id="formFile" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Инструкция</td>
                                    <td> 
                                    <Card>
                                    <Card.Header style={{
                                        "text-decoration": "underline",
                                        "color": "#EC4D3C",
                                        "cursor": "pointer"
                                    }} onClick={() => setHelp(!help)}>Открыть</Card.Header>
                                    {help ?
                                        <div style={{ "padding": "20px" }}>
                                            Файл прайса можно загрузить в формате Excel *.xls, *xlsx.<br />
                                            После выбора файла вы увидите, каким образом будут отображаться данные
                                            в системе.<br />
                                            Если колонки находятся не на своем месте, или строки пустые,
                                            отредактируйте файл своего<br />
                                            прайса согласно образцу:<br />
                                            <ul>
                                                <li>1-я колонка - Артикул (не обязателен)</li>
                                                <li>2-я колонка - Наименование (обязательно)</li>
                                                <li>3-я колонка - Цена (обязательно)</li>
                                                <li>4-я колонка - Остаток (обязательно)</li>
                                                <li>5-я колонка - Единица измерения (не обязательно)</li>
                                            </ul>
                                            Заголовки колонок подписывать не нужно.<br />
                                            Если данные отображаются как надо, нажимайте кнопку загрузить,
                                            предыдущие данные будут <br />
                                            затерты новыми. Если в строке отсутствует наименование или остаток,
                                            строка будет пропущена.<br />
                                            <a href={`${process.env.REACT_APP_API_URL}static/sample/price.xls`}>Образец файла.</a><br />
                                        </div>
                                        :
                                        <div></div>
                                    }
                                </Card>
                                    {progress !== 0 ?
                                        <ProgressBar now={progress} active label={`${progress}%`} className="mt-3 mb-3" />
                                        :
                                        <div></div>
                                    }
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
                            onClick={(e)=>onSubmit(e)}
                            className="btn btn-success mt-3"
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
                        checked={checkedCat} expanded={expandedCat} max={4}
                        setChecked={setCheckedCat} setExpanded={setExpandedCat}
                    />}/>
                    </Col>
                </Row>
                <Row>
                </Row>
                <Row>
                    <Col>
                    <Form.Group className="mx-auto my-2">
                        <Form.Label>Поиск:</Form.Label>
                        <Form.Control
                            onChange={handleSearch}
                            placeholder="Начните набирать артикул или название продукта"
                        />
                    </Form.Group>
                    </Col>
                </Row>
                <PlusCircleFill onClick={(e)=>newRow()} className="addSpecOffer"/>
                <Table>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Ред.</th>
                        <th>Артикул</th>
                        <th>Наименование</th>
                        <th>Цена</th>
                        <th>Остаток</th>
                        <th>Ед.изм</th>
                        <th>Удалить</th>
                    </tr>
                </thead>
                <tbody>
                    {price?.map((item,index)=>
                        <> 
                            {getTr(item,index)}
                        </>
                    )}
                </tbody>
            </Table>
            <ModalAlert header="Предыдущие данные будут удалены, продолжить?"
                active={modalActive}
                setActive={setModalActive} funRes={clearPrice} />
            </Container>
        </div>
    );
});

export default CreatePrice;