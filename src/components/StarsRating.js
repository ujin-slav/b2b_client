import React,{useRef,useState} from 'react';
import {Star} from 'react-bootstrap-icons';
import {
    Form,
    InputGroup
 } from "react-bootstrap";

const StarsRating = ({amount=5, currentStar, setCurrentStar}) => {

    const [fixed, setFixed] = useState(false);

    const onMouseEnterHandler = (e,i) => {
        if(!fixed){
            setCurrentStar(i)
        }
    }

    const onMouseLeaveHandler = (e,i) => {
        if(!fixed){
            setCurrentStar()
        }
    }

    const onClickHandler = (e,i) => {
        setFixed(!fixed)
        setCurrentStar(i)
    }

    return (
        <div>
            <InputGroup className="mt-2 mb-2"> 
                <Form.Label className="mt-1">Оцените поставщика:</Form.Label>
                {(() => {
                        const arr = [];
                        for (let i = 0; i < amount; i++) {
                            arr.push(
                                <Star 
                                    className={currentStar >= i  ? "starRatingChosen" : "starRating"}
                                    onMouseEnter={(e)=>onMouseEnterHandler(e,i)}
                                    onMouseLeave={(e)=>onMouseLeaveHandler(e,i)}
                                    onClick={(e)=>onClickHandler(e,i)}
                                />
                            );
                        }
                        return arr;
                })()}
            </InputGroup>
        </div>
    );
};

export default StarsRating;