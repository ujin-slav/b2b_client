import React,{useState} from 'react';
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

const SearchForm = () => {
    const [modalActiveCat, setModalActiveCat] = useState(false);
    const [modalActiveReg, setModalActiveReg] = useState(false);
    return (
        <div>
            <Container className="mb-3 mt-3">
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Номер закупки</Form.Label>
                            <Form.Control type="numberOrder" placeholder="Номер закупки" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Регион заказчика</Form.Label>
                            <Form.Control type="regionClient" placeholder="Регион заказчика" />
                        </Form.Group>
                        <Form.Group  as={Col} controlId="formGridPassword">
                            <Form.Label>Максимальная цена</Form.Label>
                            <div class="input-group">
                                <input type="text" class="form-control input-sm" value="От" />
                                <span class="input-group-btn" style={{width:"0px"}}></span>
                                <input type="text" class="form-control input-sm" value="До" />
                            </div>
                        </Form.Group>
                    </Row> 
                    <Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Наименование закупки</Form.Label>
                            <Form.Control type="nameOrder" placeholder="Наименование" />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Наименование или ИНН заказчика</Form.Label>
                            <Form.Control type="nameClient" placeholder="Наименование или ИНН заказчика" />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Макисмальный срок поставки</Form.Label>
                            <div class="input-group">
                                <input type="text" class="form-control input-sm" value="От" />
                                <span class="input-group-btn" style={{width:"0px"}}></span>
                                <input type="text" class="form-control input-sm" value="До" />
                            </div>
                    </Form.Group>
                    </Row>   
                    <Row>
                    <Form.Group as={Col} controlId="Tree">
                            <Form.Label>Классификатор</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                placeholder="Классификатор"
                                />
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveCat(true)}>
                                ...
                                </Button>
                            </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} controlId="Tree">
                            <Form.Label>Регионы</Form.Label>
                              <InputGroup className="mb-3">
                                <Form.Control
                                placeholder="Регионы"
                                />
                                <Button variant="outline-secondary" id="button-addon2" onClick={()=>setModalActiveReg(true)}>
                                ...
                                </Button>
                            </InputGroup>
                    </Form.Group>
                    </Row>                   
                </Form>  
            </Container>
            <ModalCT header="Категории" active={modalActiveCat} setActive={setModalActiveCat} component={<CategoryTree/>}/>
            <ModalCT header="Регионы" active={modalActiveReg} setActive={setModalActiveReg} component={<RegionTree/>}/>
        </div>
    );
};

export default SearchForm;