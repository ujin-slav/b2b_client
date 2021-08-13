import React, { useContext } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import {authRoutes, publicRoutes} from '../utils/routes'
import {Context} from "../index";

const AppRouter = () => {
    const {user} = useContext(Context)
    return (
        <Switch>
            {user.isAuth && authRoutes.map((element)=><Route key={element.path} path={element.path} component={element.Component} exact/>)}
            {publicRoutes.map((element)=><Route key={element.path} path={element.path} component={element.Component} exact/>)}

        </Switch>            
        
    );
};

export default AppRouter;