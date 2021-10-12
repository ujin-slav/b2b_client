import React,{useState} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Spinner,
    Alert,
    Card,
    Link,
    InputGroup
  } from "react-bootstrap";

const CardOrg = ({item}) => {
    const [readMoreTelefon, setReadMoreTelefon] = useState(false);
    const [readMoreEmail, setReadMoreEmail] = useState(false);

    const boldStyle = {
        fontWeight: 'bold',
    };

    const Telefon = ({item}) => {
        return(
            <div>
                {item.Telefon.length > 200 ?
                <div>
                    <span style={boldStyle}> Телефон: </span>
                        {readMoreTelefon ? item.Telefon : `${item.Telefon.substring(0, 200)}...`}
                        <a href="javascript:void(0)" onClick={() => setReadMoreTelefon(!readMoreTelefon)}> 
                        {readMoreTelefon ? 'Свернуть' : 'Показать больше'} </a>
                </div>  
                :
                <div>
                    <span style={boldStyle}> Телефон: </span>{item.Telefon}
                </div>
                }  
            </div>
        )
    } 

    const Email = ({item}) => {
        return(
            <div>
                {item.Telefon.length > 200 ?
                <div>
                    <span style={boldStyle}> E-mail: </span>
                        {readMoreEmail ? item.email : `${item.email.substring(0, 200)}...`}
                        <a href="javascript:void(0)" onClick={() => setReadMoreEmail(!readMoreEmail)}> 
                        {readMoreEmail ? 'Свернуть' : 'Показать больше'} </a>
                </div>  
                :
                <div>
                    <span style={boldStyle}> Телефон: </span>{item.Telefon}
                </div>
                }  
            </div>
        )
    } 

    return (
        <div>
        <Card>
        <Card.Header>{item.NameOrg}</Card.Header>
        <Card.Body>
            <Card.Text>
            <div><span style={boldStyle}>ИНН:</span> {item.INN} 
            <span style={boldStyle}> КПП: </span>{item.KPP}</div>
            <div><span style={boldStyle}> Адрес: </span>{item.Address}</div>
            <div><span style={boldStyle}> ФИО рук-ля: </span>{item.Surname} {item.Name} {item.Patron}</div>
            <div><span style={boldStyle}> Категория: </span>{item.Category}</div>
            <Telefon item={item} />
            <Email item={item}/>
            <div><span style={boldStyle}> ОКПО: </span>{item.OKPO}</div>
            <div><span style={boldStyle}> Сайт: </span>{item.Site}</div> 
            </Card.Text>
        </Card.Body>
        </Card>
    </div>
    );
};

export default CardOrg;