import React, { useContext,useEffect } from 'react';
import {Switch, Route, useLocation} from 'react-router-dom'
import {authRoutes, publicRoutes} from '../utils/routes'
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation(); 

    return (
        <Switch>
            {user.isAuth && authRoutes.map((element)=><Route key={element.path} path={element.path} component={element.Component} exact/>)}
            {publicRoutes.map((element)=><Route key={element.path} path={element.path} component={element.Component} exact/>)}
        </Switch>            
        
    );
});

export default AppRouter;