import React from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Spinner,
    Alert,
  } from "react-bootstrap";


const RegInput = ({value}) => {
    
    const {Name, Label, handleChange, PlaceHolder,ErrorMessage} = value; 
    
    return (
        <div>
                <Form.Group>
                <Form.Label>{Label}</Form.Label>
                <Form.Control
                    name={Name}
                    onChange={handleChange}
                    placeholder={PlaceHolder}
                />
                <span className="errorMessage" style={{color:"red"}}>{ErrorMessage}</span>
                </Form.Group>
        </div>
    );
};

export default RegInput;