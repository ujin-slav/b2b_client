import { React, useContext, useEffect, useState } from 'react';
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { Card, Form, InputGroup, Button, Col, Row } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { MODIFYPRICEASK, CARDPRICEASK } from '../utils/routes';
import ru from "date-fns/locale/ru"
import "../style.css";
import ReactPaginate from "react-paginate";
import ModalAlert from '../components/ModalAlert';
import AskService from '../services/AskService'
import { XCircle, Search } from 'react-bootstrap-icons';
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'
import DatePicker, { registerLocale } from 'react-datepicker'
import {
  Calendar3
} from 'react-bootstrap-icons';
import '../orderCard.css'
import cartColor from "../icons/cartColor.svg";

const InvitedPriceAsk = observer(() => {
  registerLocale("ru", ru)

  const { user } = useContext(Context);
  const { chat } = useContext(Context)
  const [askPriceUser, setAskPriceUser] = useState([])
  const { myalert } = useContext(Context);
  const [deleteId, setDeleteId] = useState();
  const [modalActive, setModalActive] = useState(false);
  const history = useHistory();
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInn, setSearchInn] = useState("");
  const [searchComment, setSearchComment] = useState("");
  const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setLoading(true)
    PriceService.getAskPrice({
      to: user.user.id,
      limit,
      searchInn,
      page: currentPage,
      startDate,
      endDate
    }).then((data) => {
      setAskPriceUser(data.docs);
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

  const deletePriceAsk = async () => {
    const result = await PriceService.deletePriceAsk(deleteId);
    if (result.status === 200) {
      myalert.setMessage("Успешно");
      setLoading(!loading)
    } else {
      myalert.setMessage(result.data.message);
    }
  }

  const handlePageClick = async (data) => {
    await fetchPage(data.selected + 1);
  }

  const handleSearchInn = () => {
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

  return (
    <div>
      <Form className="searchFormMenu">
        <Row>
          <InputGroup className='mt-2'>
            <Form.Control
              onChange={(e) => setSearchInn(e.target.value)}
              placeholder="Название или инн организации"
            />
            <Button variant="outline-secondary" onClick={() => handleSearchInn()}>
              <Search color="black" style={{ "width": "20px", "height": "20px" }} />
            </Button>
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
                onChange={(date) => {
                  setStartDate(date)
                  handleClickDate()
                }}
              />
              {/* <Button
                variant="outline-secondary"
                className='buttonSearchDataPicker'
                onClick={() => handleClickDate()}
              >
                <Search color="black" style={{ "width": "20px", "height": "20px" }} />
              </Button> */}
            </InputGroup>
            <InputGroup>
              <DatePicker
                locale="ru"
                selected={endDate}
                name="EndDateOffers"
                className='form-control datePicker'
                dateFormat="dd.MM.yyyy"
                onChange={(date) => {
                  setEndDate(date)
                  handleClickDate()
                }}
              />
              {/* <Button
                variant="outline-secondary"
                className='buttonSearchDataPicker'
                onClick={() => handleClickDate()}
              >
                <Search color="black" style={{ "width": "20px", "height": "20px" }} />
              </Button> */}
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
          <div className='parentSpecAsk'>
            {askPriceUser?.map((item, index) =>
              <div key={index} className='childSpecAsk'>
                <div
                  className="order-card"
                  onClick={() => history.push(`${CARDPRICEASK}/${item._id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="order-card__header">
                    <div className="order-card__icon">
                    <img src={cartColor} />
                    </div>

                    <div className="order-card__amount text-right">
                      {item?.Sum?.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>

                  <div className="order-card__body">
                    <div className="order-card__number">
                      #{dateFormat(item?.Date, "ddmmyyyyHHMMss")}
                    </div>

                    <div className="order-card__person">
                      {item?.FIZ
                        ? `${item.NameFiz || ''} ${item.EmailFiz || ''}`
                        : `${item?.Author?.name || ''} ${item?.Author?.nameOrg || ''}`}
                    </div>

                    <div className="order-card__date text-muted small mt-1">
                      <Calendar3 size={20}/>
                      <span className='mx-2'>
                        {dateFormat(item?.Date, "dd.MM.yyyy HH:mm:ss")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {askPriceUser?.length !== 0 ?
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
            setActive={setModalActive} funRes={deletePriceAsk} />
        </div>
        :
        <div class="loader">Loading...</div>
      }
    </div>
  );
});

export default InvitedPriceAsk;