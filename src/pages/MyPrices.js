import { React, useContext, useEffect, useState } from 'react';
import { Card, Form, InputGroup, Button, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import SpecOfferService from '../services/SpecOfferService'
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Context } from "../index";
import PriceService from '../services/PriceService'
import dateFormat from "dateformat";
import { Search } from 'react-bootstrap-icons';
import DatePicker, { registerLocale } from 'react-datepicker'
import { getCategoryName } from '../utils/Convert'
import { regionNodes } from '../config/Region';
import CardSpecOffer from '../pages/CardSpecOffer';
import { CARDSPECOFFER, CREATEPRICE, MYPRICE } from '../utils/routes';
import ReactPaginate from "react-paginate";
import { PlusCircleFill, XCircle, Pen } from 'react-bootstrap-icons';
import ModalAlert from '../components/ModalAlert';
import bin from "../icons/bin.svg";
import excel from "../icons/excel.svg";
import myPrices from "../myPrices.css"


const MyPrices = observer(() => {

    const [prices, setPrices] = useState([]);
    const { myalert } = useContext(Context);
    const history = useHistory();
    const [modalActive, setModalActive] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [pageCount, setPageCount] = useState(0);
    const { user } = useContext(Context);
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const [limit, setLimit] = useState(10)

    useEffect(() => {
        setLoading(true)
        PriceService.getPricesUser({
            id: user.user.id,
            limit,
            search,
            page: currentPage,
            startDate,
            endDate
        }).then((data) => {
            setPrices(data.docs);
            setPageCount(data.totalPages);
            setCurrentPage(data.page)
        }).finally(
            () => setLoading(false)
        )
    }, [fetching]);

    const fetchPage = async (currentPage) => {
        setCurrentPage(currentPage)
        setFetching(!fetching)
    };

    const handlePageClick = async (data) => {
        await fetchPage(data.selected + 1);
    }

    const handleSearch = () => {
        setCurrentPage(1)
        setFetching(!fetching)
    }

    const handleClickDate = () => {
        setCurrentPage(1)
        setFetching(!fetching)
    }

    const handleSelect = (value) => {
        setCurrentPage(1)
        setLimit(value)
        setFetching(!fetching)
    }

    const deletePrice = async () => {
        const result = await PriceService.clearPrice({ org: user.user.id, priceId: deleteId });
        if (result.status === 200) {
            myalert.setMessage("Успешно");
            setCurrentPage(1)
            setFetching(!fetching)
        } else {
            myalert.setMessage(result.data.message);
        }
    }

    return (
        <div>
            <Form className="searchFormMenu">
                <Row>
                    <InputGroup>
                        <Form.Control
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Текст или название прайса"
                        />
                        <button
                            type="button"
                            className="btn-search position-absolute top-50 translate-middle-y"
                            style={{ right: '25px', zIndex: 5, background: 'transparent', border: 'none', padding: 0 }}
                            onClick={() => handleSearch()}
                            aria-label="Поиск"
                        >
                            <Search size={20} color="#6c757d" />
                        </button>
                        {/* <Button variant="outline-secondary" onClick={() => handleSearch()}>
                            <Search color="black" style={{ "width": "20px", "height": "20px" }} />
                        </Button> */}
                    </InputGroup>
                </Row>
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
                    </div>
                </Row>
            </Form>
            <PlusCircleFill onClick={() => history.push(CREATEPRICE)} className="addSpecOffer" />
            <span className="createNewOfferText">Загрузить новый прайс</span>
            {!loading ?
                <div>
                    <div className='parentPrices'>
                        {prices?.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => history.push(MYPRICE + '/' + item._id)}
                                className="price-card"
                            >
                                <div className="price-card__header">
                                    <div className="price-card__icon">
                                        <img src={excel} alt="Excel" className="price-card__excel-icon" />
                                    </div>
                                    <div className="price-card__info">
                                        <div className="price-card__name">{item.Name}</div>
                                        <div className="price-card__org">{item.NameOrg}</div>
                                    </div>
                                </div>

                                <div className="price-card__body">
                                    <div className="price-row">
                                        <span className="price-label">Регион(ы):</span>
                                        <span className="price-value">
                                            {getCategoryName(item.Region, regionNodes).join(", ").length > 60
                                                ? `${getCategoryName(item.Region, regionNodes).join(", ").substring(0, 60)}…`
                                                : getCategoryName(item.Region, regionNodes).join(", ")}
                                        </span>
                                    </div>

                                    <div className="price-row">
                                        <span className="price-label">Загружен:</span>
                                        <span className="price-value price-date">
                                            {dateFormat(item.Date, "dd.MM.yyyy HH:mm")}
                                        </span>
                                    </div>
                                </div>

                                <div className="price-card__footer">
                                    <button
                                        className="myButtonMessage price-delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalActive(true);
                                            setDeleteId(item._id);
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {prices?.length !== 0 ?
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
                        :
                        <div></div>}
                    <ModalAlert header="Вы действительно хотите удалить"
                        active={modalActive}
                        setActive={setModalActive} funRes={deletePrice} />
                </div>
                :
                <div class="loader">Loading...</div>
            }
        </div>
    );
});

export default MyPrices;