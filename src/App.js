import React,{useEffect, useContext,createContext,useRef} from 'react';
import {BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Context} from "./index";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import AlertCustom from './components/AlertCustom';
import io from "socket.io-client";

export const SocketContext  = createContext(null);

const App = ()=> {
  const {user} = useContext(Context);
  const {chat} = useContext(Context);
  var socket;

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        await user.checkAuth()
      }
      localStorage.setItem('userId', user.user.id);
    })();
  }, []);

  return (
    <SocketContext.Provider>
      <BrowserRouter>
        <NavBar/>
        <AlertCustom/>
        <AppRouter/>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
