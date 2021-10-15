import React,{useState,useEffect,useContext} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Table,
    Alert,
    Card,
    InputGroup
  } from "react-bootstrap";
  import {Context} from "../index";
  import ContrService from '../services/ContrService';

const EmailList = ({checked,setChecked}) => {
    const [listCont,setListContragent] =  useState([]);
    const [emailSearch,setEmailSearch] =  useState("");
    const {user} = useContext(Context);  
    
    useEffect(() => {
        fetchContr();
    },[user.user.id]);

    const fetchContr = () =>{
        ContrService.fetchContr(user.user.id).then((data)=>{  
            let emailArray = []
            data.map((item)=>{
                emailArray.push(item.Email)
            })
            setListContragent(emailArray);
    })
    }

    const handleControl = (e)=> {
        setEmailSearch(e.target.value)
    }

    const filterEmail=(item)=>{
        return item.toLowerCase().indexOf(emailSearch.toLowerCase()) > -1;
    }

    const checkedHandler=(e,item)=>{
        if(e.target.checked){
            setChecked([...checked, item]);
        }else{
            setChecked(checked.filter(el => el !== item));
        }
    }

    return (
        <div>
              <Form.Control
                            placeholder="Введите e-mail контрагента"
                            onChange={(e)=>handleControl(e)}
            />
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>E-mail</th>
                    <th>Выбрать</th>
                </tr>
                </thead>
                <tbody>
                {listCont.filter(filterEmail).map((item,index)=>
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item}</td>
                    <td><Form.Check
                                    name="email"
                                    type="checkbox"
                                    defaultChecked={checked.includes(item)}
                                    onChange={(e)=>checkedHandler(e,item)}
                    /></td>
                </tr>
                )}  
                </tbody>
            </Table>
        </div>
    );
};

export default EmailList; 