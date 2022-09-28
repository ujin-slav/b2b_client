import React,{useState,useEffect,useContext,useRef} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Table,
    Alert,
    Card,
    InputGroup
  } from "react-bootstrap";
  import {Context} from "../index";
  import ContrService from '../services/ContrService';

const EmailList = ({checked,setChecked}) => {
    const [listCont,setListContragent] =  useState([]);
    const [search,setSearch] =  useState("");
    const [fetching,setFetching] = useState(true);
    const [currentPage,setCurrentPage] = useState(1)
    const[totalDocs,setTotalDocs] = useState(0);
    const {user} = useContext(Context); 
    const userList = useRef(null) 
    let limit = 10
    
    useEffect(() => {
        if(fetching){
            if(listCont.length===0 || listCont.length<totalDocs) {
            ContrService.fetchContr({user:user.user.id,search:search,limit,page:currentPage}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setListContragent([...listCont, ...data.docs])
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>setFetching(false))
            }
        }  
    },[fetching]);

    useEffect(() => {
        const element = userList.current;
        element.addEventListener('scroll',scrollHandler);
        return function(){
            element.removeEventListener('scroll',scrollHandler);
        }
    },[]);

    const handleSearch = (e) =>{
        ContrService.fetchContr({user:user.user.id,search:e.target.value,limit,page:1}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setListContragent(data.docs)
                setCurrentPage(prevState=>prevState + 1)
                setSearch(e.target.value)
        }).finally(
            ()=>setFetching(false)
        )
    }

    const scrollHandler = (e) =>{
        if((e.target.scrollHeight - e.target.offsetHeight)<e.target.scrollTop+1){
            setFetching(true)
        }
    }

    const checkedHandler=(e,item)=>{
        console.log(item)
        if(e.target.checked){
            setChecked([...checked, item]);
        }else{
            setChecked(checked.filter(el => el._id !== item._id));
        }
    }

    return (
        <div>Добавлять контрагентов вы можете в разделе контрагенты в основном меню.
              <Form.Control
                            placeholder="Начните набирать инн или название организации"
                            onChange={handleSearch}
                />
            <div class="userList overflow-auto" ref={userList}>
            {listCont?.map((item,index)=>
            <div key={index} class="userCardListUser">
                 <div class="userCardListUserFlex">
                        <Form.Check
                                name="email"
                                type="checkbox"
                                defaultChecked={checked.filter(i => i._id === item._id).length > 0}
                                onChange={(e)=>checkedHandler(e,item)}
                        />
                    <div>
                        <div >{item.name}</div>
                        <div>{item.nameOrg}</div>
                    </div>
                </div>
            </div>
            )}  
        </div>
        </div>
    );
};

export default EmailList; 