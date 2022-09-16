import React,{useContext} from 'react';
import {Form } from "react-bootstrap";
import {Context} from "../index";
import { observer } from 'mobx-react-lite';

const SearchMyContr = observer(() => {

    const {myContr} = useContext(Context)

    const handleSearch = async(e)=>{
        myContr.setSearchString(e.target.value)
    }

    return (
        <div>
            <Form.Control
                        onChange={handleSearch}
                        placeholder="Начните набирать инн или название фирмы"
            />
        </div>
    );
});

export default SearchMyContr;