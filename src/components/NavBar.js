import React, {useContext} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {LOGIN_ROUTE,CREATEASK} from "../utils/routes";
import {useHistory,NavLink  } from 'react-router-dom';
import { Button } from 'bootstrap';
import logo from '../b2blogo.png'
import profileLogo from '../profile.png'

const NavBar = observer(() => {

    const {user} = useContext(Context);
    const history = useHistory();
    return (
        <div>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
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
                <button 
                    className="btn btn-success ml-auto mr-1"
                    onClick={()=>history.push(CREATEASK)}>
                    Создать заявку</button>
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
                {user.isAuth?
                    <button 
                        className="btn btn-success ml-auto mr-1"
                        onClick={()=>user.logout()}>
                        Выйти
                    </button>
                :
                    <button 
                        className="btn btn-success ml-auto mr-1 navbar-right"
                        onClick={()=>history.push(LOGIN_ROUTE)}>
                        Войти
                    </button>
                }    

            </div>
            </nav>
        </div>    

    );
});

export default NavBar;