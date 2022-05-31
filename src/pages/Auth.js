import { useEffect ,useContext, useState} from "react";
import LoginForm from "../components/LoginForm";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import UserService from "../services/UserService";
import {Card, Button, Form, Container, Row} from "react-bootstrap";
import {useHistory,NavLink} from 'react-router-dom';
import {B2B_ROUTE} from "../utils/routes";
import {REGISTRATION_ROUTE} from "../utils/routes";
import waiting from "../waiting.gif";

const App = observer(() => {
  const history = useHistory();
  const {user} = useContext(Context);
  const [email,setEmail] = useState('');
  const [errorString, setErrorString] = useState('');
  const [password,setPassword] = useState('');

  useEffect(() => {
    // if (localStorage.getItem('token')) {
    //     user.checkAuth()
    // }
    user.errorString = "";
  }, [user])

  if (user.isLoading){
    return  <p className="waiting">
              <img height="320" src={waiting}/>
            </p>
  }

  const login = async ()=> {
    try {
      let result = await user.login(email,password);
      if (user.isAuth===true) {
        history.push(B2B_ROUTE)
      }
      if (result.data?.errors){
        setErrorString(result.data?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (   
  <div>
     <Container
      className="d-flex justify-content-center align-items-center"
      style={{height: window.innerHeight - 54}}
       >
      <Card style={{width: 600}} className="p-5">
          <h2 className="m-auto">Авторизация</h2>
          <Form className="d-flex flex-column">
              <Form.Control
                  className="mt-3"
                  type="email"
                  placeholder="Введите ваш email..."
                  onChange={(e)=>setEmail(e.target.value)}
              />
              <Form.Control
                  className="mt-3"
                  type="password"
                  placeholder="Введите ваш пароль..."
                  onChange={(e)=>setPassword(e.target.value)}
              />
              <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                  <Button
                      variant={"outline-success"}
                      onClick={()=>login()}>
                    Войти
                  </Button>
                  <div>
                    Нет аккаунта ? <NavLink to="/registration">Зарегистрируйся!</NavLink>  
                  </div>

                   <NavLink to="/forgot">Забыл пароль</NavLink> 
              </Row>
              <div style={{ color:"red"}}>    
                  {errorString}
              </div>    
          </Form>
      </Card>
  </Container>

    </div>
  );
});

export default App;