import React from 'react'
import { Table } from 'react-bootstrap'
import "../skeletonSpecOffers.css"

export const CarouselSkeleton = ({ mode, count = 10}) => {

    return (
      <div className={`parentSpec`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={`card-skel-${i}`} className="childSpec skeleton">
            <div className="skeleton-image" />

            <div className="skeleton-switch" />

            <div className="specInfo">
              <div className="d-flex justify-content-between">
                <div className="skeleton-text skeleton-name" />
              </div>
              <div className="skeleton-text skeleton-price" />
              <div className="skeleton-text skeleton-org" />
              <div className="skeleton-text skeleton-cloudy-long" />
              <div className="skeleton-text skeleton-cloudy-short" />
            </div>
          </div>
        ))}
      </div>
    );

  return null;
};

export default CarouselSkeleton;