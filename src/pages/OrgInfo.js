import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {fetchUser} from '../http/askAPI';

const OrgInfo = () => {
    const {id} = useParams();
    const [org, setOrg] = useState();

    useEffect(() => {
        fetchUser(id).then((data)=>{
            setOrg(data)
            console.log(data)
        })

      },[]);

    return (
        <div>
            {org.NameOrg}
        </div>
    );
};

export default OrgInfo;