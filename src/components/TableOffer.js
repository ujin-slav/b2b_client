import React,{useEffect,useState,useContext} from 'react';
import {fetchUserOffers} from '../http/askAPI';
import { fetchOffers } from '../http/askAPI';
import {Table} from "react-bootstrap";
import {Context} from "../index";

const TableOffer = () => {

    const [offers, setOffers] = useState();
    const {user} = useContext(Context);  

    useEffect(() => {
        fetchUserOffers(user.user.id).then((data)=>{
            setOffers(data)
            console.log(data);
        })
    },[offers]);

    return (
        <div>
         <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Закупка</th>
            <th>Цена</th>
            <th>Сообщение</th>
            <th>Фаилы</th>
          </tr>
        </thead>
        <tbody>
        {offers?.map((item)=>
          <tr>
            <td>1</td>
            <td>{item.Ask}</td>
            <td>{item.Price}</td>
            <td>{item.Text}</td>
            <td>{item.File}</td>
          </tr>
        )}  
        </tbody>
      </Table> 
    </div>
    );
};

export default TableOffer;