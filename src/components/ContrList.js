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
    const userList = useRef(null)
    let limit = 10

    useEffect(() => {
        if(myContr.fetchingContr){
            if(listUser.length===0 || listUser.length<totalDocs) {
            ContrService.fetchContr({user:user.user.id,search:myContr.searchString,limit,page:currentPage}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setListUser(data.docs);
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>myContr.setFetchingContr(false))
            }
        }  
    },[myContr.fetchingContr]);

    useEffect(() => {
        const element = userList.current;
        element.addEventListener('scroll',scrollHandler);
        return function(){
            element.removeEventListener('scroll',scrollHandler);
        }
    },[]);

    useEffect(() => {
        if(myContr.searchString!==""){
            ContrService.fetchContr({user:user.user.id,search:myContr.searchString,limit,page:1}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setListUser(data.docs);
                setCurrentPage(prevState=>prevState + 1)
                console.log(data)
            }).finally(()=>myContr.setFetchingContr(false))
        }
    },[myContr.searchString]);

    
    const scrollHandler = (e) =>{
        if((e.target.scrollHeight - e.target.offsetHeight)<e.target.scrollTop+1){
            myContr.setFetchingContr(true)
        }
    }

    return (
        <div class="userList overflow-auto" ref={userList}>
            {listUser?.map((item,index)=>
            <Card>
                <div>{index+1}</div>
                <div >{item?.name}</div>
                <div>{item?.nameOrg}</div>
            </Card>
            )}  
        </div>
    );

});

export default ContrList;