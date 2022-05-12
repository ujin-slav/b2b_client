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
            setChecked([...checked, item]);
        }else{
            setChecked(checked.filter(el => el.Email !== item.Email));
        }
    }

    return (
        <div>Добавлять контрагентов вы можете в разделе контрагенты в основном меню.
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
                {listCont.filter(filterEmail).map((item,index)=>{    
                return(    
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item.Name}</td>
                    <td>{item.Email}</td>
                    <td><Form.Check
                            name="email"
                            type="checkbox"
                            defaultChecked={checked.filter(i => i.Email == item.Email).length > 0}
                            onChange={(e)=>checkedHandler(e,item)}
                    /></td>
                </tr>
                )})}  
                </tbody>
            </Table>
        </div>
    );
};

export default EmailList; 