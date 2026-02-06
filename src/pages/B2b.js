import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import TableAskCard from "../components/TableAskCard";
import SearchForm from "../components/SearchForm";
import SpecOffersTable from "../components/SpecOffersTable";
import Prices from "../components/Price";
import Carousel from "../components/Carousel";

const B2b = observer(() => {

    let sourceElement = null
    const [sortedList, setSortedList] = useState([
        {
            id: "spec",
            title: "Специальные предложения",
            component: <SpecOffersTable />,
          },
          {
            id: "price",
            title: "Прайс",
            component: <Prices />,
          },
          {
            id: "participants",
            title: "Участники",
            component: <Carousel />,
          }
    ])

    const handleDragStart = (event) => {
        event.target.style.opacity = 0.5
        sourceElement = event.target
        event.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }

    const handleDragEnter = (event) => {
        event.target.classList.add('over')
    }

    const handleDragLeave = (event) => {
        event.target.classList.remove('over')
    }

    const handleDrop = (event) => {
        event.stopPropagation()
        if (sourceElement !== event.target) {
            const list = sortedList.filter((item, i) =>
                i.toString() !== sourceElement.id)
            const removed = sortedList.filter((item, i) =>
                i.toString() === sourceElement.id)[0]
            let insertAt = Number(event.target.id)

            let tempList = []

            if (insertAt >= list.length) {
                tempList = list.slice(0).concat(removed)
                setSortedList(tempList)
                event.target.classList.remove('over')
            } else
                if ((insertAt < list.length)) {
                    tempList = list.slice(0, insertAt).concat(removed)

                    const newList = tempList.concat(list.slice(
                        insertAt))

                    setSortedList(newList)
                    event.target.classList.remove('over')
                }
        } else
            event.target.classList.remove('over')
    }

    const handleDragEnd = (event) => {
        event.target.style.opacity = 1
    }

    const handleChange = (event) => {
        event.preventDefault()
        const list = sortedList.map((item, i) => {
            if (i !== Number(event.target.id)) {
                return item
            }
            else return event.target.value
        })
        setSortedList(list)
    }

    const listItems = () => {

        return sortedList.map((item, i) => {
            return (
                    <div
                        id={i}
                        draggable='true'
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        onChange={handleChange}
                    >
                    {item.component}
                    </div>    
            )
        }
        )
    }

    return (
        <div>
            <SearchForm />
            {listItems()}
        </div>
    );
});

export default B2b;