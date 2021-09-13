import React, {useContext,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {LOGIN_ROUTE,CREATEASK} from "../utils/routes";
import {useHistory,NavLink  } from 'react-router-dom';
import { Button,Navbar,Nav, Alert } from "react-bootstrap";
import logo from '../b2blogo.png'
import profileLogo from '../profile.png'

const NavBar = observer(() => {

    const {user} = useContext(Context);
    const history = useHistory();
    const [show, setShow] = useState(false);

    const authCheck = (route) => {
        if(user.isAuth){
            history.push(route)
        } else {
            setShow(true)
        }
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark">
            <div className="navbar-collapse collapse justify-content-stretch" id="navbar6">
                <NavLink to="/">
                    <img
                        src={logo}
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                        alt = ""
                    />
                </NavLink>
                <Nav className="me-auto">
                    <Nav.Link to="/">Главная</Nav.Link>
                    <Nav.Link onClick={()=>authCheck(CREATEASK)} style={{color: 'white'}}>Создать заявку</Nav.Link>
                    <Nav.Link onClick={()=>authCheck(CREATEASK)} style={{color: 'white'}}>Мои заявки</Nav.Link>
                    <Nav.Link onClick={()=>authCheck(CREATEASK)} style={{color: 'white'}}>Мои предложения</Nav.Link>
                </Nav>
            </div>
            <NavLink to="/profile">
            <img
                        src={profileLogo}
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                        alt = ""
                    />
            </NavLink>
            <div className="navbar-nav ml-auto">
                <Nav className="me-auto">
                    {user.isAuth?
                        <Nav.Link onClick={()=>user.logout()}>Выйти</Nav.Link>
                    :
                        <Nav.Link onClick={()=>history.push(LOGIN_ROUTE)}>Войти</Nav.Link>     
                    }
                </Nav>
            </div>
            </Navbar>
            <Alert variant="warning" show={show} onClose={() => setShow(false)} dismissible>
                Вы не авторизованы
            </Alert>
        </div>    

    );
});

export default NavBar;