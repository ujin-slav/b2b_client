import { React, useContext, useEffect, useState } from 'react';
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { Card, Form, InputGroup, Button, Col, Row } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { fetchLentStatus } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";
import { XCircle, Search } from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import { CARDASK, CARDPRICEASK } from '../utils/routes';
import DatePicker, { registerLocale } from 'react-datepicker'
import lentStatus from "../lentStatus.css"

const LentStatus = observer(() => {
  const [lent, setLent] = useState([])
  const { user } = useContext(Context)
  const { myalert } = useContext(Context)
  const { chat } = useContext(Context)
  const history = useHistory();
  const [searchInn, setSearchInn] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
  const [endDate, setEndDate] = useState(new Date());
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setLoading(true)
    fetchLentStatus({
      userId: user.user.id,
      limit,
      searchInn,
      searchStatus,
      page: currentPage,
      startDate,
      endDate
    }).then((data) => {
      setLent(data.docs);
      setPageCount(data.totalPages);
      setCurrentPage(data.page)
      chat.socket.emit("get_unread");
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

  const handleSearchInn = () => {
    setCurrentPage(1)
    setFetching(!fetching)
  }

  const handleSearchStatus = () => {
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

  const redirect = (item) => {
    if (item.PriceAsk) {
      history.push(CARDPRICEASK + '/' + item?.PriceAsk?._id)
    } else {
      history.push(CARDASK + '/' + item?.Ask?._id)
    }
  }

  return (
    <div className='container-mycontr mt-1'>
      <Form className="searchFormMenu">
        <Row>
          <InputGroup className='mt-2'>
            <Form.Control
              onChange={(e) => setSearchInn(e.target.value)}
              placeholder="Название или инн организации"
            />
            <button
              type="button"
              className="btn-search position-absolute top-50 translate-middle-y"
              style={{ right: '25px', zIndex: 5, background: 'transparent', border: 'none', padding: 0 }}
              onClick={() => handleSearchInn()}
              aria-label="Поиск"
            >
              <Search size={20} color="#6c757d" />
            </button>
            {/* <Button variant="outline-secondary" onClick={() => handleSearchInn()}>
              <Search color="black" style={{ "width": "20px", "height": "20px" }} />
            </Button> */}
          </InputGroup>
        </Row>
        <Row>
          <InputGroup className='mt-2'>
            <Form.Control
              onChange={(e) => setSearchStatus(e.target.value)}
              placeholder="Статус(в настоящий момент)"
            />
            <button
              type="button"
              className="btn-search position-absolute top-50 translate-middle-y"
              style={{ right: '25px', zIndex: 5, background: 'transparent', border: 'none', padding: 0 }}
              onClick={() => handleSearchStatus()}
              aria-label="Поиск"
            >
              <Search size={20} color="#6c757d" />
            </button>
            {/* <Button variant="outline-secondary" onClick={() => handleSearchStatus()}>
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
                    setStartDate(date)
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
      {!loading ?
        <div>
          <div class="lentStatus overflow-auto mt-2">
            {lent?.map((item, index) => (
              <div key={index} className="event-card">
                <div className="event-card__header">
                  <div className="event-card__left">
                    <div className="event-card__number">
                      №{dateFormat(item?.Ask?.Date || item?.PriceAsk?.Date, "ddmmyyyyHHMMss")}
                    </div>
                    <div className="event-card__date">
                      от {dateFormat(item?.Ask?.Date || item?.PriceAsk?.Date, "dd.MM.yyyy HH:mm")}
                    </div>
                  </div>
                  <div className="event-card__time">
                    {dateFormat(item?.Date, "dd.MM.yyyy HH:mm")}
                  </div>
                </div>

                <div className="event-card__body">
                  <div className="event-row">
                    <span className="event-label">Изменил статус:</span>
                    <span className="event-value">
                      {item?.Author?.name} {item?.Author?.nameOrg || ""}
                    </span>
                  </div>

                  <div className="event-row">
                    <span className="event-label">Было:</span>
                    <span className="event-value specCloudy">{item?.PrevStatus?.labelRu || "—"}</span>
                  </div>

                  <div className="event-row">
                    <span className="event-label">Стало:</span>
                    <span className="event-value event-value--highlight">
                      {item?.Ask?.Status?.Status?.labelRu || item?.PriceAsk?.Status?.Status?.labelRu || "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
        <>
          {[...Array(4)].map((_, index) => (
            <div key={`skeleton-${index}`} className="event-card event-card--skeleton">
              <div className="event-card__header">
                <div className="event-card__left">
                  <div className="skeleton skeleton-text skeleton-number" />
                  <div className="skeleton skeleton-text skeleton-small" />
                </div>
                <div className="skeleton skeleton-text skeleton-small" />
              </div>

              <div className="event-card__body">
                <div className="event-row">
                  <div className="skeleton skeleton-label" />
                  <div className="skeleton skeleton-value" />
                </div>
                <div className="event-row">
                  <div className="skeleton skeleton-label" />
                  <div className="skeleton skeleton-value" />
                </div>
                <div className="event-row">
                  <div className="skeleton skeleton-label" />
                  <div className="skeleton skeleton-value" />
                </div>
              </div>
            </div>
          ))}
        </>
      }
    </div>
  );
})

export default LentStatus;