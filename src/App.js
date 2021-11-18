import React,{useEffect, useContext} from 'react';
import {BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Context} from "./index";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import AlertCustom from './components/AlertCustom';
import SocketIOFileClient from 'socket.io-file-client';
import io from "socket.io-client";

function App() {
  const {user} = useContext(Context);
  const {socket} =  useContext(Context)

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        await user.checkAuth()
      }
      socket.setSocket(io(`http://localhost:5000?userId=${user.user.id}`));
      socket.setUploader(new SocketIOFileClient(socket.getSocket()));
    })();
  }, []);

  return (
    <BrowserRouter>
       <NavBar />
       <AlertCustom/>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;
