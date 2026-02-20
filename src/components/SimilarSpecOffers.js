import { React, useRef, useEffect, useState } from 'react'
import SpecOfferService from '../services/SpecOfferService'
import { useHistory } from 'react-router-dom'
import { CARDSPECOFFER } from '../utils/routes'
import { getCategoryName } from '../utils/Convert'
import { regionNodes } from '../config/Region'
import dateFormat from "dateformat"
import MyImage from '../components/MyImage'
import noImage from "../icons/noImage.svg";

const SimilarSpecOffers = ({ redirect }) => {

    let limit = 10
    const [specOffers, setSpecOffers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(true)
    const [totalDocs, setTotalDocs] = useState(0)
    const [currentImg, setCurrentImg] = useState()
    const [page, setPage] = useState(1)
    const history = useHistory()
    const slider = useRef(null)
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [endDate, setEndDate] = useState(new Date());
    const imgs = useRef([])
    const maxPhoto = 5

    useEffect(() => {
        if (fetching) {
            if (specOffers.length === 0 || specOffers.length < totalDocs) {
                SpecOfferService.getSimilarSpecOffer({
                    limit, page: 1
                }).then((data) => {
                    if (Array.isArray(data.docs)) {
                        data.docs.map((item) => {
                            item.indexFoto = 0
                        })
                    }
                    setSpecOffers([...specOffers, ...data.docs])
                    setTotalDocs(data.totalDocs)
                    setPage(prevState => prevState + 1)
                }).finally(() => setLoading(false))
            }
        }
    }, [fetching]);

    let isDown = false
    let startX
    let scrollLeft

    const mouseDownHandler = (e) => {
        isDown = true
        startX = e.pageX - slider.current.offsetLeft
        scrollLeft = slider.current.scrollLeft

        slider.current.addEventListener('mouseup', mouseUpHandler)
        slider.current.addEventListener('mousemove', mouseMoveHandler)
    }

    const mouseUpHandler = (e) => {
        isDown = false

        slider.current.removeEventListener('mouseup', mouseUpHandler)
        slider.current.removeEventListener('mousemove', mouseMoveHandler)
    }

    const mouseMoveHandler = (e) => {
        if (!isDown) return
        e.preventDefault()
        const x = e.pageX - slider.current.offsetLeft
        const walk = (x - startX) * 2
        slider.current.scrollLeft = scrollLeft - walk
    }

    const mouseWheelHandler = (e) => {
        if (e.deltaY > 0) {
            slider.current.scrollLeft += 100;
            e.preventDefault();
        } else {
            slider.current.scrollLeft -= 100;
            e.preventDefault();
        }
    }

    const scrollHandler = (e) => {
        if ((e.target.scrollWidth - e.target.offsetWidth) < e.target.scrollLeft + 1) {
            setFetching(true)
        }
    }

    useEffect(() => {
        const element = slider.current;

        element.addEventListener('mousedown', mouseDownHandler)
        element.addEventListener('wheel', mouseWheelHandler)
        element.addEventListener('scroll', scrollHandler)
        return () => {
            element.removeEventListener('mousedown', mouseDownHandler)
            element.removeEventListener('wheel', mouseWheelHandler)
            element.addEventListener('scroll', scrollHandler)
        }
    }, [])

    const mouseMoveImgHandler = (e, item, index) => {
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
                        onMouseMove={(e) => mouseMoveImgHandler(e, item, index)}
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
        <div>
            <div className="specContact">
                <span>Похожие предложения</span>
            </div>
            <div class="parentCarousel" id="slider" ref={slider}>
                {specOffers.map((item, index) => {
                    return (
                        <div
                            onClick={(e) => redirect(e, item._id)}
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
                                <div className="specName">
                                    {item.Name}
                                </div>
                                <div className="specPrice">
                                    {item.Price} ₽
                                </div>
                                <div className="specNameOrg">
                                    {item.NameOrg}
                                </div>
                                <div className="specCloudy">
                                    {dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}

export default SimilarSpecOffers;