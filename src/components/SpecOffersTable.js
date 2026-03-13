import { React, useContext, useEffect, useState, useRef } from 'react';
import { Card, InputGroup, Button, Table, Row, Form } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import SpecOfferService from '../services/SpecOfferService'
import { useHistory } from 'react-router-dom';
import { Context } from "../index";
import dateFormat from "dateformat";
import { getCategoryName } from '../utils/Convert'
import { regionNodes } from '../config/Region';
import DatePicker, { registerLocale } from 'react-datepicker'
import ru from 'date-fns/locale/ru'
import CardSpecOffer from '../pages/CardSpecOffer';
import {
    CARDSPECOFFER,
    ORGINFO,
    CREATEPRICEASK,
    CREATEPRICEASKFIZ
} from '../utils/routes';
import ReactPaginate from "react-paginate";
import {
    CaretDownFill,
    CaretUpFill,
    HandIndexThumb,
    ViewList,
    FileEarmarkRichtext,
    Toggle2On,
    Toggle2Off
} from 'react-bootstrap-icons';
import MyImage from '../components/MyImage'
import noImage from "../icons/noImage.svg";
import table from "../icons/table.svg"
import tableList from "../icons/table-list.svg"
import grid from "../icons/grid.svg"
import HoverPreview from '../components/HoverPreview'
import HoverPreviewBig from '../components/HoverPreviewBig'
import SpecOffersSkeleton from '../components/SpecOfferTableSkeleton'
import cart from "../icons/cart.svg"
import { faBalanceScaleLeft } from '@fortawesome/free-solid-svg-icons';


