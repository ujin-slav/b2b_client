import React, {
    useState,
    useContext,
    useRef,
    useEffect
} from "react";
import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';
import { Form, Card, Button, } from "react-bootstrap";
import ReviewOrgService from '../services/ReviewOrgService';
import { Context } from "../index";
import AnswerCardReviewOrg from "../components/AnswerCardReviewOrg"
import { ArrowReturnRight, XCircle, XSquare } from 'react-bootstrap-icons';
import { observer } from "mobx-react-lite";
import dateFormat, { masks } from "dateformat";
import ReactPaginate from "react-paginate";
import bin from "../icons/bin.svg";
import { Star } from 'react-bootstrap-icons';
import GoogleDocsViewer from 'react-google-docs-viewer';
import StarsRatingShow from '../components/StarsRatingShow';
import skeletonReview from "../skeletonReview.css"

const ReviewAboutMe = observer(() => {

    const [text, setText] = useState('')
    const [visible, setVisible] = useState(false);
    const { user } = useContext(Context);
    const id = user.user.id
    const [fetch, setFetch] = useState(false);
    const [fetchAnswer, setFetchAnswer] = useState(false)
    const [review, setReview] = useState([]);
    const [loading, setLoading] = useState(true)
    const { myalert } = useContext(Context);
    const inputEl = useRef(null);
    const { chat } = useContext(Context)
    const [pageCount, setpageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1)
    let limit = 10

    useEffect(() => {
        setLoading(true)
        ReviewOrgService.fetchReviewOrg({ id, limit, page: currentPage, user: user.user.id }).then((response) => {
            if (response.status === 200) {
                setReview(response.data.docs)
                setFetch(false)
                setFetchAnswer(false)
                setpageCount(response.data.totalPages);
                console.log(response)
                chat.socket.emit("get_unread");
            }
        }).finally(() => setLoading(false))
    }, [fetch, fetchAnswer, visible, user.user]);

    const fetchComments = async (currentPage) => {
        ReviewOrgService.fetchReviewOrg({
            id, limit, page: currentPage
        }).then((data) => {
            setReview(data.docs)
            setpageCount(data.totalPages);
        }).finally(() => setLoading(false))
    };

    const handlePageClick = async (data) => {
        setCurrentPage(data.selected + 1)
        await fetchComments(data.selected + 1);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            Host: null,
            Text: text,
            Author: user.user.id,
            Org: id,
        }
        const result = await ReviewOrgService.addReviewOrg(data)
        if (result.data?.errors) {
            myalert.setMessage(result.data.message);
        } else {
            inputEl.current.value = "";
            setFetch(true)
            chat.socket.emit("unread_quest_mail", { data });
        }
    }

    const delReview = async (item) => {
        const result = await ReviewOrgService.delReviewOrg(item.ID);
        if (result.status === 200) {
            myalert.setMessage("Успешно");
        } else {
            myalert.setMessage(result.data.message);
        }
        setFetch(true)
    }

    const delAnswer = async (item) => {
        const result = await ReviewOrgService.delAnswerOrg(item._id);
        if (result.status === 200) {
            myalert.setMessage("Успешно");
        } else {
            myalert.setMessage(result.data.message);
        }
        setFetch(true)
    }

    if (loading) {
        return (
            <div className="container-mycontr mt-3">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="mb-4">
                        {/* Основная карточка отзыва */}
                        <Card className="reviewCard">
                            <Card.Header className="bg-body d-flex justify-content-between">
                                <div className="d-flex">
                                    {/* Аватар */}
                                    <div
                                        className="avatarChat skeleton-avatar"
                                        style={{ backgroundColor: '#e0e0e0', borderRadius: '50%' }}
                                    />
                                    <div>
                                        {/* Имя */}
                                        <div className="skeleton-text" style={{ width: '140px', height: '18px' }} />
                                        {/* Организация */}
                                        <div className="skeleton-text mt-1" style={{ width: '110px', height: '16px' }} />
                                        {/* Звёзды */}
                                        <div className="skeleton-stars mt-1" />
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    {/* Дата */}
                                    <div className="skeleton-text" style={{ width: '90px', height: '16px' }} />
                                    {/* Корзина */}
                                    <div className="skeleton-icon" />
                                </div>
                            </Card.Header>

                            <Card.Text className="m-3">
                                <div className="skeleton-text" style={{ width: '100%', height: '20px' }} />
                                <div className="skeleton-text mt-2" style={{ width: '85%', height: '20px' }} />
                                <div className="skeleton-text mt-2" style={{ width: '60%', height: '20px' }} />
                            </Card.Text>

                            {/* Кнопка "Ответить" */}
                            <div className="m-3">
                                <div className="skeleton-button" style={{ width: '100px', height: '32px' }} />
                            </div>
                        </Card>

                        {/* Ответы (иногда показываются) */}
                        {index % 2 === 0 && (
                            <Card className="answerReview mt-2 mb-2 reviewCard card">
                                <Card.Header className="bg-body d-flex justify-content-between">
                                    <div className="d-flex">
                                        <div
                                            className="avatarChat skeleton-avatar"
                                            style={{ backgroundColor: '#e0e0e0', borderRadius: '50%' }}
                                        />
                                        <div>
                                            <div className="skeleton-text" style={{ width: '120px', height: '18px' }} />
                                            <div className="skeleton-text mt-1" style={{ width: '100px', height: '16px' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="skeleton-text" style={{ width: '85px', height: '16px' }} />
                                    </div>
                                </Card.Header>
                                <Card.Text className="m-2">
                                    <div className="skeleton-text" style={{ width: '100%', height: '20px' }} />
                                    <div className="skeleton-text mt-2" style={{ width: '70%', height: '20px' }} />
                                </Card.Text>
                            </Card>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='container-mycontr mt-3'>
            {review?.map((item, index) =>
                <div key={index}>
                    <Card className="reviewCard">
                        <Card.Header className="bg-body d-flex justify-content-between">
                            <div className="d-flex">
                                <img className="avatarChat" src={process.env.REACT_APP_API_URL + `getlogo/` + item.Author?.logo?.filename} />
                                <div>
                                    <div>{item.Author?.name}</div>
                                    <div>{item.Author?.nameOrg}</div>
                                    <StarsRatingShow stars={item?.Stars} />
                                </div>
                            </div>
                            <div>
                                {item.Author?._id === user.user.id ?
                                    <img
                                        className="xcircleReview"
                                        src={bin}
                                        onClick={e => delReview(item)}
                                    />
                                    :
                                    <div></div>
                                }
                                <span className="dateAnswer">{dateFormat(item.Date, "dd/mm/yyyy HH:MM")}</span>
                            </div>
                        </Card.Header>
                        <Card.Text className="m-3">
                            <span style={{ fontSize: "18px" }}>{item.Text}</span>
                        </Card.Text>
                        {item?.Org === user.user.id ?
                            <AnswerCardReviewOrg
                                user={user}
                                item={item}
                                setFetchAnswer={setFetchAnswer}
                            />
                            :
                            <div></div>
                        }
                    </Card>
                    {item.Answer.map((item) => {
                        return (
                            <Card className="answerReview mt-2 mb-2 reviewCard card">
                                <Card.Header className="bg-body d-flex justify-content-between">
                                    <div className="d-flex">
                                        <img className="avatarChat" src={process.env.REACT_APP_API_URL + `getlogo/` + item.Author?.logo?.filename} />
                                        <div>
                                            <div>{item.Author?.name}</div>
                                            <div>{item.Author?.nameOrg}</div>
                                        </div>
                                    </div>
                                    <div className="position-static">
                                        {item.Org === user.user.id ?
                                            <img
                                                className="xcircleReview"
                                                src={bin}
                                                onClick={e => delAnswer(item)}
                                            />
                                            : <div></div>
                                        }
                                        <span className="dateAnswer">{dateFormat(item.Date, "dd/mm/yyyy HH:MM")}</span>
                                    </div>
                                </Card.Header>
                                <Card.Text className="m-2">
                                    {item.Text}
                                </Card.Text>
                            </Card>
                        )
                    })}
                </div>
            )}
            {review?.length !== 0 ?
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
        </div>
    );
});

export default ReviewAboutMe;