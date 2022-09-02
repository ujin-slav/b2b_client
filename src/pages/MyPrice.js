import React,{useState,useEffect,useContext} from 'react';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import PriceService from '../services/PriceService'
import dateFormat, { masks } from "dateformat";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const MyPrice = observer(() => {
    const {user} = useContext(Context);
    const [org, setOrg] = useState();
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
        PriceService.getPrice({page:currentPage,limit,search,org:user.user.id}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(prevState=>prevState + 1)
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

    return (
        <Container>             
                <Row>
                    <Form.Group className="mx-auto my-2">
                        <Form.Label>Поиск:</Form.Label>
                        <Form.Control
                            onChange={handleSearch}
                            placeholder="Начните набирать артикул или название продукта"
                        />
                    </Form.Group>
            </Row>
            <Table>
             <thead>
                <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Цена</th>
                    <th>Остаток</th>
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
                            <td>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
                        </tr>
                    )}
                 </tbody>
            </Table>
        </Container>
    );
});

export default MyPrice;