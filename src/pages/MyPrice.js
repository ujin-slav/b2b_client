import React,{useState,useEffect,useContext} from 'react';
import {
        Table, 
        Container, 
        Row, 
        Form,
        Button,
        ProgressBar,
        Card} from "react-bootstrap";
import PriceService from '../services/PriceService'
import {useParams} from 'react-router-dom';
import dateFormat, { masks } from "dateformat";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import { PlusCircleFill, PencilSquare, FileEarmarkX} from 'react-bootstrap-icons';
import {generateUUID} from '../utils/getUID'
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import { regionNodes } from '../config/Region';
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import ModalCT from '../components/ModalCT';
import * as XLSX from 'xlsx';

const MyPrice = observer(() => {

    const {user} = useContext(Context);
    const {id} = useParams();
    const [progress, setProgress] = useState(0)
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const [price,setPrice] = useState([]);
    const [priceName,setPriceName] = useState([]);  
    const [changingItems,setChangingItems] = useState([]); 
    const[totalDocs,setTotalDocs] = useState(0);
    const {myalert} = useContext(Context);
    const[search,setSearch] = useState("");
    const[changedItems,setChangedItems] = useState([])
    const[deletedItems,setDeletedItems] = useState([])
    const[newItems,setNewItems] = useState([]) 
    const [modalActiveReg,setModalActiveReg] = useState(false)
    const [modalActiveCat,setModalActiveCat] = useState(false)
    const [expandedRegion,setExpandedRegion] = useState([]);
    const [expandedCat,setExpandedCat] = useState([]);
    const [priceForm, setPriceForm] = useState({
        data: {
          Author: "",
          Name: null,
          Desciption: "",
          Category: "",
          Region: "",
        },
        formErrors: {
          Name: ""
        }
    });
    let limit = 9999999999999999999

    useEffect(() => {
        const options = {
            onDownloadProgress: function(progressEvent) {
                const {loaded, total} = progressEvent;
                let percent = Math.floor( (loaded * 100) / total )
                if( loaded < total ){
                    setProgress(percent)
                }else{
                    setProgress(0)
                }
            }
        }
        PriceService.getMyPrice({page:1,limit,search,org:user.user.id,priceId:id}, options).then((data)=>{
            setTotalDocs(data.totalDocs);
            const dataDocs = data.docs
            dataDocs.map((item,index)=>{
                item.show = true
            })
            setPrice([...price, ...dataDocs]);
        }).finally()
    },[]);

    useEffect(() => {
        PriceService.getPriceId({id}).then((data)=>{
            let formErrors = priceForm.formErrors
            setCheckedRegion(data?.Region)
            setCheckedCat(data?.Category)
            setPriceForm({data,formErrors})
            setPriceName(data.Name)
        })
    },[]);

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
    }

    const handleClickEdit = (e,item) =>{
        if(item.newItem){
            let search = newItems.findIndex((el)=>el._id==item._id)
            let searchChanging = changingItems.findIndex((el)=>el._id==item._id)
            changingItems.splice(searchChanging,1)
            setChangingItems(items)
            newItems[search] = item
            return
        }
        let search = changingItems.findIndex((el)=>el._id==item._id)
        if(search==-1){
            setChangingItems([...changingItems,JSON.parse(JSON.stringify(item))])
        }else{
            if(JSON.stringify(changingItems[search]) === JSON.stringify(item)){
                //console.log("не отличаются")
            }else{
                console.log("отличаются")
                let search = changedItems.findIndex((el)=>el._id==item._id)
                if(search==-1){
                    setChangedItems([...changedItems,JSON.parse(JSON.stringify(item))])
                }else{
                    changedItems.splice(search,1)
                    setChangedItems([...changedItems,JSON.parse(JSON.stringify(item))])
                }
            }
            changingItems.splice(search,1)
            let items = JSON.parse(JSON.stringify(changingItems))
            setChangingItems(items)
        }
    }

    const handleClickDelete = (e,item) =>{
       let newPrice = price.filter((el) => el._id !== item._id)
       let newItemsPrice = newItems.filter((el) => el._id !== item._id)
       setDeletedItems([...deletedItems, item])
       setPrice(newPrice)
       setNewItems(newItemsPrice)
    }

    const handleChange = (e,item) =>{
        const { name, value } = e.target;
        item[name] = value;
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
    }

    const loadPrice = () =>{
        PriceService.getMyPrice({page:1,limit:totalDocs,search:'',org:user.user.id,priceId:id}).then((data)=>{
            const fileName = `${priceName}.xlsx`;
            const aoa = []
            data.docs.map((item)=>{
                aoa.push([item.Code,item.Name,item.Price,item.Balance,item.Measure])
            })
            const ws = XLSX.utils.aoa_to_sheet(aoa);
            var wscols = [
                {wch:25},
                {wch:60},
                {wch:15},
                {wch:15},
                {wch:15},
            ];
            ws['!cols'] = wscols
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'price');
    
            XLSX.writeFile(wb, fileName);
        }).finally()
    }

    const newRow = (e) =>{
        const newItem = {
            _id:generateUUID(),
            Code: "",
            Date: new Date(),
            Name: "",
            Price: 0,
            Balance: 0,
            show: true,
            newItem: true
        }
        setNewItems([...newItems,newItem])
        setChangingItems([...changingItems,newItem])
        price.unshift(newItem)
        let newPrice = JSON.parse(JSON.stringify(price))
        setPrice(newPrice)
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
            //
            if (item.Price<0) {
                myalert.setMessage("В строке № " + numStr + " поле цена меньше 0");
                result = false
            }
            if (item.Balance<0) {
                myalert.setMessage("В строке № " + numStr + " поле остаток меньше 0");
                result = false
            }
            //
            if (item.Name?.length>500) {
                myalert.setMessage("В строке № " + numStr + " наименование больше 500 знаков");
                result = false
            }
            if (item.Code?.length>100) {
                myalert.setMessage("В строке № " + numStr + " артикул больше 100 знаков");
                result = false
            }
            if (item.Measure?.length>10) {
                myalert.setMessage("В строке № " + numStr + " ед.изм больше 10 знаков");
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

    const onSubmit = async(e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("id", id)
        data.append("Author", user.user.id)
        data.append("Name", priceForm.data.Name)
        data.append("Desciption", priceForm.data.Desciption)
        data.append("Category", JSON.stringify(checkedCat))
        data.append("Region", JSON.stringify(checkedRegion))
        data.append("changedItems", JSON.stringify(changedItems))
        data.append("deletedItems", JSON.stringify(deletedItems))
        data.append("newItems", JSON.stringify(newItems))
        const result = await PriceService.modifyPrice(data)
        if (result.status===200){
            myalert.setMessage("Прайс успешно изменен");
          } else {
            myalert.setMessage(result?.data?.message)
          }
         console.log(result) 
    }

    const getTr =(item,index)=>{
        let searchChanging = changingItems.findIndex((el)=>el._id==item._id)
        if(!item.show){
            return(<></>)
        }
        if(searchChanging!==-1){
            return(
                <tr key={index}>
                <td>{index+1}</td>
                <td onClick ={(e)=>handleClickEdit(e,item)} class="pointer"><PencilSquare/></td>
                <td>
                    <Form.Control 
                        name="Code"
                        maxlength="100"
                        type="text"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Code}
                    />
                </td>
                <td>
                    <Form.Control 
                        name="Name"
                        type="text"
                        maxlength="500"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Name}
                        as="textarea"
                    />
                </td>
                <td>
                    <Form.Control 
                        name="Price"
                        type="number"
                        max="9999999999999999999999999999999999999"
                        min="0.01"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Price}
                    />
                </td>
                <td>
                    <Form.Control 
                        name="Balance"
                        type="number"
                        max="9999999999999999999999999999999999999"
                        min="0.01"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Balance}
                    />
                </td>
                <td>
                    <Form.Control 
                        name="Measure"
                        maxlength="10"
                        type="text"
                        onChange={(e)=>handleChange(e,item)}
                        defaultValue={item?.Measure}
                    />
                </td>
                <td>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
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
            <td>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
            <td onClick ={(e)=>handleClickDelete(e,item)} class="pointer"><FileEarmarkX/></td>
            </tr>
        )
    }


    return (
        <Container> 
                <Form>
                <h3>{priceName}</h3>
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
                                    defaultValue={priceForm.data.Name}
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
                                      defaultValue={priceForm.data.Desciption}
                                      placeholder="Описание"
                                      as="textarea"
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
                            <tr>
                                <td>Ссылка</td>
                                <td><a href="javascript:void(0)" onClick={()=>loadPrice(true)}>{priceName}.xlsx</a></td>
                            </tr>
                        </tbody>
                    </Table> 
                    {progress !== 0 ?
                        <>  
                            Загрузка...
                            <ProgressBar now={progress} active label={`${progress}%`} className="mt-3 mb-3" />
                        </>
                        :
                        <div></div>
                    }
                    <Button
                            variant="primary"
                            onClick={(e)=>onSubmit(e)}
                            className="btn btn-success mt-1 mb-2"
                        >
                            Сохранить
                    </Button> 
                    <Row>
                    <Form.Group className="my-2">
                        <Form.Label>Поиск:</Form.Label>
                        <Form.Control
                            onChange={handleSearch}
                            placeholder="Начните набирать артикул или название продукта"
                        />
                    </Form.Group>
                </Row>
                <PlusCircleFill onClick={(e)=>newRow()} className="addSpecOffer"/>
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
                    <th>Дата</th>
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
            </Form>
        </Container>
    );
});

export default MyPrice;