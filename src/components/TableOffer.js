import React,{useEffect,useState,useContext} from 'react';
import {fetchUserOffers} from '../http/askAPI';
import { fetchOffers } from '../http/askAPI';
import {Table} from "react-bootstrap";
import {Context} from "../index";
import ModalAlert from './ModalAlert';
import AskService from '../services/AskService'

const TableOffer = () => {

    const [modalActive,setModalActive] = useState(false);
    const [deleteId,setDeleteId] = useState();
    const [offers, setOffers] = useState();
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);

    useEffect(() => {
      AskService.fetchUserOffers(user.user.id).then((data)=>{
            setOffers(data);
        })
    },[offers]);

    const deleteOffer = async () =>{
      const result = await AskService.deleteOffer(deleteId);
      if (result.status===200){
        myalert.setMessage("Успешно"); 
      } else {
        myalert.setMessage(result.data.message);
      }
      console.log(result);
    }


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
            <th>Удалить</th>
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
            <td><button onClick={()=>{
              setModalActive(true);
              setDeleteId(item._id)}}>Удалить</button></td>
          </tr>
        )}  
        </tbody>
      </Table> 
      <ModalAlert header="Вы действительно хотите удалить" 
              active={modalActive} 
              setActive={setModalActive} funRes={deleteOffer}/>
    </div>
    );
};

export default TableOffer;