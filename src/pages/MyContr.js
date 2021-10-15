import React,{useState,useEffect,useContext} from 'react';
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
  import { XCircle } from 'react-bootstrap-icons';
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
    const {myalert} = useContext(Context);
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

    const handleClick = async() => {
        if(emailRegex.test(contragent)){
            const result = await ContrService.addContr({email:contragent,userid:user.user.id})
            console.log(result)
            if (result.errors){
                setError(result.message)
            } else {
                setListContragent(((oldItems) => [...oldItems, contragent]));
                setError("")
            }
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
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>E-mail</th>
                        <th>Удалить</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listCont.map((item,index)=>
                    <tr>
                        <td>{index+1}</td>
                        <td>{item}</td>
                        <td><XCircle color="red" style={{"width": "25px", "height": "25px"}}
                            onClick={(e)=>{deleteContr(item)}} /></td>
                    </tr>
                    )}  
                    </tbody>
                    </Table>
                </Col>
             </Row>
             </Container>
        </div>
    );
});

export default MyContr; 