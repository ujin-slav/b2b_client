import React,{useState,useEffect,useContext} from 'react';
import {Card, Table, Col, Container, Row, Button,Form} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {CREATESPECOFFER} from "../utils/routes";

const MySpecOffers = () => {
    const history = useHistory();

    return (
        <div>
             <Button onClick={()=>history.push(CREATESPECOFFER)}>
                Создать новое.
            </Button>
        </div>
    );
};

export default MySpecOffers;