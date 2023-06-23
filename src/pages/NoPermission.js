import React from 'react';
import {
    Container,
    Card
  } from "react-bootstrap";

const NoPermission = () => {
    return (
        <div>
            <Container
                    className="d-flex justify-content-center align-items-center"
                    style={{height: window.innerHeight - 54}}
                    >
                <Card style={{width: 600}} className="p-5 ">
                    <h5>Нет доступа.</h5>
                </Card> 
            </Container>
        </div>
    );
};

export default NoPermission;