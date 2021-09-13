import React,{useEffect, useContext} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Context} from "./index";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const {user} = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      user.checkAuth()
    }
  }, [user])

  return (
    <BrowserRouter>
       <NavBar />
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;
