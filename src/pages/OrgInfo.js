import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUser } from '../http/askAPI';
import { Table, Col, Container, Row, Card } from "react-bootstrap";
import ModalCT from '../components/ModalCT';
import MessageBox from '../components/MessageBox'
import { Context } from "../index";
import noImage from "../icons/noImage.svg";
import ReviewOrgItems from '../components/ReviewOrgItems';
import '../fontawesome.css';
import { CREATEPRICEASK, CREATEPRICEASKFIZ } from '../utils/routes';
import { useHistory } from 'react-router-dom'
import MessageBoxComplaint from '../components/MessageBoxComplaint';
import MyImage from '../components/MyImage'
import FotoSliderAlbum from '../components/FotoSliderAlbum';

const OrgInfo = () => {

    const { idorg, idprod } = useParams();
    const [org, setOrg] = useState();
    const [file, setFile] = useState([])
    const { user } = useContext(Context)
    const [error, setError] = useState()
    const [fotoFocus, setFotoFocus] = useState(0)
    const [showSlider, setShowSlider] = useState(false)
    const [modalActiveMessage, setModalActiveMessage] = useState(false)
    const [modalAMC, setModalAMC] = useState(false)
    const [hasErrorMyImage, setHasErrorMyImage] = useState(false)
    const history = useHistory()

    useEffect(() => {
        fetchUser(idorg).then((result) => {
            if (result.status === 200) {
                if (result.data) {
                    setOrg(result.data)
                    if (result.data.logo) {
                        fetch(process.env.REACT_APP_API_URL + `getlogo/` + result.data.logo?.filename)
                            .then(res => res.blob())
                            .then(blob => {
                                setFile(blob)
                            })
                    }
                }
            } else {
                setError(result?.data?.errors)
            }
        })

    }, []);

    const logo = () => {
        if(hasErrorMyImage){
            return  <img className={"fotoSpec"} src={noImage}/>
        }
        if (file.length !== 0) {
            return (
                <span style={{ 'display': 'grid' }}>
                    <MyImage
                        className={"fotoSpec"}
                        disabled={false}
                        src={URL.createObjectURL(file)} 
                        onError={() => setHasErrorMyImage(true)}
                        />
                    <div className="ImgSpecWrapper">
                        <MyImage
                            src={URL.createObjectURL(file)}
                            disabled={false}
                            className={"fotoSpecBack"}
                            onError={() => setHasErrorMyImage(true)}
                        />
                    </div>
                </span>
            )
        } else {
            return (
                <span></span>
            )
        }
    }

    const listFotos = () => {
        console.log(org)
        if (org?.filesMini?.length !== 0) {
            return (
                <div className="containerOrgInfoFoto">
                    {org?.filesMini?.map((item, index) =>
                        <div key={index} className='albumSpec'>
                            <MyImage className='miniFotoSpecCard'
                                onClick={() => {
                                    setFotoFocus(index)
                                    setShowSlider(true)
                                }}
                                src={process.env.REACT_APP_API_URL + `getalbum/` + item.filename} />
                        </div>
                    )}
                </div>
            )
        } else {
            return (
                <span></span>
            )
        }
    }

    if (error) {
        return (
            <div>
                <Container
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: window.innerHeight - 54 }}
                >
                    <Card style={{ width: 600 }} className="p-5 ">
                        <h5>Пользователь не существует</h5>
                    </Card>
                </Container>
            </div>
        )
    }

    return (
        <Container style={{ widorgth: "80%" }}>
            <Row>
                <Col>
                    <Table >
                        <tbody>
                            <tr>
                                <td>Логотип</td>
                                <td>
                                    {logo()}
                                </td>
                            </tr>
                            <tr>
                                <td>Фото</td>
                                <td>
                                    {listFotos()}
                                </td>
                            </tr>
                            <tr>
                                <td>Видео(Rutube)</td>
                                <td>
                                    
                                        <iframe width="600" height="337" 
                                        src="https://rutube.ru/play/embed/e749d9f6600516c814535140a9f19c4c/" 
                                        allow="clipboard-write; autoplay" 
                                        webkitAllowFullScreen mozallowfullscreen allowFullScreen> 
                                        </iframe>
                                   
                                </td>
                            </tr>
                            <tr>
                                <td>Имя</td>
                                <td>{org?.name}
                                </td>
                            </tr>
                            {user.isAuth ?
                                <tr>
                                    <td></td>
                                    <td>
                                        <div className="orgInfoMessageButton">
                                            <button className="myButtonMessage"
                                                onClick={() => setModalActiveMessage(true)}>
                                                Написать сообщение
                                                <i className="fa fa-solidorg fa-paper-plane colorBlue" />
                                            </button>
                                            <button
                                                className="myButtonMessage mt-0 w-100"
                                                onClick={() => {
                                                    if (user.isAuth) {
                                                        history.push(CREATEPRICEASK + '/' + idorg)
                                                    } else {
                                                        history.push(CREATEPRICEASKFIZ + '/' + idorg)
                                                    }
                                                }}>
                                                Создать заявку
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                :
                                <div></div>
                            }
                            <tr>
                                <td>Название организации</td>
                                <td>{org?.nameOrg}</td>
                            </tr>
                            <tr>
                                <td>Адрес организации</td>
                                <td>{org?.adressOrg}</td>
                            </tr>
                            <tr>
                                <td>ИНН</td>
                                <td>{org?.inn}</td>
                            </tr>
                            <tr>
                                <td>Описание</td>
                                <td>{org?.description}</td>
                            </tr>
                            <tr>
                                <td>Контактный телефон</td>
                                <td>
                                    {org?.telefon}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                </td>
                                <td>
                                    <button
                                        className="myButtonMessage"
                                        onClick={() => setModalAMC(true)}>
                                        Отправить жалобу
                                        <i className="fa fa-solidorg fa-paper-plane colorBlue" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {/* <Row>
                <UserSpecOfferTable id={idorg} />
            </Row> */}
            <Row>
                <ReviewOrgItems id={idorg} />
            </Row>
            <ModalCT
                header="Сообщение"
                active={modalActiveMessage}
                component={<MessageBox author={org} setActive={setModalActiveMessage} />}
                setActive={setModalActiveMessage}
            />
            <ModalCT
                header="Сообщение"
                active={modalAMC}
                component={<MessageBoxComplaint author={org} setActive={setModalAMC} />}
                setActive={setModalAMC}
            />
            <FotoSliderAlbum
                fotoArray={org?.files}
                setShow={setShowSlider}
                show={showSlider}
                fotoFocus={fotoFocus}
                setFotoFocus={setFotoFocus}
            />
        </Container>
    );
};

export default OrgInfo;