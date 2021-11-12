import React,{createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from './store/UserStore';
import AskStore from './store/AskStore';
import AskUserStore from './store/AskUserStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertStore from './store/AlertStore';
import QuestStore from './store/QuestStore';
import ChatStore from './store/ChatStore';
import OfferStore from './store/OfferStore';

export const Context  = createContext(null);

ReactDOM.render(
  <Context.Provider value={{
    user: new UserStore(),
    ask: new AskStore(),
    askUser: new AskUserStore(),
    offerUser: new OfferStore(),
    myalert: new AlertStore(),
    quests: new QuestStore(),
    chat: new ChatStore()
    }}>
    <App/>
  </Context.Provider>,
  document.getElementById('root')
);
