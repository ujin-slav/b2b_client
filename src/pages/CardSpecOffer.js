import React,{useState,useEffect,useContext} from 'react';
import {Container,Col,Row,Button} from "react-bootstrap";
import SpecOfferService from '../services/SpecOfferService'
import {useParams} from 'react-router-dom';
import waiting from "../waiting.gif";
import {observer} from "mobx-react-lite";
import FotoSlider from '../components/FotoSlider';
import ModalCT from '../components/ModalCT';
import MessageBox from '../components/MessageBox'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import {getCategoryName} from '../utils/Convert'
import {Context} from "../index";
import SpecOfferAskFiz from '../components/SpecOfferAskFiz';

const CardSpecOffer = observer(() => {
    const {user} = useContext(Context);
    const [showSlider, setShowSlider] = useState(false);
    const [loading, setLoading] = useState(true);
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const {id} = useParams();
    const [fotoFocus, setFotoFocus] = useState(0);
    const [specOffer, setSpecOffer] = useState();
    const [modalActiveMessage,setModalActiveMessage] = useState(false)
    const [modalActiveAskFiz,setModalActiveAskFiz] = useState(false)

    useEffect(() => {
        SpecOfferService.getSpecOfferId({id}).then((data)=>{
            setSpecOffer(data)
            setCheckedRegion(data.Region)
            setCheckedCat(data.Category)
        }).finally(()=>setLoading(false))     
    },[]);

    if (loading){
        return(
            <p className="waiting">
                <img height="320" src={waiting}/>
            </p>
        )
    }
  
    return (
        <Container className="mx-auto my-4">
           <Row>
            <Col>
                <img className='fotoSpecCard' 
                    onClick={()=>setShowSlider(true)}
                    src={process.env.REACT_APP_API_URL + `getpic/` + specOffer?.Files[fotoFocus]?.filename}/>
                 <div className='parentSpec'>
                {specOffer.Files.map((item,index)=>
                    <div key={index} className='childSpec'>
                        <img className='miniFotoSpecCard'
                        onClick={()=>setFotoFocus(index)} 
                        src={process.env.REACT_APP_API_URL + `getpic/` + item.filename}/>
                    </div>
                )}
                </div>
                <div className="specContact">
                    <span>Описание</span>
                </div>
                <div className="specContactData">
                    <span>{specOffer.Text}</span>
                </div>
                <div className="specContact">
                    <span>Категории</span>
                </div>
                <div className="specContactData">
                    <span>{getCategoryName(checkedCat, categoryNodes).join(", ")}</span>
                </div>
                <div className="specContact">
                    <span>Регионы</span>
                </div>
                <div className="specContactData">
                    <span>{getCategoryName(checkedRegion, regionNodes).join(", ")}</span>
                </div>
            </Col>
            <Col>
                <div className="cardSpecPrice">
                    {specOffer.Price} ₽
                </div>      
                {user.isAuth ? 
                <Button style={{
                    fontSize:"20px",
                    padding:"10px 35px 10px 35px",
                    marginTop:"30px"
                }} 
                onClick={()=>setModalActiveMessage(true)}>
                Написать сообщение
                </Button>
                :
                <Button style={{
                    fontSize:"20px",
                    padding:"10px 35px 10px 35px",
                    marginTop:"30px"
                }} 
                onClick={()=>setModalActiveAskFiz(true)}>
                Заказать
                </Button>
                }
                <div className="specContact">
                    <span>Организация:</span>
                </div>
                <div className="specContactData">
                    <span>{specOffer.NameOrg} ИНН {specOffer.Inn}</span>
                </div>
                <div className="specContact">
                    <span>Контактное лицо:</span>
                </div>
                <div className="specContactData">
                    <span>{specOffer.Contact}</span>
                </div>
                <div className="specContact">
                    <span>Контактный телефон:</span>
                </div>
                <div className="specContactData">
                    <span>{specOffer.Telefon}</span>
                </div>
            </Col>
           </Row> 
           <FotoSlider 
            fotoArray={specOffer?.Files}
            setShow={setShowSlider}
            show={showSlider}
            fotoFocus={fotoFocus}
            setFotoFocus={setFotoFocus}
           />
            <ModalCT 
            header="Сообщение" 
            active={modalActiveMessage}
            component={<MessageBox author={specOffer?.Author} setActive={setModalActiveMessage}/>}
            setActive={setModalActiveMessage}   
            />
            <ModalCT 
            header="Заказ" 
            active={modalActiveAskFiz}
            component={<SpecOfferAskFiz 
                specOffer={id}
                receiver={specOffer?.Author} 
                setActive={setModalActiveAskFiz}/>}
            setActive={setModalActiveAskFiz}   
            />
        </Container>
    );
});

export default CardSpecOffer;