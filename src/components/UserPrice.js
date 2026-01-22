import React, { useState, useEffect, useRef, useContext } from 'react';
import { Card, Table, Form } from "react-bootstrap";
import PriceService from '../services/PriceService'
import dateFormat, { masks } from "dateformat";
import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';
import { CARDSPECOFFER, CREATESPECOFFER } from '../utils/routes';
import { ORGINFO, CREATEPRICEASK, CREATEPRICEASKFIZ, UPLOADPRICE } from "../utils/routes";
import { useHistory } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import { Cart4 } from 'react-bootstrap-icons';
import { Context } from "../index";
import cart from "../icons/cart.svg";

const UserPrice = ({ idorg, idprod }) => {

    const history = useHistory();
    const [loading, setLoading] = useState(true)
    const [readMoreName, setReadMoreName] = useState([])
    const [price, setPrice] = useState([]);
    const [width, setWidth] = useState()
    const [visible, setVisible] = useState(false);
    const [totalDocs, setTotalDocs] = useState(0);
    const [fetching, setFetching] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [pageCount, setpageCount] = useState(0);
    const input = useRef(null);
    const { user } = useContext(Context);
    let limit = 30

    const resizeWindow = () => {
        setWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', resizeWindow)
        setWidth(window.innerWidth)
        return () => {
            window.removeEventListener('resize', resizeWindow)
        }
    }, [])

    useEffect(() => {
        if (loading || fetching) {
            if (price.length === 0 || price.length < totalDocs) {
                if (idprod) {
                    PriceService.getPriceUnit(idprod).then((data) => {
                        setSearch(data.Name)
                        if (!data.errors) {
                            setVisible(true)
                            getPrice()
                        } else {
                            setLoading(false)
                        }
                    })
                } else {
                    if (visible) {
                        getPrice()
                    }
                }
            }
        }
    }, [fetching, visible]);

    const getPrice = () => {
        setLoading(true)
        PriceService.getMyPrice({ page: currentPage, limit, search, org: idorg }).then((data) => {
            if (data) {
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(data.page)
                setpageCount(data.totalPages);
            }
        }).finally(() => {
            setLoading(false)
            setFetching(false)
        })
    }

    const fetchComments = async (currentPage) => {
        PriceService.getMyPrice({ page: currentPage, limit, search, org: idorg }).then(
            (data) => {
                setPrice(data.docs)
                setTotalDocs(data.totalDocs);
                setPrice(data.docs)
                setCurrentPage(data.page)
                setpageCount(data.totalPages)
            }).finally(() => setLoading(false))
    };

    // const scrollHandler = (e) =>{
    //     if((e.target.documentElement.scrollHeight - 
    //         (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
    //             setFetching(true)
    //         }
    // }

    const handleSearch = (text) => {
        PriceService.getMyPrice({ page: 1, limit, search: text, org: idorg }).
            then((data) => {
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setpageCount(data.totalPages);
                setCurrentPage(1)
                setSearch(text)
            }).finally(
                () => setFetching(false)
            )
    }

    const handlePageClick = async (data) => {
        await fetchComments(data.selected + 1);
    };

    const readMoreHandler = (id) => {
        if (readMoreName.includes(id)) {
            setReadMoreName(readMoreName.filter(el => el !== id))
        } else {
            setReadMoreName([...readMoreName, id])
        }
    }

    const readMoreGetText = (item) => {
        if (item.Name.length > 50) {
            return (
                <div>
                    {readMoreName.includes(item._id) ? item.Name : `${item.Name.substring(0, 50)}...`}
                    <a href="javascript:void(0)" onClick={() => readMoreHandler(item._id)}>
                        {readMoreName.includes(item._id) ? 'Свернуть' : 'Показать больше'} </a>
                </div>
            )
        } else {
            return (
                <div>
                    {item.Name}
                </div>
            )
        }
    }

    return (
        <Card className='section'>
            <Card.Header className='sectionHeader headerPrices'
                onClick={() => setVisible(!visible)}>
                <div className='sectionName'>
                    {visible ?
                        <CaretUpFill className='caret' />
                        :
                        <CaretDownFill className='caret' />
                    }
                    Прайс
                </div>
            </Card.Header>
            {visible ?
                <div>
                    
                    <div class="table-responsive">
                        <Table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Артикул</th>
                                    <th>Наименование</th>
                                    <th>Цена</th>
                                    <th>Остаток</th>
                                    <th>Ед.изм</th>
                                    <th>Дата</th>
                                    <th>+</th>
                                </tr>
                            </thead>
                            <tbody>
                                {price?.map((item, index) =>

                                    <tr key={index}>
                                        <td>{item?.code}</td>
                                        <td>{item?.name}</td>
                                        <td>{item?.price}</td>
                                        <td>{item?.balance}</td>
                                        <td>{item?.measure}</td>
                                        <td>{dateFormat(item.Date, "dd/mm/yyyy")}</td>
                                        <td><img src={cart} style={{ "width": "25px", "height": "25px", "cursor": "pointer" }}
                                            onClick={() => {
                                                if (user.isAuth) {
                                                    history.push(CREATEPRICEASK + '/' + item?.userId + '/' + item?.id)
                                                } else {
                                                    history.push(CREATEPRICEASKFIZ + '/' + item?.userId + '/' + item?.id)
                                                }
                                            }}
                                        /></td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
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
};

export default UserPrice;