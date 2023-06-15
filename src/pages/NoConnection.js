import React from 'react';

const NoConnection = () => {
    return (
        <div className='noConnection'>
            Нет соединения c сервером
            <div>(попробуйте перезагрузить страницу).</div>
        </div>
    );
};

export default NoConnection;