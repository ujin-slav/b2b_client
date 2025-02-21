import React from 'react';
import {Star} from 'react-bootstrap-icons';

const StarsRatingShow = ({starsFull=5, stars}) => {
    console.log(stars)
    return (
        <div>
            {(() => {
                        const arr = [];
                        for (let i = 0; i < starsFull; i++) {
                            arr.push(
                                <Star 
                                    className={i <= stars-1 ? "starRatingChosenShow" : "starRatingShow"}
                                />
                            );
                        }
                        return arr;
            })()}
        </div>
    );
};

export default StarsRatingShow;