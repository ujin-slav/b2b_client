import { React, useRef, useEffect, useState } from 'react'
import SpecOfferService from '../services/SpecOfferService'
import { useHistory } from 'react-router-dom'
import { CARDSPECOFFER } from '../utils/routes'
import { getCategoryName } from '../utils/Convert'
import { regionNodes } from '../config/Region'
import dateFormat from "dateformat"
import MyImage from '../components/MyImage'
import noImage from "../icons/noImage.svg";

const SimilarSpecOffers = ({ redirect, id }) => {

    const [similarSpecOffers, setSimilarSpecOffers] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        SpecOfferService.getSimilarSpecOffer({
            id
        }).then((data) => {
            setSimilarSpecOffers(data)
            console.log(data)
        }).finally(() => setLoading(false))
    }, []);



    return (
        <>Hello</>
    )

}

export default SimilarSpecOffers;