import React,{useEffect, useContext} from 'react';
import {BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Context} from "./index";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import AlertCustom from './components/AlertCustom';

function App() {
  const {user} = useContext(Context);


  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        await user.checkAuth()
      }
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
