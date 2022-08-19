import React,{useState,useEffect,useContext} from 'react';

const OrderStatus = () => {

    const[status,setStatus] = useState(1)

    const increment=()=>{
        setStatus(status+1)
    }

    const decrement=()=>{
        setStatus(status-1)
    }


    return (
        <div>
            <div className='statusRingContainer'>
                <div className='statusRing'>
                    <span className='statusNumber'>1</span>
                </div>
                <div className='nameStatus'>
                    <span>Заявка доставлена продавцу</span>
                </div>
            </div>
            <div className='statusLineContainer'>
                <div className='statusLine'>
                </div>
            </div>
            <div className='statusRingContainer'>
                <div className={status>1 ? "statusRingActive" : "statusRing"}>
                    <span className={status>1 ? "statusNumberActive" : "statusNumber"}>2</span>
                </div>
                <div className='nameStatus'>
                    <span>В обработке</span>
                </div>
            </div>
            <div className='statusLineContainer'>
                <div className='statusLine'>
                </div>
            </div>
            <div className='statusRingContainer'>
                <div className={status>2 ? "statusRingActive" : "statusRing"}>
                    <span className={status>2 ? "statusNumberActive" : "statusNumber"}>3</span>
                </div>
                <div className='nameStatus'>
                    <span>В обработке</span>
                </div>
            </div>
            <div className='statusLineContainer'>
                <div className='statusLine'>
                </div>
            </div>
            <div className='statusRingContainer'>
                <div className={status>3 ? "statusRingActive" : "statusRing"}>
                    <span className={status>3 ? "statusNumberActive" : "statusNumber"}>4</span>
                </div>
                <div className='nameStatus'>
                    <span>В обработке</span>
                </div>
            </div>
            <div className='statusLineContainer'>
                <div className='statusLine'>
                </div>
            </div>
            <div className='statusRingContainer'>
                <div className={status>4 ? "statusRingActive" : "statusRing"}>
                    <span className={status>4 ? "statusNumberActive" : "statusNumber"}>5</span>
                </div>
                <div className='nameStatus'>
                    <span>В обработке</span>
                </div>
            </div>
        <button onClick={()=>decrement()}>-</button>
        <button onClick={()=>increment()}>+</button>
        </div>
    );
};

export default OrderStatus;