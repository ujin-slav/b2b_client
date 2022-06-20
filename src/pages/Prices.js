import React,{useEffect, useState} from 'react';
import PriceService from '../services/PriceService'
import {
    Container,
    Table,
    Row,
    Col,
    Form
  } from "react-bootstrap";
 import CardOrg from '../components/CardOrg'; 
 import dateFormat, { masks } from "dateformat";
 import {ORGINFO} from "../utils/routes";
 import {useHistory} from 'react-router-dom';

const Prices = () => {
    const[price,setPrice] = useState([]);
    const[currentPage,setCurrentPage] = useState();
    const[fetching,setFetching] = useState(true);
    const[totalDocs,setTotalDocs] = useState(0);
    const[search,setSearch] = useState("");
    const history = useHistory();

    useEffect(() => {
        if(fetching){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice(currentPage,30,search).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice([...price, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
                console.log(data)
            }).finally(()=>setFetching(false))
            }
        }  
    },[fetching]);

    useEffect(() => {
        document.addEventListener('scroll',scrollHandler);
        return function(){
            document.removeEventListener('scroll',scrollHandler);
        }
    },[]);
    
    const scrollHandler = (e) =>{
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
                setFetching(true)
            }
    }

    const handleSearch = (e) =>{
        PriceService.getPrice(currentPage,30,e.target.value).then((data)=>{
            setTotalDocs(data.totalDocs);
            setPrice(data.docs);
            setCurrentPage(prevState=>prevState + 1)
            setSearch(e.target.value)
        }).finally(()=>setFetching(false))
    }

    return (
        <div>
            <Container>
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
            <Row>
            <Table>
             <thead>
                <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Цена</th>
                    <th>Остаток</th>
                    <th>Организация</th>
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
                            <td> <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + item?.User?._id)}>
                                {item?.User?.nameOrg}</a></td>
                            <td>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
                        </tr>
                    )}
                 </tbody>
            </Table>
            </Row>
            </Container>
        </div>
    );
};

export default Prices;