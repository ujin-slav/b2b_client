import React,{useState} from 'react';
import {Modal,Button} from "react-bootstrap";

const CategoryTree = ({active, setActive, component, header, text}) => {
    return (
        <div>
            <Modal show={active} onHide={()=>setActive(false)}>
                <Modal.Header closeButton>
                <Modal.Title>{header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {text}
                    {component}
                </Modal.Body>
                <Modal.Footer>
                <button className="myButtonMessage" onClick={()=>setActive(false)}>
                    Закрыть
                </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CategoryTree;