import React, { useContext,useEffect } from 'react';
import {Switch, Route, useLocation} from 'react-router-dom'
import {adminRoutes, authRoutes, bannedRoutes, publicRoutes} from '../utils/routes'
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation(); 

    if(!user.user.isAdmin){
        return(
            <Switch>
                {adminRoutes.map((element)=><Route key={element.path} path={element.path} component={element.Component} exact/>)}
            </Switch>
        )
    }

    return (
        <Switch>
            {user.user.banned && bannedRoutes.map((element)=><Route key={element.path} path={element.path} component={element.Component} exact/>)}
            {user.isAuth && authRoutes.map((element)=><Route key={element.path} path={element.path} component={element.Component} exact/>)}
            {publicRoutes.map((element)=><Route key={element.path} path={element.path} component={element.Component} exact/>)}
        </Switch>            
        
    );
});

export default AppRouter;