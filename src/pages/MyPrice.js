import React,{useState,useEffect,useContext} from 'react';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import PriceService from '../services/PriceService'
import {useParams} from 'react-router-dom';
import dateFormat, { masks } from "dateformat";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import ModalAlert from '../components/ModalAlert';
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import {getCategoryName} from '../utils/Convert'
import { PlusCircleFill, PencilSquare, FileEarmarkX} from 'react-bootstrap-icons';
import {generateUUID} from '../utils/getUID'
import * as XLSX from 'xlsx';

const MyPrice = observer(() => {
    const {user} = useContext(Context);
    const [org, setOrg] = useState();
    const {id} = useParams();
    const[loadingFull,setLoadingFull] = useState(false);
    const[fetching,setFetching] = useState(true);
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const [fetch,setFetch] = useState(false); 
    const [price,setPrice] = useState([]); 
    const [changingItems,setChangingItems] = useState([]); 
    const [priceHead,setPriceHead] = useState({}); 
    const[totalDocs,setTotalDocs] = useState(0);
    const {myalert} = useContext(Context);
    const[currentPage,setCurrentPage] = useState(1);
    const [modalActiveMessage,setModalActiveMessage] = useState(false)
    const[search,setSearch] = useState("");
    const [modalActive,setModalActive] = useState(false);
    const[changedItems,setChangedItems] = useState([])
    const[deletedItems,setDeletedItems] = useState([])
    const[newItems,setNewItems] = useState([]) 
    let limit = 30

    useEffect(() => {
        if(fetching){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getMyPrice({page:currentPage,limit,search,org:user.user.id,priceId:id}).then((data)=>{
                setTotalDocs(data.totalDocs);
                const dataDocs = data.docs
                setPrice([...price, ...dataDocs]);
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>setFetching(false))
            }
        }
    },[fetching,user.user]);

    useEffect(() => {
        PriceService.getPriceId({id}).then((data)=>{
            setPriceHead(data)
            setCheckedRegion(data?.Region)
            setCheckedCat(data?.Category)
        })
        document.addEventListener('scroll',scrollHandler);
        return function(){
            document.removeEventListener('scroll',scrollHandler);
        }
    },[]);

    const handleSearch = (e) =>{
        const { value } = e.target;
        PriceService.getMyPrice({page:1,limit,search:value,priceId:id,org:user.user.id}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(2)
                setSearch(value)
        }).finally(
            ()=>setFetching(false)
        )
        ///
        const regex = value.replace(/\\/g, "\\\\").toLowerCase();
        newItems.map((item,index)=>{
            if(item.Name.toLowerCase().match(regex) 
                || item.Code.toLowerCase().match(regex)){
                    item.show = true
            }else{
                item.show = false
            }
        })
        setNewItems(newItems)
    }

    const scrollHandler = (e) =>{
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
                setFetching(true)
            }
    }

    const loadPrice = () =>{
        setLoadingFull(true)
        PriceService.getMyPrice({page:1,limit:totalDocs,search:'',org:user.user.id,priceId:id}).then((data)=>{
            const fileName = `Price.xlsx`;
            const aoa = []
            data.docs.map((item)=>{
                aoa.push([item.Code,item.Name,item.Price,item.Balance])
            })
            const ws = XLSX.utils.aoa_to_sheet(aoa);
            var wscols = [
                {wch:25},
                {wch:60},
                {wch:15},
                {wch:15},
            ];
            ws['!cols'] = wscols
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'price');
    
            XLSX.writeFile(wb, fileName);
        }).finally(()=>setLoadingFull(false))
    }

    const handleClickEdit = (e,item) =>{
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
        let newPrice = JSON.parse(JSON.stringify(price))
        setPrice(newPrice)
    }

    const checkItem = (item, index, array) => {
        let result = true
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
        array?.map((itemInner, indexInner) => {
            if(index!==indexInner){
                if(newName==itemInner.Name.replaceAll(' ', '').toLowerCase()){
                    const numInnerStr = indexInner + 1
                    myalert.setMessage("В строке № " + numInnerStr + " и строке № " + numStr + " совпадают наименования");
                    result = false
                }
            } 
        })
        return result
    }

    const checkItems = () => {
        let result = true
        newItems?.map((item, index, array) => {
            result = checkItem(item, index, array)
        })
        changedItems?.map((item, index, array) => {
            result = checkItem(item, index+newItems.length, array)
        })
        return result
    }

    const save = (e) => {
        checkItems()
    }

    if(loadingFull||fetch){
        return (
            <p className="waiting">
                <div class="loader">Loading...</div>
            </p> 
        )
    }

    const getTr =(item,index)=>{
        let searchChanging = changingItems.findIndex((el)=>el._id==item._id)
        let searchChanged = changedItems.findIndex((el)=>el._id==item._id)
        let searchDeleted = deletedItems.findIndex((el)=>el._id==item._id)
        if(item.newItem && !item.show){
            return(<></>)
        }
        if(searchDeleted!==-1){
            return(<></>)
        }
        if(searchChanged!==-1){
            item=changedItems[searchChanged]
        }
        if(searchChanging!==-1){
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
                    <Table>
                        <col style={{"width":"25%"}}/>
          	            <col style={{"width":"75%"}}/>
                        <tbody>
                            <tr>
                                <td>Название</td>
                                <td>{priceHead?.Name}</td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td>{priceHead?.Desciption}</td>
                            </tr>
                            <tr>
                                <td>Категории</td>
                                <td>{getCategoryName(checkedCat, categoryNodes).join(", ")}</td>
                            </tr>
                            <tr>
                                <td>Регионы</td>
                                <td>{getCategoryName(checkedRegion, regionNodes).join(", ")}</td>
                            </tr>
                            <tr>
                                <td>Ссылка</td>
                                <td><a href="javascript:void(0)" onClick={()=>loadPrice(true)}>Прайс.xls</a></td>
                            </tr>
                        </tbody>
                    </Table> 
                    <Button
                            variant="primary"
                            onClick={(e)=>save(e)}
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
                    {newItems?.map((item,index)=>
                        <> 
                            {getTr(item,index)}
                        </> 
                    )}
                    {price?.map((item,index)=>
                        <> 
                            {getTr(item,index+newItems.length)}
                        </> 
                    )}
                 </tbody>
            </Table>
        </Container>
    );
});

export default MyPrice;