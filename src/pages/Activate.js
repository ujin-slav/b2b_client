import React,{useEffect,useContext,useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import UserService from '../services/UserService';
import {Context} from "../index";
import {
    Container,
    Card
  } from "react-bootstrap";
  import {LOGIN_ROUTE} from "../utils/routes";

const Activate = () => {

    const {activationLink} = useParams();
    const [result,setResult] = useState("");
    const history = useHistory();  

    useEffect(() => {
    UserService.activateUser(activationLink).then((response)=>{
        console.log(response)
        if(response.status===200){
            setResult("Пользователь успешно активирован, теперь вы можете войти под своим логином/паролем")
            setTimeout(3000,()=>history.push(LOGIN_ROUTE));
        } else {
            setResult("Token не верен")
        }
    })  
    }, []);

    return (
        <div>
            <Container
                    className="d-flex justify-content-center align-items-center"
                    style={{height: window.innerHeight - 54}}
                    >
                <Card style={{width: 600}} className="p-5">
                    {result}
                </Card> 
            </Container>
        </div>
    );
};

export default Activate;