registerLocale('ru', ru)
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
    const [displayOption, setDisplayOption] = useState(3)
    const [displayOnlySpecOffers, setDisplayOnlySpecOffers] = useState(false)
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
                limit,
                displayOnlySpecOffers,
                page: currentPage
            }).then((data) => {
                if (Array.isArray(data.docs)) {
                    data.docs.map((item) => {
                        item.indexFoto = 0
                    })
                }
                console.log(data.docs)
                setSpecOffers(data.docs)
                setPageCount(data.totalPages);
                setCurrentPage(data.page)
            }).finally(() => setLoading(false))
        }
    }, [
        ask.categoryFilter,
        ask.regionFilter,
        ask.searchText,
        ask.searchInn,
        visible,
        fetching,
        user.isFetching
    ]);

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

    const handleClickToggleSpecOffers = () => {
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
        let countImage = (item.filesPreview.length == 0 ?
            item.filesPreview.length + 1 : item.filesPreview.length)
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

    // if (loading) {
    //     return (
    //         <Card className='section sectionOffers'>
    //             <Card.Header className='sectionHeaderOffer headerOffers'
    //                 onClick={() => setVisible(!visible)}>
    //                 <div className='sectionName'>
    //                     {visible ?
    //                         <CaretUpFill className='caret' />
    //                         :
    //                         <CaretDownFill className='caret' />
    //                     }
    //                     Предложения
    //                 </div>
    //             </Card.Header>
    //             {visible ?
    //                 <div class="loader">Loading...</div>
    //                 :
    //                 <div></div>
    //             }
    //         </Card>
    //     )
    // }

    const getImg = (item, index) => {
        return (
            item.filesPreview?.map((innerItem, innerIndex) =>
                <span key={innerIndex} style={{ 'display': 'grid' }}>
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
        let count = item.filesPreview?.length
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

    const getHoverPreview = (item) => {
        const previews = item.filesPreview?.map(f => f.filename) || []
        if (item?.specOffer && displayOption == 1) {
            return (
                <HoverPreview images={previews} size={100}>
                    <FileEarmarkRichtext
                        className='earmarkRichText'
                        onClick={() => history.push(
                            CARDSPECOFFER + '/' + item?.specOffer + '/' +
                            item?.id
                        )} />
                </HoverPreview>
            )
        } else if (!item?.specOffer && displayOption == 1) {
            return (
                <FileEarmarkRichtext
                    className='earmarkRichTextGray'
                    onClick={() => history.push(
                        CARDSPECOFFER + '/' + item?.specOffer + '/' +
                        item?.id
                    )} />
            )

        } else if (item?.specOffer && displayOption == 2) {
            return (
                <HoverPreviewBig images={previews} size={100} />
            )
        } else if (!item?.specOffer && displayOption == 2) {
            return (
                <FileEarmarkRichtext
                    className='earmarkRichTextGray50'
                    onClick={() => history.push(
                        CARDSPECOFFER + '/' + item?.specOffer + '/' +
                        item?.id
                    )} />
            )
        }
    }
    const getCardImage = (item, index) => {
        if (!item?.specOffer && displayOption == 3)
            return (
                <div className='noSpecOfferWrapper'>
                    <FileEarmarkRichtext
                        className='earmarkRichTextGrayCenter'
                        onClick={() => history.push(
                            CARDSPECOFFER + '/' + item?.specOffer + '/' +
                            item?.id
                        )} />
                </div>
            )
        return (
            <>
                {
                    item?.filesPreview?.length == 0 || item.filesPreview == null ?
                        <img
                            className="fotoSpec"
                            src={noImage} />
                        :
                        getImg(item, index)
                }
            </>
        )
    }

    const redirect = (item) => {
        if (item?.specOffer) {
            history.push(CARDSPECOFFER + '/' + item?.specOffer + '/' + item?.id)
        } else if (user.isAuth) {
            history.push(CREATEPRICEASK + '/' + item?.userId + '/' + item?.id)
        } else {
            history.push(CREATEPRICEASKFIZ + '/' + item?.userId + '/' + item?.id)
        }
    }

    const tableRender = () => {
        if (loading && specOffers?.length == 0) {
            return (
                <SpecOffersSkeleton mode={displayOption} />
            )
        } else {
            return (
                <>
                    <div className={loading ? 'parentSpec loadingBlur' : 'parentSpec'}>
                        {displayOption == 3 && specOffers?.map((item, index) => {
                            return (
                                <div className='childSpecWrapper'>
                                    <div
                                        className='childSpec'
                                        onClick={() => redirect(item)}>
                                        <div
                                            className='cardWrapper'
                                            key={index}
                                            ref={el => imgs.current[index] = el}>
                                            {getCardImage(item, index)}
                                            {getItemSwitch(item, index)}
                                        </div>
                                        <div className='childSpecInfo'>
                                            <div className='specInfo'>
                                                <div className=" d-flex justify-content-between">
                                                    <span
                                                        className="specName"
                                                        onClick={() => redirect(item)}>
                                                        {item?.name?.length > 60 ?
                                                            `${item?.name?.substring(0, 60)}...`
                                                            :
                                                            item?.name
                                                        }
                                                    </span>
                                                </div>
                                                <div className="specPrice">
                                                    {item.price} ₽
                                                </div>
                                                <div className="specNameOrg">
                                                    {item.nameOrg}
                                                </div>
                                                <div className="specCloudy">
                                                    {getCategoryName(item.region, regionNodes).join(", ").length > 40 ?
                                                        `${getCategoryName(item.region, regionNodes).join(", ").substring(0, 40)}...`
                                                        :
                                                        getCategoryName(item.region, regionNodes).join(", ")
                                                    }
                                                </div>
                                                <div className="specCloudy">
                                                    {dateFormat(item.date, "dd/mm/yyyy HH:MM:ss")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {
                        (displayOption == 1 || displayOption == 2) &&
                        <div class={loading ? "table-responsive loadingBlur" : "table-responsive"}>
                            <Table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Артикул</th>
                                        <th>Наименование</th>
                                        <th><HandIndexThumb className='handIndexThumb' /></th>
                                        <th>Цена</th>
                                        <th>Остаток</th>
                                        <th>Ед.изм</th>
                                        <th>Организация</th>
                                        <th>Дата</th>
                                        <th>+</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specOffers?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item?.code}</td>
                                                <td>{item?.name}</td>
                                                <td>{getHoverPreview(item)}
                                                </td>
                                                <td>{item?.price}</td>
                                                <td>{item?.balance}</td>
                                                <td>{item?.measure}</td>
                                                <td> <a href="javascript:void(0)" onClick={() => history.push(ORGINFO + '/' + item?.userId)}>
                                                    {item?.userNameOrg}</a></td>
                                                <td>{dateFormat(item.Date, "dd/mm/yyyy")}</td>
                                                <td><img src={cart} style={{ "width": "25px", "height": "25px", "cursor": "pointer" }}
                                                    onClick={() => redirect(item)}
                                                /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    }
                </>
            )
        }
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
                    Предложения
                </div>
            </Card.Header>
            {visible ?
                <div>
                    <Form className="searchFormMenu searchFormMenuMain">
                        <Row>
                            <div className='inputGroupMenuSelect'>
                                <div className='captionMenuSelect'>Варианты отображения</div>
                                <img
                                    onClick={() => setDisplayOption(1)}
                                    src={table}
                                    className={displayOption == 1 ?
                                        'displayOptionIconSelected' : 'displayOptionIcon'}
                                />
                                <img
                                    onClick={() => setDisplayOption(2)}
                                    src={tableList}
                                    className={displayOption == 2 ?
                                        'displayOptionIconSelected' : 'displayOptionIcon'}
                                />
                                {/* <img
                                    onClick={() => setDisplayOption(3)}
                                    src={grid}
                                    className={displayOption == 3 ?
                                        'displayOptionIconSelected' : 'displayOptionIcon'}
                                /> */}
                                <ViewList
                                    onClick={() => setDisplayOption(3)}
                                    className={displayOption == 3 ?
                                        'displayOptionIconSelected' : 'displayOptionIcon'}
                                />
                            </div>
                            <div className='inputGroupMenuSelect'>
                                <div className='captionMenuSelect'>Показать только с карточками</div>
                                <div className='toggleWrapper'>
                                    {displayOnlySpecOffers ?
                                        <Toggle2On
                                            className='toggleSpecOffers'
                                            style={{ color: '#FF6A00' }}
                                            onClick={() => {
                                                setDisplayOnlySpecOffers(false)
                                                handleClickToggleSpecOffers()
                                            }}
                                        />
                                        :
                                        <Toggle2Off
                                            className='toggleSpecOffers'
                                            onClick={() => {
                                                setDisplayOnlySpecOffers(true)
                                                handleClickToggleSpecOffers()
                                            }}
                                        />
                                    }
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <div className='inputGroupMenuSelect'>
                                <div className='captionMenuSelect'>Период</div>
                                <InputGroup>
                                    <DatePicker
                                        locale="ru"
                                        selected={startDate}
                                        name="StartDateOffers"
                                        className='form-control datePicker'
                                        dateFormat="dd.MM.yyyy"
                                        onChange={
                                            (date) => {
                                                setStartDate(date)
                                                handleClickDate()
                                            }}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <DatePicker
                                        locale="ru"
                                        selected={endDate}
                                        name="EndDateOffers"
                                        className='form-control datePicker'
                                        dateFormat="dd.MM.yyyy"
                                        onChange={
                                            (date) => {
                                                setEndDate(date)
                                                handleClickDate()
                                            }}
                                    />
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
                    {tableRender()}
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