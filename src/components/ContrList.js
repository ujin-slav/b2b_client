import React,{useContext,useEffect,useState,useRef} from 'react'
import {Form} from "react-bootstrap"
import {Context} from "../index";
import ContrService from '../services/ContrService';
import ReactPaginate from "react-paginate";
import { DashCircle } from 'react-bootstrap-icons';
import { observer } from 'mobx-react-lite';

const ContrList = observer(() => {

    const {myContr} = useContext(Context)
    const {user} = useContext(Context)
    const {myalert} = useContext(Context);
    const [listUser,setListUser] =  useState([]);
    const [currentPage,setCurrentPage] = useState(1)
    const [fetching,setFetching] = useState(true);
    const[totalDocs,setTotalDocs] = useState(0);
    const userList = useRef(null)
    let limit = 10

    useEffect(() => {
        if(fetching){
            if(listUser.length===0 || listUser.length<totalDocs) {
            ContrService.fetchContr({user:user.user.id,search:myContr.searchString,limit,page:currentPage}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setListUser([...listUser, ...data.docs])
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

    useEffect(() => {
        if(myContr.searching || myContr.fetchContr){
            ContrService.fetchContr({user:user.user.id,search:myContr.searchString,limit,page:1}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setListUser(data.docs);
                setCurrentPage(2)
            }).finally(()=>{myContr.setSearching(false);myContr.setFetchContr(false)})
        }
    },[myContr.searchString,myContr.fetchContr]);
    
    const scrollHandler = (e) =>{
        if((e.target.scrollHeight - e.target.offsetHeight)<e.target.scrollTop+1){
            setFetching(true)
        }
    }

    const delContr = async(item) =>{
        const result = await ContrService.delContr({id:item._id})
        console.log(item)
        if (result.errors){
            myalert.setMessage(result.message); 
        } else {
            myContr.setFetchContr(true)
        }
    }

    return (
        <div class="mt-3">
            <div class="titleLine">
                Мои контрагенты
            </div>
            <div class="userList overflow-auto" ref={userList}>
            {listUser?.map((item,index)=>
            <div key={index} class="userCardListUser">
                 <div class="userCardListUserFlex">
                        <DashCircle class="dashCircleContr" onClick={(e)=>delContr(item)}/>
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

});

export default ContrList;