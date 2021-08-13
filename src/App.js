import React,{useEffect, useContext} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Context} from "./index";


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
