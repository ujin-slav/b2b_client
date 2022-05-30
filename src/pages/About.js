import React from 'react';
import {Container} from "react-bootstrap";

const About = () => {
    return (
        <Container className="mx-auto my-4" style={{"width":"80%"}}>
            <p style={{marginBottom: '0.35cm'}}>	Вам знакома ситуация, когда вы
            рассылаете по электронной почте множество заявок на закупку товара, и
            поставщики через некоторое время все начинают присылать вам
            коммерческие предложения? Кто то из них начинает задавать уточняющие
            вопросы, перевыставлять счета, и становится сложно разобраться в этой
            ситуации, можно упустить важную информацию или пропустить выгодное
            предложение. 
            </p>
            <p style={{marginBottom: '0.35cm'}}>	Тогда этот сервис для вас.</p>
            <p style={{marginBottom: '0.35cm'}}>
            <img src={`${process.env.REACT_APP_API_URL}static/about/About_html_m4e9aeae5.png`} 
                name="Графический объект1" align="LEFT" width={624} height={298} border={0} /><br clear="LEFT" />
            </p>
            <p style={{marginBottom: '0.35cm'}}>	Если вы хотите ограничить круг
            участников, то это также несложно сделать при создании заявки.</p>
            <p style={{marginBottom: '0.35cm'}}>
            <img src={`${process.env.REACT_APP_API_URL}static/about/About_html_51f86d33.gif`} 
                name="Графический объект2" align="LEFT" width={624} height={305} border={0} /><br clear="LEFT" /><br /><br />
            </p>
            <p style={{marginBottom: '0.35cm'}}>	Ну и конечно же сервис будет
            полезен для тех кто хочет предложить свои товары или услуги.</p>
            <p style={{marginBottom: '0.35cm'}}>Мы будем рады услышать ваши
            замечания и предложения по работе сервиса по адресу: 
            </p>
      </Container>
    );
  };

export default About;