import React,{createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from './store/UserStore';
import AskStore from './store/AskStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertStore from './store/AlertStore';

export const Context  = createContext(null);

ReactDOM.render(
  <Context.Provider value={{
    user: new UserStore(),
    ask: new AskStore(),
    myalert: new AlertStore()
    }}>
    <App />
  </Context.Provider>,
  document.getElementById('root')
);
