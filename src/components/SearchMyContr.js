import React,{useContext} from 'react';
import {Form } from "react-bootstrap";
import {Context} from "../index";
import { observer } from 'mobx-react-lite';

const SearchMyContr = observer(() => {

    const {myContr} = useContext(Context)

    const handleSearch = async(value) =>{
        myContr.setSearchString(value)
    }

    return (
        <div>
            <Form.Group className="mx-auto my-2">
                <Form.Label>Поиск:</Form.Label>
                <Form.Control
                    onChange={(e)=>{handleSearch(e.target.value)}}
                    placeholder="Начните набирать инн или название организации"
                />
            </Form.Group>
        </div>
    );
});

export default SearchMyContr;