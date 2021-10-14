import React,{useState,useEffect,useContext} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Spinner,
    Alert,
    Card,
    InputGroup
  } from "react-bootstrap";
  import {Context} from "../index";
  import {observer} from "mobx-react-lite";
  import ContrService from '../services/ContrService';

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const MyContr = observer(() => {
    const [contragent,setContragent] = useState();
    const [listCont,setListContragent] =  useState([]);
    const [error, setError] = useState();
    const {user} = useContext(Context);  
    const [fetching,setFetching] = useState(true);

    useEffect(() => {
        fetchContr();
    },[user.user.id]);

    const fetchContr = () =>{
        ContrService.fetchContr(user.user.id).then((data)=>{
            let emailArray = []
            data.map((item)=>{
                emailArray.push(item.Email)
            })
            setListContragent(emailArray);
    })
    }

    const handleClick = () => {
        if(emailRegex.test(contragent)){
            ContrService.addContr({email:contragent,userid:user.user.id})
            setListContragent(((oldItems) => [...oldItems, contragent]));
            setError("")
        } else {
            setError("Неверный e-mail")
        }    
    }

    const deleteContr = async(email) => {
        try {
           const result = await ContrService.delContr({email,userid:user.user.id});
           if(result.deletedCount===1){
            fetchContr();
           }
        } catch (error) {
            console.log(error);
        }       
        
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                    <Form.Group className="mx-auto my-2">
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Введите e-mail контрагента"
                            onChange={(e)=>setContragent(e.target.value)}
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={()=>handleClick()}>
                            +
                        </Button>
                    </InputGroup>
                        <span className="errorMessage" style={{color:"red"}}>{error}</span>    
                    </Form.Group>
                    </Col>
                </Row>
            <Row>
                <Col className="mx-auto my-2">
                <div className="row gy-3">
                    {listCont.map((item,index)=><div key={index}>   
                        <InputGroup>
                            <Card>
                                <Card.Body>{item}</Card.Body>
                            </Card>
                            <Button variant="outline-secondary" id="button-addon2" onClick={()=>deleteContr(item)}>
                                    -
                            </Button>
                        </InputGroup>
                    </div>)}   
                </div>
                </Col>
             </Row>
             </Container>
        </div>
    );
});

export default MyContr; 