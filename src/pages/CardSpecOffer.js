import React,{useState,useEffect,useContext} from 'react';
import {Container,Col,Row} from "react-bootstrap";
import SpecOfferService from '../services/SpecOfferService'
import {useParams} from 'react-router-dom';
import waiting from "../waiting.gif";
import {observer} from "mobx-react-lite";

const CardSpecOffer = observer(() => {
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const [fotoFocus, setFotoFocus] = useState(0);
    const [specOffer, setSpecOffer] = useState([]);

    useEffect(() => {
        SpecOfferService.getSpecOfferId({id}).then((data)=>{
            setSpecOffer(data)
            console.log(data)
        }).finally(()=>setLoading(false))     
    },[specOffer]);

    if (loading){
        return(
            <p className="waiting">
                <img height="320" src={waiting}/>
            </p>
        )
    }
    const images = [
    { source: process.env.REACT_APP_API_URL + `getpic/` + specOffer?.Files[0].filename },
    { source: process.env.REACT_APP_API_URL + `getpic/` + specOffer?.Files[1].filename },
    { source: process.env.REACT_APP_API_URL + `getpic/` + specOffer?.Files[2].filename }
]

    return (
        <Container className="mx-auto my-4">
           <Row>
            <Col>
                <img className='fotoSpecCard' 
                    src={process.env.REACT_APP_API_URL + `getpic/` + specOffer?.Files[fotoFocus].filename}/>
                 <div className='parentSpec'>
                {specOffer.Files.map((item,index)=>
                    <div key={index} className='childSpec'>
                        <img className='miniFotoSpecCard'
                        onClick={()=>setFotoFocus(index)} 
                        src={process.env.REACT_APP_API_URL + `getpic/` + item.filename}/>
                    </div>
                )}
                </div>
            </Col>
            <Col>           
                2
            </Col>
           </Row> 
        </Container>
    );
});

export default CardSpecOffer;