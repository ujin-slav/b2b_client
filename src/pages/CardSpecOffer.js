import React, { useState, useEffect, useContext } from 'react';
import { Container, Col, Row, Card } from "react-bootstrap";
import SpecOfferService from '../services/SpecOfferService'
import PriceService from '../services/PriceService'
import { useParams } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import FotoSlider from '../components/FotoSlider';
import ModalCT from '../components/ModalCT';
import MessageBox from '../components/MessageBox'
import MyImage from '../components/MyImage'
import SimilarSpecOffers from '../components/SimilarSpecOffers'
import { Context } from "../index";
import SpecOfferAskFiz from '../components/SpecOfferAskFiz';
import SpecOfferAskOrg from '../components/SpecOfferAskOrg';
import { useHistory, useLocation } from 'react-router-dom'
import { CARDSPECOFFER, ORGINFO } from '../utils/routes';
import noImage from "../icons/noImage.svg";
import rutube from "../icons/rutube.svg";
import cart from "../icons/cart.svg";
import video from "../icons/video.svg";
import { fetchUser } from "../http/askAPI";

const CardSpecOffer = observer(() => {
    const { user } = useContext(Context);
    const [priceUnit, setPriceUnit] = useState();
    const [showSlider, setShowSlider] = useState(false);
    const [loading, setLoading] = useState(true);
    const [author, setAuthor] = useState();
    const { id, idprice } = useParams();
    const [typePlayer, setTypePlayer] = useState(1);
    const [fotoFocus, setFotoFocus] = useState(0);
    const [videoFocus, setVideoFocus] = useState(0);
    const [specOffer, setSpecOffer] = useState();
    const [modalActiveMessage, setModalActiveMessage] = useState(false)
    const [modalActiveAskFiz, setModalActiveAskFiz] = useState(false)
    const [modalActiveAskOrg, setModalActiveAskOrg] = useState(false)
    const [error, setError] = useState()
    const history = useHistory()
    const location = useLocation();

    useEffect(() => {
        SpecOfferService.getSpecOfferId({ id }).then((result) => {
            if (result.status === 200 && result.data) {
                setSpecOffer(result.data?.specoffer)
                fetchUser(result.data?.specoffer?.Author).then((response) => {
                    setAuthor(response?.data)
                })
                if(idprice){
                    PriceService.getPriceUnit(idprice).then((data)=>{
                        setPriceUnit(data)
                    })
                }
            } else {
                setError(result.data.errors)
            }
        }).finally(() => setLoading(false))
    }, [location]);

    if (loading) {
        return (
            <p className="waiting">
                <div class="loader">Loading...</div>
            </p>
        )
    }

    const redirect = (e, id) => {
        window.scrollTo(0, 0)
        history.push(CARDSPECOFFER + '/' + id)
    }

    const cartPrice = () => {
        return (
            <div>
                <div className="display-6">
                    {priceUnit?.Name}
                </div>
                <div className="cardSpecPrice">
                    {priceUnit?.Price} ₽
                </div>
                <div>
                    <button className="myButtonMessage mt-4"
                        onClick={() => {
                            if (user.isAuth) {
                                setModalActiveAskOrg(true)
                            } else {
                                setModalActiveAskFiz(true)
                            }
                        }}>
                        Сделать заявку
                        <img src={cart} className="specOfferCart" />
                    </button>
                </div>
            </div>
        )
    }

    const returnPlayer = () => {
        if (typePlayer == 1 && specOffer?.Rutube) {
            return (
                <div>
                    <iframe width="600" height="337"
                        src={specOffer?.Rutube}
                        allow="clipboard-write; autoplay"
                        webkitAllowFullScreen mozallowfullscreen allowFullScreen>
                    </iframe>
                </div>
            )
        }
        return (
            <>
                {!specOffer?.Files || specOffer?.Files.length == 0 ?
                    <img src={noImage} />
                    :
                    <MyImage className='fotoSpecCard'
                        onClick={() => setShowSlider(true)}
                        src={process.env.REACT_APP_API_URL + `getpic/` + specOffer?.Files[fotoFocus]?.filename} />
                }
            </>
        )
    }

    const getThumbnailSrc = () => {
        const videoId = specOffer?.Rutube?.split('/embed/')[1]?.split('/')[0] || '';
        return videoId 
          ? `https://rutube.ru/api/video/${videoId}/thumbnail/?redirect=1&size=m`
          : '';
      };

    if (error) {
        return (
            <div>
                <Container
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: window.innerHeight - 54 }}
                >
                    <Card style={{ width: 600 }} className="p-5 ">
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
                    {returnPlayer()}
                    <div className='parentSpec'>
                        {specOffer?.FilesMini?.map((item, index) =>
                            <div key={index} className='albumSpec'>
                                <MyImage className='miniFotoSpecCard'
                                    onClick={() => {
                                        setFotoFocus(index)
                                        setTypePlayer(0)
                                    }}
                                    src={process.env.REACT_APP_API_URL + `getpic/` + item.filename} />
                            </div>
                        )}
                        {specOffer?.Rutube &&
                            <div class="d-flex align-items-center position-relative" >
                                <img
                                    className='miniFotoSpecCardSVG position-absolute'
                                    src={video}
                                    onClick={() => { setVideoFocus(0); setTypePlayer(1) }}
                                />
                                <img className='miniFotoSpecCard' src={getThumbnailSrc()} />
                            </div>
                        }
                    </div>
                    {window.innerWidth < 650 ? cartPrice() : <div></div>}
                    <div className="specContact">
                        <span>Описание</span>
                    </div>
                    <div className="specContactData">
                        <span>{specOffer?.Text}</span>
                    </div>
                </Col>
                <Col>
                    {window.innerWidth > 650 ? cartPrice() : <div></div>}
                    {user.isAuth ?
                        <div>
                            <button className="myButtonMessage mt-2"
                                onClick={() => setModalActiveMessage(true)}>
                                Написать сообщение
                                <i className="col-2 fa fa-solid fa-paper-plane colorBlue" />
                            </button>
                        </div>
                        :
                        <div></div>
                    }
                    <div className="specContactData mt-3">
                        <div className="d-flex">
                            <img className="avatarSuggestion" src={process.env.REACT_APP_API_URL + `getlogo/` + author?.logo?.filename} />
                            <div className="px-2">
                                <div>{author?.name.substring(0, 100)}</div>
                                <div>{author?.nameOrg.substring(0, 100)}</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <SimilarSpecOffers 
                    redirect={redirect}
                    id={idprice}
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
                component={<MessageBox author={specOffer?.Author} setActive={setModalActiveMessage} />}
                setActive={setModalActiveMessage}
            />
            <ModalCT
                header="Заказ"
                active={modalActiveAskFiz}
                component={<SpecOfferAskFiz
                    specOffer={specOffer}
                    setActive={setModalActiveAskFiz} />}
                setActive={setModalActiveAskFiz}
            />
            <ModalCT
                header="Заказ"
                active={modalActiveAskOrg}
                component={<SpecOfferAskOrg
                    specOffer={specOffer}
                    setActive={setModalActiveAskOrg} />}
                setActive={setModalActiveAskOrg}
            />
        </Container>
    );
});

export default CardSpecOffer;