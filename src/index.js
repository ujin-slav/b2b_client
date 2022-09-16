import React,{createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from './store/UserStore';
import AskStore from './store/AskStore';
import AskUserStore from './store/AskUserStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styleMenu.css';
import AlertStore from './store/AlertStore';
import QuestStore from './store/QuestStore';
import MyContrStore from './store/MyContrStore';
import OfferStore from './store/OfferStore';
import SocketStore from './store/SocketStore';

export const Context  = createContext(null);
const chat = new SocketStore();

ReactDOM.render(
  <Context.Provider value={{
    chat,
    user: new UserStore(chat),
    ask: new AskStore(),
    askUser: new AskUserStore(),
    offerUser: new OfferStore(),
    myalert: new AlertStore(),
    quests: new QuestStore(),
    myContr: new MyContrStore()
    }}>
    <App/>
  </Context.Provider>,
  document.getElementById('root')
);
