import React,{useState} from 'react';
import {Modal,Button} from "react-bootstrap";

const ModalAlert = ({active, setActive, header,funRes}) => {

    const funOk = ()=>{
        setActive(false);
        funRes()
    }

    return (
        <div>
            <Modal show={active} onHide={()=>setActive(false)}>
                <Modal.Header closeButton>
                <Modal.Title>{header}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                <Button onClick={()=>funOk()}>
                    Ок
                </Button>
                <Button variant="secondary" onClick={()=>setActive(false)}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalAlert;