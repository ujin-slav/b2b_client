import React,{useState,useEffect,useContext} from 'react';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import PriceService from '../services/PriceService'
import dateFormat, { masks } from "dateformat";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import * as XLSX from 'xlsx';

const MyPrice = observer(() => {
    const {user} = useContext(Context);
    const [org, setOrg] = useState();
    const[loadingFull,setLoadingFull] = useState(false);
    const[fetching,setFetching] = useState(true);
    const [price,setPrice] = useState([]); 
    const[totalDocs,setTotalDocs] = useState(0);
    const[currentPage,setCurrentPage] = useState(1);
    const [modalActiveMessage,setModalActiveMessage] = useState(false)
    const[search,setSearch] = useState("");
    let limit = 30

    useEffect(() => {
        if(fetching){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice({page:currentPage,limit,search,org:user.user.id}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice([...price, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>setFetching(false))
            }
        }
    },[fetching,user.user]);

    useEffect(() => {
        document.addEventListener('scroll',scrollHandler);
        return function(){
            document.removeEventListener('scroll',scrollHandler);
        }
    },[]);

    const handleSearch = (e) =>{
        PriceService.getPrice({page:1,limit,search,org:user.user.id}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(2)
                setSearch(e.target.value)
        }).finally(
            ()=>setFetching(false)
        )
    }

    const scrollHandler = (e) =>{
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
                setFetching(true)
            }
    }

    const loadPrice = () =>{
        setLoadingFull(true)
        console.log(totalDocs)
        PriceService.getPrice({page:1,limit:totalDocs,search:'',org:user.user.id}).then((data)=>{
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

    if(loadingFull){
        return (
            <div class="loader">Loading...</div>
        )
    }

    return (
        <Container>             
                <Row>
                    <Form.Group className="mx-auto my-2">
                        <Form.Label>Поиск:</Form.Label>
                        <Form.Control
                            onChange={handleSearch}
                            placeholder="Начните набирать артикул или название продукта"
                        />
                        <Button
                        variant="primary"
                        className="btn btn-success mt-3 mx-3"
                        onClick={()=>loadPrice(true)}
                        >
                            Скачать загруженный прайс
                        </Button>
                    </Form.Group>
            </Row>
            <Table>
             <thead>
                <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Цена</th>
                    <th>Остаток</th>
                    <th>Ед.изм</th>
                    <th>Дата</th>
                </tr>
                </thead>
                <tbody>
                    {price?.map((item,index)=>
                        <tr key={index}>
                            <td>{item?.Code}</td>
                            <td>{item?.Name}</td>
                            <td>{item?.Price}</td>
                            <td>{item?.Balance}</td>
                            <td>{item?.Measure}</td>
                            <td>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
                        </tr>
                    )}
                 </tbody>
            </Table>
        </Container>
    );
});

export default MyPrice;