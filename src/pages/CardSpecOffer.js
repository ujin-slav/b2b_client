import React,{useState,useEffect,useContext} from 'react';
import {Container,Col,Row,Card} from "react-bootstrap";
import SpecOfferService from '../services/SpecOfferService'
import {useParams} from 'react-router-dom';
import {observer} from "mobx-react-lite";
import FotoSlider from '../components/FotoSlider';
import ModalCT from '../components/ModalCT';
import MessageBox from '../components/MessageBox'
import SimilarSpecOffers from '../components/SimilarSpecOffers'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import {getCategoryName} from '../utils/Convert'
import {Context} from "../index";
import SpecOfferAskFiz from '../components/SpecOfferAskFiz';
import SpecOfferAskOrg from '../components/SpecOfferAskOrg';
import {useHistory,useLocation} from 'react-router-dom'
import { CARDSPECOFFER,ORGINFO } from '../utils/routes';
import { Cart4} from 'react-bootstrap-icons';
import {CREATEPRICEASK, CREATEPRICEASKFIZ} from "../utils/routes";

const CardSpecOffer = observer(() => {
    const {user} = useContext(Context);
    const [priceID, setPriceID] = useState();
    const [showSlider, setShowSlider] = useState(false);
    const [loading, setLoading] = useState(true);
    const [checkedRegion,setCheckedRegion] = useState([]);
    const [checkedCat,setCheckedCat] = useState([]);
    const {id} = useParams();
    const [fotoFocus, setFotoFocus] = useState(0);
    const [specOffer, setSpecOffer] = useState();
    const [modalActiveMessage,setModalActiveMessage] = useState(false)
    const [modalActiveAskFiz,setModalActiveAskFiz] = useState(false)
    const [modalActiveAskOrg,setModalActiveAskOrg] = useState(false)
    const [error, setError] = useState()
    const history = useHistory()
    const location = useLocation(); 

    useEffect(() => {
        SpecOfferService.getSpecOfferId({id}).then((result)=>{
            if(result.status===200){
                setPriceID(result.data.priceId)
                setSpecOffer(result.data.specoffer)
                setCheckedRegion(result.data.specoffer.Region)
                setCheckedCat(result.data.specoffer.Category)
            }else{
                setError(result.data.errors)
            }
        }).finally(()=>setLoading(false))     
    },[location]);

    if (loading){
        return(
            <p className="waiting">
                <div class="loader">Loading...</div>
            </p>
        )
    }

    const redirect=(e,id)=>{
        window.scrollTo(0, 0) 
        history.push(CARDSPECOFFER + '/' + id)
    }

    const cartPrice = ()=>{
        return(
            <div>
                <div className="cardSpecPrice">
                     {specOffer.Price} ₽
                </div>  
                <div>  
                    <button className="myButtonMessage mt-4"
                            onClick={()=>{
                                if(user.isAuth){
                                    history.push(CREATEPRICEASK + '/' +  specOffer?.Author + '/' + priceID)
                                }else{
                                    history.push(CREATEPRICEASKFIZ + '/' +  specOffer?.Author + '/' + priceID)
                                }
                            }}>
                                Сделать заявку
                        <Cart4 className="specOfferCart"/>
                    </button>
                </div> 
            </div>
        )
    }

    if(error){
        return(
            <div>
              <Container
                      className="d-flex justify-content-center align-items-center"
                      style={{height: window.innerHeight - 54}}
                      >
                  <Card style={{width: 600}} className="p-5 ">
                      <h5>Спец.предложение не существует, или удалено.</h5>
                  </Card> 
              </Container>
            </div>
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
                {specOffer.FilesMini?.map((item,index)=>
                    <div key={index} className='albumSpec'>
                        <img className='miniFotoSpecCard'
                        onClick={()=>setFotoFocus(index)} 
                        src={process.env.REACT_APP_API_URL + `getpic/` + item.filename}/>
                    </div>
                )}
                </div>
                {window.innerWidth < 650 ? cartPrice() : <div></div>}
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
                {window.innerWidth > 650 ? cartPrice() : <div></div>}
                {user.isAuth ?
                <div>
                    {/* <Button style={{
                        fontSize:"20px",
                        padding:"10px 35px 10px 35px",
                        marginTop:"30px"
                    }} 
                    onClick={()=>setModalActiveAskOrg(true)}>
                    Заказать
                    </Button> */}
                    <button className="myButtonMessage mt-2"
                    onClick={()=>setModalActiveMessage(true)}>
                      Написать сообщение
                     <i className="col-2 fa fa-solid fa-paper-plane colorBlue"/>
                    </button>
                </div>
                :
                <div></div>
                }
                <div className="specContact">
                    <span>Организация:</span>
                </div>
                <div className="specContactData">
                    <a href="javascript:void(0)" onClick={()=>history.push(ORGINFO + '/' + specOffer.Author)}>
                    <span>{specOffer.NameOrg} ИНН {specOffer.Inn}</span>
                    </a>
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
           <SimilarSpecOffers 
                    categoryFilter={checkedCat}
                    regionFilter={checkedRegion} 
                    redirect={redirect}
            />
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
            <ModalCT 
            header="Заказ" 
            active={modalActiveAskOrg}
            component={<SpecOfferAskOrg 
                specOffer={id}
                receiver={specOffer?.Author} 
                setActive={setModalActiveAskOrg}/>}
            setActive={setModalActiveAskOrg}   
            />
        </Container>
    );
});

export default CardSpecOffer;