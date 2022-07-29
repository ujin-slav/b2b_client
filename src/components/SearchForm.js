import React,{useState,useContext,useEffect} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Spinner,
    Alert,
    Card,
    InputGroup
  } from "react-bootstrap";
  import '../style.css';
import ModalCT from './ModalCT';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CategoryTree from './CategoryTree';
import RegionTree from './RegionTree';
import {getCategoryName} from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import {Context} from "../index";
import {Search} from 'react-bootstrap-icons';

const SearchForm = () => {
    const {ask} = useContext(Context);
    const [modalActiveCat, setModalActiveCat] = useState(false);
    const [modalActiveReg, setModalActiveReg] = useState(false);
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [expandedRegion,setExpandedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const [expandedCat,setExpandedCat] = useState([]);
    const [searchText,setSearchText] = useState("");
    const [searchInn,setSearchInn] = useState("");

    useEffect(() => {
        ask.categoryFilter = checkedCat;
        ask.regionFilter = checkedRegion;
    },[checkedCat,checkedRegion]);

    return (
        <div style={{
            "background-image":`url(${process.env.REACT_APP_API_URL}static/background/fon.png)`,
            "background-size":'20%',
            "background-repeat": "no-repeat"
        }}>
                <Form className="searchForm">
                    <Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                            <InputGroup className="mb-3">
                                <Form.Control type="nameOrder" placeholder="Наименование или текст закупки" 
                                    onChange={(e)=>setSearchText(e.target.value)}/>
                                <Button variant="outline-secondary" id="button-addon2" 
                                        onClick={()=>{ask.setSearchText(searchText)
                                            ask.setSearchInn(searchInn)}}>
                                    <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                                </Button>
                            </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail">
                            <InputGroup className="mb-3">
                                <Form.Control type="nameClient" placeholder="Наименование или ИНН заказчика" 
                                    onChange={(e)=>setSearchInn(e.target.value)}/>
                                <Button variant="outline-secondary" id="button-addon2" 
                                        onClick={()=>{ask.setSearchInn(searchInn)
                                            ask.setSearchText(searchText)}}>
                                    <Search color="black" style={{"width": "20px", "height": "20px"}}/>
                                </Button>
                            </InputGroup>
                    </Form.Group>
                    </Row>   
                    <Row>
                    <Form.Group as={Col} controlId="Tree">
                            <InputGroup className="mb-3">
                                <Form.Control
                                placeholder="Классификатор"
                                value={getCategoryName(checkedCat, categoryNodes).join(", ")}
                                />
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveCat(true)}>
                                ...
                                </Button>
                            </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} controlId="Tree">
                              <InputGroup className="mb-3">
                                <Form.Control
                                placeholder="Регионы"
                                value={getCategoryName(checkedRegion, regionNodes).join(", ")}
                                />
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveReg(true)}>
                                ...
                                </Button>
                            </InputGroup>
                    </Form.Group>
                    </Row>                   
                </Form>  
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
        </div>
    );
};

export default SearchForm;