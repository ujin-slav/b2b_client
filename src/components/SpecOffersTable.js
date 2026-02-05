import { React, useContext, useEffect, useState, useRef } from 'react';
import { Card, InputGroup, Button, Col, Row, Form } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import SpecOfferService from '../services/SpecOfferService'
import { useHistory } from 'react-router-dom';
import { Context } from "../index";
import dateFormat from "dateformat";
import { getCategoryName } from '../utils/Convert'
import { regionNodes } from '../config/Region';
import DatePicker, { registerLocale } from 'react-datepicker'
import CardSpecOffer from '../pages/CardSpecOffer';
import { CARDSPECOFFER, CREATESPECOFFER } from '../utils/routes';
import ReactPaginate from "react-paginate";
import { CaretDownFill, CaretUpFill, PlusCircleFill, Search, Heart } from 'react-bootstrap-icons';
import MyImage from '../components/MyImage'
import noImage from "../icons/noImage.svg";
import video from "../icons/video.svg";


const SpecOffersTable = observer(() => {
    const [loading, setLoading] = useState(true)
    const { ask } = useContext(Context);
    const [specOffers, setSpecOffers] = useState([]);
    const [visible, setVisible] = useState(false);
    const { myalert } = useContext(Context);
    const [fetching, setFetching] = useState(true);
    const history = useHistory();
    const [pageCount, setPageCount] = useState(0);
    const { user } = useContext(Context);
    const [currentImg, setCurrentImg] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState("cheaper");
    const imgs = useRef([])
    const maxPhoto = 5

    useEffect(() => {
        if (visible) {
            setLoading(true)
            SpecOfferService.getFilterSpecOffer({
                filterCat: ask.categoryFilter,
                filterRegion: ask.regionFilter,
                searchText: ask.searchText,
                searchInn: ask.searchInn,
                sort,
                startDate,
                endDate,
                user: user.user.id,
                limit, page: currentPage
            }).then((data) => {
                if (Array.isArray(data.docs)) {
                    data.docs.map((item) => {
                        item.indexFoto = 0
                    })
                }
                setSpecOffers(data.docs)
                setPageCount(data.totalPages);
                setCurrentPage(data.page)
            }).finally(() => setLoading(false))
        }
    }, [ask.categoryFilter, ask.regionFilter, ask.searchText, ask.searchInn, visible, fetching, user.isFetching]);

    const fetchPage = async (currentPage) => {
        setCurrentPage(currentPage)
        setFetching(!fetching)
    };

    const handlePageClick = async (data) => {
        await fetchPage(data.selected + 1);
    };

    const handleClickDate = () => {
        setCurrentPage(1)
        setFetching(!fetching)
    }

    const handleSelect = (value) => {
        setCurrentPage(1)
        setLimit(value)
        setFetching(!fetching)
    }

    const handleSelectSort = (value) => {
        setCurrentPage(1)
        setSort(value)
        setFetching(!fetching)
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
                    <Form className="searchFormMenu searchFormMenuMain">
                        <Row>
                            <div className='inputGroupMenuSelect'>
                                <div className='captionMenuSelect'>Период:</div>
                                <InputGroup>
                                    <DatePicker
                                        locale="ru"
                                        selected={startDate}
                                        name="StartDateOffers"
                                        className='form-control datePicker'
                                        dateFormat="dd.MM.yyyy"
                                        onChange={date => setStartDate(date)}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        className='buttonSearchDataPicker'
                                        onClick={() => handleClickDate()}
                                    >
                                        <Search color="black" style={{ "width": "20px", "height": "20px" }} />
                                    </Button>
                                </InputGroup>
                                <InputGroup>
                                    <DatePicker
                                        locale="ru"
                                        selected={endDate}
                                        name="EndDateOffers"
                                        className='form-control datePicker'
                                        dateFormat="dd.MM.yyyy"
                                        onChange={date => setEndDate(date)}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        className='buttonSearchDataPicker'
                                        onClick={() => handleClickDate()}
                                    >
                                        <Search color="black" style={{ "width": "20px", "height": "20px" }} />
                                    </Button>
                                </InputGroup>
                                <div className='captionMenuSelect'>Показать:</div>
                                <Form.Control
                                    as="select"
                                    value={limit}
                                    className='searchFormMenuSelect'
                                    onChange={(e) => handleSelect(e.target.value)}
                                >
                                    <option>10</option>
                                    <option value='25'>25</option>
                                    <option value='50'>50</option>
                                    <option value='100'>100</option>
                                </Form.Control>
                                <div className='captionMenuSelect'>Упорядочить:</div>
                                <Form.Control
                                    as="select"
                                    value={limit}
                                    className='searchFormMenuSelect'
                                    onChange={(e) => handleSelectSort(e.target.value)}
                                >
                                    <option value='cheaper'>Дешевле</option>
                                    <option value='expensive'>Дороже</option>
                                    <option value='less'>Меньше</option>
                                    <option value='more'>Больше</option>
                                </Form.Control>
                            </div>
                        </Row>
                    </Form>
                    <PlusCircleFill onClick={() => history.push(CREATESPECOFFER)} className="addNew" />
                    <span className="createNew">Создать новое</span>
                    <div className='parentSpec'>
                        {specOffers.map((item, index) => {
                            return (
                                <div
                                    className='childSpec'
                                    ref={el => imgs.current[index] = el} 
                                    onClick={() => history.push(CARDSPECOFFER + '/' + item._id)}>    
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
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={1}
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

export default SpecOffersTable;