import React,{useState} from 'react';
import {Modal,Button} from "react-bootstrap";
import Widget from './Widget';
import Region from './Region';

const CategoryTree = ({active, setActive}) => {

    return (
        <div>
            <Modal show={active} onHide={()=>setActive(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Категории</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <Widget /> */}
                    <Region/>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={()=>setActive(false)}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CategoryTree;