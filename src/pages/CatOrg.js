import React,{useEffect, useState} from 'react';
import OrgService from '../services/OrgService'

const CatOrg = () => {
    const[org,setOrg] = useState();

    useEffect(() => {
        OrgService.getOrg(1,3).then((data)=>{
              setOrg(data.docs);
              console.log(org)
          })
    },[]);
  

    return (
        <div>
             {org.map((item)=>{
             <div>
                 {item.INN}
             </div>})}
        </div>
    );
};

export default CatOrg;