import React from 'react'
import { Table } from 'react-bootstrap'
import "../skeletonSpecOffers.css"
import {
    HandIndexThumb
} from 'react-bootstrap-icons'

export const SpecOffersSkeleton = ({ mode, count = 10}) => {
  if (mode === 3) {
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
  }

  // mode 1 или 2 — таблица
  if (mode === 1 || mode === 2) {
    return (
      <div className={`table-responsive`}>
        <Table className="table table-hover">
          <thead>
            <tr>
              <th><div className="skeleton-cell skeleton-short" /></th>
              <th><div className="skeleton-cell skeleton-long" /></th>
              <th><div className="skeleton-cell skeleton-icon"/></th>
              <th><div className="skeleton-cell skeleton-price"/></th>
              <th><div className="skeleton-cell skeleton-tiny"/></th>
              <th><div className="skeleton-cell skeleton-tiny" /></th>
              <th><div className="skeleton-cell skeleton-medium" /></th>
              <th><div className="skeleton-cell skeleton-date" /></th>
              <th><div className="skeleton-cell skeleton-icon" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }).map((_, i) => (
              <tr key={`row-skel-${i}`} className="skeleton-row">
                <td><div className="skeleton-cell skeleton-short" /></td>
                <td><div className="skeleton-cell skeleton-long" /></td>
                <td><div className="skeleton-cell skeleton-icon" /></td>
                <td><div className="skeleton-cell skeleton-price" /></td>
                <td><div className="skeleton-cell skeleton-short" /></td>
                <td><div className="skeleton-cell skeleton-tiny" /></td>
                <td><div className="skeleton-cell skeleton-medium" /></td>
                <td><div className="skeleton-cell skeleton-date" /></td>
                <td><div className="skeleton-cell skeleton-icon" /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  return null;
};

export default SpecOffersSkeleton;