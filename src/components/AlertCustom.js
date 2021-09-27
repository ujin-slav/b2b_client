import React,{useContext} from 'react';
import { Alert } from 'react-bootstrap';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const AlertCustom =  observer(() => {

    const {myalert} = useContext(Context); 

    return (
        <div>
            <Alert variant="warning" show={myalert.show} onClose={() => myalert.setShow(false)} dismissible>
                    {myalert.message}
            </Alert>
        </div>
    );
});

export default AlertCustom;