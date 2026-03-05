import { React, useEffect, useState, useRef, useContext } from 'react'
import { Card } from "react-bootstrap"
import { CaretDownFill, CaretUpFill, PlusCircle } from 'react-bootstrap-icons'
import CarouselService from '../services/CarouselService'
import ContrService from '../services/ContrService';
import { useHistory } from 'react-router-dom';
import { ORGINFO, CREATEPRICEASK, CREATEPRICEASKFIZ } from "../utils/routes";
import { Context } from "../index";
import { observer } from "mobx-react-lite"
import ReactPaginate from "react-paginate"
import CarouselSkeleton from '../components/CarouselSkeleton'
import MyImage from '../components/MyImage'

const Carousel = observer(() => {

    const [visible, setVisible] = useState(false)
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [carousel, setCarousel] = useState([])
    const { ask } = useContext(Context);
    const { user } = useContext(Context);
    const { myalert } = useContext(Context);
    const [fetching, setFetching] = useState(true);
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(10)

    useEffect(() => {
        if (visible) {
            setLoading(true)
            CarouselService.getCarousel({
                filterCat: ask.categoryFilter,
                filterRegion: ask.regionFilter,
                searchInn: ask.searchInn,
                limit,
                page: currentPage,
                user: user.user.id
            }).then((data) => {
                setCarousel(data.docs)
                setPageCount(data.totalPages)
                setCurrentPage(data.page)
            }).finally(() => setLoading(false))
        }}, [
            ask.categoryFilter, 
            ask.regionFilter, 
            ask.searchText, 
            ask.searchInn,
            fetching, 
            visible,
            user.isFetching,
    ])

    const fetchPage = async (currentPage) => {
        setCurrentPage(currentPage)
        setFetching(!fetching)
    }

    const handlePageClick = async (data) => {
        await fetchPage(data.selected + 1);
    }

    const addContr = async (item) => {
        const result = await ContrService.addContr({ contragent: item._id, userid: user.user.id })
        if (result.errors) {
            myalert.setMessage(result.message);
        } else {
            // myalert.setMessage("Успешно") 
            const newCarousel = carousel.map((el) => {
                if (el._id === item._id) {
                    el.contrIs = true
                }
                return el
            })
            setCarousel(newCarousel)
        }
    }

    const tableRender =()=>{
        if (loading && carousel?.length==0) {
            return (
                <CarouselSkeleton />
            )
        } else {
            return(
                <div class={loading ? "parentSpec loadingBlur" : "parentSpec"}>
                        {carousel.map((item, index) =>
                            <div key={index} class="childSpec">
                                <div>
                                    <a href="javascript:void(0)" onClick={() => history.push(ORGINFO + '/' + item?._id)}>
                                        <div>{item?.nameOrg}</div>
                                        <div>{item?.name}</div>
                                    </a>
                                </div>
                                <span className="mt-2 mb-3" style={{ 'display': 'grid' }}>
                                    <MyImage
                                        className={"fotoSpec"}
                                        disabled={false}
                                        src={process.env.REACT_APP_API_URL + `getlogo/` + item?.logo?.filename} />
                                    <div className="ImgSpecWrapper">
                                        <MyImage
                                            src={process.env.REACT_APP_API_URL + `getlogo/` + item?.logo?.filename}
                                            disabled={false}
                                            className={"fotoSpecBack"}
                                        />
                                    </div>
                                </span>
                                {item.contrIs === false ?
                                    <button
                                        className="myButtonMessage mt-0 w-100"
                                        onClick={(e) => addContr(item)}>
                                        Добавить в контрагенты
                                    </button>
                                    :
                                    <div></div>
                                }
                                <button
                                    className="myButtonMessage mt-0 w-100"
                                    onClick={() => {
                                        if (user.isAuth) {
                                            history.push(CREATEPRICEASK + '/' + item?._id)
                                        } else {
                                            history.push(CREATEPRICEASKFIZ + '/' + item?._id)
                                        }
                                    }}>
                                    Создать заявку
                                </button>
                            </div>
                        )}
                    </div>
            )
        }
    }

    return (
        <Card className='section sectionOffers'>
            <Card.Header className='sectionHeader headerAsks'
                onClick={() => setVisible(!visible)}>
                <div className='sectionName'>
                    {visible ?
                        <CaretUpFill className='caret' />
                        :
                        <CaretDownFill className='caret' />
                    }
                    Участники
                </div>
            </Card.Header>
            {visible ?
                <div>
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
    )
})

export default Carousel