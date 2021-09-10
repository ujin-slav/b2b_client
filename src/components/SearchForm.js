import React from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Spinner,
    Alert,
    Card,
  } from "react-bootstrap";
  import '../style.css';

const SearchForm = () => {
    return (
        <div>
            <Container>
                <Card>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Номер закупки</Form.Label>
                            <Form.Control type="email" placeholder="Номер закупки" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Регион заказчика</Form.Label>
                            <Form.Control type="regionClient" placeholder="Регион заказчика" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label >Максимальная цена</Form.Label>
                                <Form.Control type="maxPrice" className="side-by-side" placeholder="Максимальная цена" />
                                <Form.Control type="maxPrice" className="side-by-side" placeholder="Максимальная цена" />
                        </Form.Group>
                    </Row>               
                </Form>  
                </Card> 
            </Container>
        </div>
    );
};

export default SearchForm;