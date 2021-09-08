import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { fetchOneAsk } from '../http/askAPI';
import {Card, Table, Col, Container, Row} from "react-bootstrap";

const CardAsk = () => {
    const [ask, setAsk] = useState()
    const {id} = useParams()

    useEffect(() => {
        fetchOneAsk(id).then((data)=>{
            setAsk(data)
            console.log(data);
        })
      },[]);

    return (
        <Container>
            <Row>
                <Col>
                     <Table striped bordered hover size="sm">
                        <tbody>
                            <tr>
                            <td>Название</td>
                            <td>{ask?.Name}</td>
                            </tr>
                            <tr>
                            <td>Статус</td>
                            <td>{ask?.Status}</td>
                            </tr>
                            <tr>
                            <td>Начальная цена</td>
                            <td>{ask?.Price}</td>
                            </tr>
                            <tr>
                            <td>Имя контактного лица</td>
                            <td>{ask?.FIO}</td>
                            </tr>
                            <tr>
                            <td>Телефон контактного лица</td>
                            <td>{ask?.Telefon}</td>
                            </tr>
                            <tr>
                            <td>Телефон контактного лица</td>
                            <td>{ask?.Telefon}</td>
                            </tr>
                            <tr>
                            <td>Поставка до:</td>
                            <td>{ask?.DeliveryTime}</td>
                            </tr>
                            <tr>
                            <td>Поставка до</td>
                            <td>{ask?.DeliveryTime}</td>
                            </tr>
                            <tr>
                            <td>Место поставки</td>
                            <td>{ask?.DeliveryAddress}</td>
                            </tr>
                            <tr>
                            <td>Условия оплаты</td>
                            <td>{ask?.TermsPayments}</td>
                            </tr>
                            <tr>
                            <td>Время окончания предложений</td>
                            <td>{ask?.EndDateOffers}</td>
                            </tr>
                            <tr>
                            <td>Комментарий</td>
                            <td>{ask?.Comment}</td>
                            </tr>
                            <tr>
                            <td>Текст заявки</td>
                            <td>{ask?.TextAsk}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {ask?.Files?.map((item)=><div>
                {item.originalname}
            </div>)}
        </Container>
    );
};

export default CardAsk;