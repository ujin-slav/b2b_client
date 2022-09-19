import React from 'react';
import ContrList from '../components/ContrList';
import SearchMyContr from '../components/SearchMyContr';
import UserList from '../components/UserList';

const MyContr = () => {
    return (
        <div className='container-mycontr'>
            <SearchMyContr/>
            <UserList/>  
            <ContrList/>
        </div>
    );
};

export default MyContr;