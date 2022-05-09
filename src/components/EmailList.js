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
            console.log(data)
            setListContragent(data);
    })
    }

    const handleControl = (e)=> {
        setEmailSearch(e.target.value)
    }

    const filterEmail=(item)=>{
        let tempEmail = item.Email
        let tempName =  item.Name
        return tempEmail.toLowerCase().indexOf(emailSearch.toLowerCase()) > -1 || 
        tempName.toLowerCase().indexOf(emailSearch.toLowerCase()) > -1
    }

    const checkedHandler=(e,item)=>{
        if(e.target.checked){
            setChecked([...checked, item.Email]);
        }else{
            setChecked(checked.filter(el => el !== item.Email));
        }
    }

    return (
        <div>
              <Form.Control
                            placeholder="Введите имя или e-mail контрагента"
                            onChange={(e)=>handleControl(e)}
            />
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Имя</th>
                    <th>E-mail</th>
                    <th>Выбрать</th>
                </tr>
                </thead>
                <tbody>
                {listCont.filter(filterEmail).map((item,index)=>
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item.Name}</td>
                    <td>{item.Email}</td>
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