import React, {useContext} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {LOGIN_ROUTE,CREATEASK} from "../utils/routes";
import {useHistory} from 'react-router-dom';
import { Button } from 'bootstrap';

const NavBar = observer(() => {

    const {user} = useContext(Context);
    const history = useHistory();
    return (
        <div>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <div class="navbar-collapse collapse justify-content-stretch" id="navbar6">
                <button 
                    class="btn btn-success ml-auto mr-1"
                    onClick={()=>history.push(CREATEASK)}>
                    Создать заявку</button>
            </div>
            <div class="navbar-nav ml-auto">
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