import React,{useEffect, useState,useContext} from 'react';
import PriceService from '../services/PriceService'
import {
    Container,
    Table,
    Row,
    Col,
    Form,
    InputGroup,
    Button
  } from "react-bootstrap";
 import CardOrg from '../components/CardOrg'; 
 import {Context} from "../index";
 import dateFormat, { masks } from "dateformat";
 import {ORGINFO,CREATEPRICEASK} from "../utils/routes";
 import {useHistory} from 'react-router-dom';
 import {observer} from "mobx-react-lite";
 import {getCategoryName} from '../utils/Convert'
 import RegionTree from '../components/RegionTree';
 import { regionNodes } from '../config/Region';
 import ModalCT from '../components/ModalCT';
 import { Cart4} from 'react-bootstrap-icons';

const Prices = observer(() => {
    const {user} = useContext(Context);
    const[price,setPrice] = useState([]);
    const[currentPage,setCurrentPage] = useState();
    const[fetching,setFetching] = useState(true);
    const[totalDocs,setTotalDocs] = useState(0);
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [expandedRegion,setExpandedRegion] = useState([]);
    const [modalActiveReg, setModalActiveReg] = useState(false);
    const[search,setSearch] = useState("");
    const history = useHistory();
    let limit = 30

    useEffect(() => {
        if(fetching){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice({page:currentPage,limit,search}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice([...price, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
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
        PriceService.getPrice({
            page:currentPage,
            limit,
            search:e.target.value}
            ).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(prevState=>prevState + 1)
                setSearch(e.target.value)
        }).finally(
            ()=>setFetching(false)
        )
    }

    return (
        <div>
            <Container>
            <Row>
                    <Col>
                    <Form.Group className="mx-auto my-2 mt-3">
                        <Form.Control
                            onChange={handleSearch}
                            placeholder="Начните набирать артикул или название продукта"
                        />
                        <InputGroup className="mb-3 mt-3">
                                <Form.Control
                                placeholder="Регионы"
                                value={getCategoryName(checkedRegion, regionNodes).join(", ")}
                                />
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveReg(true)}>
                                ...
                                </Button>
                        </InputGroup>
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
                    <th>+</th>
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
                            <td>{dateFormat(item.Date, "dd/mm/yyyy")}</td>
                            <td><Cart4 color="#0D55FD" style={{"width": "25px", "height": "25px"}}
                            onClick={()=>{
                                if(user.isAuth){
                                    history.push(CREATEPRICEASK + '/' + item?.User?._id + '/' + item?._id)
                                }else{
                                    history.push(CREATEPRICEASK + '/' + item?.User?._id + '/' + item?._id)
                                }
                            }}
                            /></td>
                        </tr>
                    )}
                 </tbody>
            </Table>
            </Row>
            </Container>
            <ModalCT 
                header="Регионы" 
                active={modalActiveReg} 
                setActive={setModalActiveReg} 
                component={<RegionTree 
                checked={checkedRegion} expanded={expandedRegion} 
                setChecked={setCheckedRegion} setExpanded={setExpandedRegion}
                />}/>
        </div>
    );
});

export default Prices;