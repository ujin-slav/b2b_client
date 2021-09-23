import {React,useContext} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Table} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { CARDASK } from '../utils/routes';

const TableAsk = observer(() => {
    const {ask} = useContext(Context);
    const history = useHistory();

    return (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Статус</th>
            <th>ИНН заказчика</th>
            <th>Регионы</th>
            <th>Категории товара</th>
            <th>Максимальная цена</th>
            <th>Окончание предложений</th>
          </tr>
        </thead>
        <tbody>
        {ask.getAsk().map((item)=>
          <tr onClick={()=>history.push(CARDASK + '/' + item._id)}>
            <td>1</td>
            <td>{item.Name}</td>
            <td>{item.Status}</td>
            <td></td>
            <td></td>
            <td>{item.Price}</td>
            <td>{item.EndDateOffers}</td>
          </tr>
        )}  
        </tbody>
      </Table>
    );
});

export default TableAsk;