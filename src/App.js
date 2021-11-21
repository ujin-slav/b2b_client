import React,{useEffect, useContext,createContext} from 'react';
import {BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Context} from "./index";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import AlertCustom from './components/AlertCustom';
import io from "socket.io-client";

export const SocketContext  = createContext(null);

function App() {
  const {user} = useContext(Context);
  const socket = io(`http://localhost:5000?userId=${localStorage.getItem('userId')}`)

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        await user.checkAuth()
      }
      localStorage.setItem('userId', user.user.id);
    })();
  }, []);

  useEffect(() => {
    return () => {
        if(socket){
           socket.disconnect(); 
        }
        };
    }, []);   

  return (
    <SocketContext.Provider value={{socket}}>
      <BrowserRouter>
        <NavBar />
        <AlertCustom/>
        <AppRouter/>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
