import React,{useContext,useEffect,useState,useRef} from 'react'
import {
    Card,
    Col,
    Container,
    Table,
} from "react-bootstrap"
import {Context} from "../index";
import ContrService from '../services/ContrService';
import ReactPaginate from "react-paginate";
import { XCircle,PlusCircle } from 'react-bootstrap-icons';
import { observer } from 'mobx-react-lite';

const ContrList = observer(() => {

    const {myContr} = useContext(Context)
    const {user} = useContext(Context)
    const [listUser,setListUser] =  useState([]);
    const [currentPage,setCurrentPage] = useState(1)
    const[totalDocs,setTotalDocs] = useState(0);
    const [pageCount, setpageCount] = useState(0)
    const [fetching,setFetching] = useState(true);
    const [error, setError] = useState();
    const userList = useRef(null)
    let limit = 10

    useEffect(() => {
        if(fetching){
            if(listUser.length===0 || listUser.length<totalDocs) {
            ContrService.fetchContr({search:myContr.searchString,limit,page:currentPage}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setListUser([...listUser, ...data.docs]);
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

     const addContr = async(item)=>{
        const result = await ContrService.addContr({email:item.email,name:item.name,userid:user.user.id})
        if (result.errors){
            setError(result.message)
        } else {
            setFetching(true)
        }
    }
    
    const scrollHandler = (e) =>{
        if((e.target.scrollHeight - e.target.offsetHeight)<e.target.scrollTop+1){
            setFetching(true)
        }
    }

    return (
        <div class="userList overflow-auto" ref={userList}>
            {listUser?.map((item,index)=>
            <Card>
                <div>{index+1}</div>
                <div >{item.name}</div>
                <div>{item.nameOrg}</div>
                <div><PlusCircle color="#0D55FD" style={{"width": "25px", "height": "25px"}}
                    onClick={(e)=>{addContr(item)}} /></div>
            </Card>
            )}  
        </div>
    );

});

export default ContrList;