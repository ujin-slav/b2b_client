import React, { useContext, useState } from 'react';
import { Context } from '../index';
import {observer} from "mobx-react-lite";

const LoginForm = observer(() => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {user} = useContext(Context);
    return (
        <div>
            <input placeholder="email" onChange={(e)=>setEmail(e.target.value)}></input>
            <input placeholder="password" onChange={(e)=>setPassword(e.target.value)}></input>
            <button onClick={()=>user.login(email,password)}>Login</button>
            <button onClick={()=>user.registration(email,password)}>Registration</button>
     
        </div>
    );
});

export default LoginForm;