import { React, useContext, useEffect, useState, useRef } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import SpecOfferService from '../services/SpecOfferService'
import { useHistory } from 'react-router-dom';
import { Context } from "../index";
import dateFormat from "dateformat";
import { getCategoryName } from '../utils/Convert'
import { regionNodes } from '../config/Region';
import { CARDSPECOFFER, CREATESPECOFFER } from '../utils/routes';
import MyImage from '../components/MyImage'
import noImage from "../icons/noImage.svg";
import ReactPaginate from "react-paginate";
import {
    Button,
    Form,
    InputGroup,
    ListGroup
} from "react-bootstrap";
import { CaretDownFill, CaretUpFill, X, Heart, Search } from 'react-bootstrap-icons';

const UserSpecOffersTable = observer(({ id }) => {
    const [loading, setLoading] = useState(true)
    const { ask } = useContext(Context);
    const [specOffers, setSpecOffers] = useState([]);
    const [currentImg, setCurrentImg] = useState()
    const [visible, setVisible] = useState(false);
    const { myalert } = useContext(Context);
    const history = useHistory();
    const [pageCount, setPageCount] = useState(0);
    const { user } = useContext(Context);
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const [fetching, setFetching] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchText, setSearchText] = useState("");
    const imgs = useRef([])
    const inputText = useRef(null)
    const wrapperRef = useRef(null)
    const maxPhoto = 5
    let limit = 10;
    ///
    const [suggestionsText, setSuggestionsText] = useState([]);
    const [showDropdownText, setShowDropdownText] = useState(false);
    const [loadingText, setLoadingText] = useState(false);
    ///

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdownText(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Очищаем предыдущий таймер
        const timer = setTimeout(() => {
            if (searchText.length < 2) {
                setSuggestionsText([]);
                setShowDropdownText(false);
                return;
            }
            const fetchSuggestions = async () => {
                setLoadingText(true);
                try {
                    const response = await SpecOfferService.getSpecOfferUser({
                        id,
                        limit:10,
                        search: searchText,
                        page: 1,
                        startDate,
                        endDate
                    })
                    console.log(response)
                    setSuggestionsText(response.docs || []);
                    setShowDropdownText(response.docs?.length > 0);
                } catch (err) {
                    console.error('Ошибка получения подсказок:', err);
                    setSuggestionsText([]);
                    setShowDropdownText(false);
                } finally {
                    setLoadingText(false);
                }
            };

            fetchSuggestions();
        }, 400);

        return () => clearTimeout(timer);
    }, [searchText]);

    useEffect(() => {
        if (visible) {
            setLoading(true)
            SpecOfferService.getSpecOfferUser({
                id,
                limit,
                search: "",
                page: currentPage,
                startDate,
                endDate
            }).then((data) => {
                if (Array.isArray(data.docs)) {
                    data.docs.map((item) => {
                        item.indexFoto = 0
                    })
                }
                setSpecOffers(data.docs);
                setPageCount(data.totalPages);
                setCurrentPage(data.page)
            }).finally(
                () => setLoading(false)
            )
        }
    }, [fetching, visible]);


    const fetchPage = async (currentPage) => {
        setCurrentPage(currentPage)
        setFetching(!fetching)
    };

    const handlePageClick = async (data) => {
        await fetchPage(data.selected + 1);
    }

    const handleSelectText = (e, item) => {
        e.preventDefault()
    }

    const addToFavorites = async (item) => {
        if (item.Favorite) {
            const result = await SpecOfferService.delFavoritesSpec({
                userID: user.user.id,
                specID: item._id
            })
            if (result.status === 200) {
                const newSpecOffers = specOffers.map((el) => {
                    if (el._id === item._id) {
                        el.Favorite = false
                    }
                    return el
                })
                setSpecOffers(newSpecOffers)
            } else {
                myalert.setMessage(result.data.message);
            }
            return
        }
        const result = await SpecOfferService.addFavoritesSpec({
            userID: user.user.id,
            specID: item._id,
            specAuthor: item.Author
        })
        if (result.status === 200) {
            const newSpecOffers = specOffers.map((el) => {
                if (el._id === item._id) {
                    el.Favorite = true
                }
                return el
            })
            setSpecOffers(newSpecOffers)
        } else {
            myalert.setMessage(result.data.message);
        }
    }

    const mouseMoveHandler = (e, item, index) => {
        let num = 0
        let left = imgs.current[index].getBoundingClientRect().left
        let width = imgs.current[index].getBoundingClientRect().width
        let countImage = (item.FilesPreview.length == 0 ?
            item.FilesPreview.length + 1 : item.FilesPreview.length)
        if (countImage >= maxPhoto) {
            num = Math.floor((e.clientX - left) / (width / maxPhoto))
        } else {
            num = Math.floor((e.clientX - left) / (width / countImage))
        }
        item.indexFoto = num
        let newSpecOffers = JSON.parse(JSON.stringify(specOffers))
        setSpecOffers(newSpecOffers)
    }

    const mouseEnterHandler = (e, item, index) => {
        setCurrentImg(index)
    }

    const mouseLeaveHandler = (e, item, index) => {
        setCurrentImg(null)
    }


    const getImg = (item, index) => {
        return (
            item.FilesPreview?.map((innerItem, innerIndex) =>
                <span style={{ 'display': 'grid' }}>
                    <MyImage
                        className={"fotoSpec"}
                        disabled={item.indexFoto !== innerIndex ? true : false}
                        src={process.env.REACT_APP_API_URL + `getpic/` + innerItem?.filename}
                        onMouseMove={(e) => mouseMoveHandler(e, item, index)}
                        onMouseEnter={(e) => mouseEnterHandler(e, item, index)}
                        onMouseLeave={(e) => mouseLeaveHandler(e, item, index)}
                        ref={el => imgs.current[index] = el} />
                    <div className="ImgSpecWrapper">
                        <MyImage
                            src={process.env.REACT_APP_API_URL + `getpic/` + innerItem?.filename}
                            disabled={item.indexFoto !== innerIndex ? true : false}
                            className={"fotoSpecBack"}
                        />
                    </div>
                </span>
            ))
    }

    const getItemSwitch = (item, index) => {
        let count = item.FilesPreview?.length
        let amount = 0
        if (index !== currentImg) {
            return (
                <div class="containerFotoSwitch">
                    <div className="itemSwitchOff"></div>
                </div>
            )
        }
        if (count >= maxPhoto) {
            amount = maxPhoto
        } else {
            amount = count
        }
        return (
            <>
                <div class="containerFotoSwitch">
                    {(() => {
                        const arr = [];
                        for (let i = 0; i < amount; i++) {
                            arr.push(
                                <div className={item.indexFoto == i ? "itemSwitchOn" : "itemSwitchOff"}></div>
                            );
                        }
                        return arr;
                    })()}
                </div>
            </>
        )
    }

    if (loading) {
        return (
            <Card className='section sectionOffers'>
                <Card.Header className='sectionHeaderOffer headerOffers'
                    onClick={() => setVisible(!visible)}>
                    <div className='sectionName'>
                        {visible ?
                            <CaretUpFill className='caret' />
                            :
                            <CaretDownFill className='caret' />
                        }
                        Специальные предложения
                    </div>
                </Card.Header>
                {visible ?
                    <div class="loader">Loading...</div>
                    :
                    <div></div>
                }
            </Card>
        )
    }
    if (specOffers?.length === 0) {
        return (
            <Card className='section sectionOffers'>
                <Card.Header className='sectionHeaderOffer headerOffers'
                    onClick={() => setVisible(!visible)}>
                    <div className='sectionName'>
                        {visible ?
                            <CaretUpFill className='caret' />
                            :
                            <CaretDownFill className='caret' />
                        }
                        Специальные предложения
                    </div>
                </Card.Header>
                {
                    visible ?
                        <h5 className="text-center pt-1">
                            Записей нет.
                        </h5>
                        :
                        <div></div>
                }
            </Card>
        )
    }

    return (
        <Card className='section sectionOffers'>
            <Card.Header className='sectionHeaderOffer headerOffers'
                onClick={() => setVisible(!visible)}>
                <div className='sectionName'>
                    {visible ?
                        <CaretUpFill className='caret' />
                        :
                        <CaretDownFill className='caret' />
                    }
                    Специальные предложения
                </div>
            </Card.Header>
            {visible ?
                <div>
                    <InputGroup className="mb-2 my-3">
                        <Form.Control type="nameOrder" placeholder="Наименование или код товара"
                            ref={inputText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onFocus={() => suggestionsText.length > 0 && setShowDropdownText(true)} />
                        {showDropdownText && (
                            <ListGroup
                                className="dropDownSearchText position-absolute w-100 shadow-sm"
                                ref={wrapperRef}
                            >
                                {loadingText ? (
                                    <ListGroup.Item disabled>Загрузка...</ListGroup.Item>
                                ) : (
                                    suggestionsText.map((item) => (
                                        <ListGroup.Item
                                            key={item.id || item.code}
                                            action
                                            onClick={(e) => handleSelectText(e, item)}
                                            className="py-2"
                                        >
                                            <div className="d-flex justify-content-between">
                                                {item.Name?.substring(0, 100)}
                                            </div>
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        )}{searchText && (
                            <button
                                className="btn-clear"
                                aria-label="Очистить поиск"
                                onClick={() => {
                                    inputText.current.value = ""
                                }}>
                                <X className="btn-clear-icon" />
                            </button>
                        )}
                        <Button variant="outline-secondary" id="button-addon2"
                            onClick={() => {
                            }}>
                            <Search color="black" style={{ "width": "20px", "height": "20px" }} />
                        </Button>
                    </InputGroup>
                    <div className='parentSpec'>
                        {specOffers.map((item, index) => {
                            return (
                                <div
                                    className='childSpec'
                                    ref={el => imgs.current[index] = el} >
                                    {item.FilesPreview?.length == 0 || item.FilesPreview == null ?
                                        <img
                                            className="fotoSpec"
                                            src={noImage} />
                                        :
                                        getImg(item, index)
                                    }
                                    {getItemSwitch(item, index)}
                                    <div className='specInfo'>
                                        <div className=" d-flex justify-content-between">
                                            <span
                                                className="specName"
                                                onClick={() => history.push(CARDSPECOFFER + '/' + item._id)}>
                                                {item.Name}
                                            </span>
                                            {user.isAuth && item.Author._id !== user.user.id ?
                                                <Heart
                                                    className={item.isFavorite ? "heartRed" : "heart"}
                                                    onClick={() => addToFavorites((item))}
                                                />
                                                :
                                                <></>
                                            }
                                        </div>
                                        <div className="specPrice">
                                            {item.Price} ₽
                                        </div>
                                        <div className="specNameOrg">
                                            {item.NameOrg}
                                        </div>
                                        <div className="specCloudy">
                                            {getCategoryName(item.Region, regionNodes).join(", ").length > 40 ?
                                                `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 40)}...`
                                                :
                                                getCategoryName(item.Region, regionNodes).join(", ")
                                            }
                                        </div>
                                        <div className="specCloudy">
                                            {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <ReactPaginate
                        forcePage={currentPage - 1}
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-center"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div>
                :
                <div></div>
            }
        </Card>
    );
});

export default UserSpecOffersTable;