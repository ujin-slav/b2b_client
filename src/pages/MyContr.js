import React,{useState,useEffect,useContext,useRef} from 'react';
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
    const [contragentName,setContragentName] = useState();
    const [listCont,setListContragent] =  useState([]);
    const [error, setError] = useState();
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);
    const [fetching,setFetching] = useState(true);
    const emailBox = useRef(null)
    const nameBox = useRef(null)

    useEffect(() => {
        fetchContr();
    },[user.user.id,fetching]);

    const fetchContr = () =>{
        ContrService.fetchContr(user.user.id).then((data)=>{
            setListContragent(data);
            setFetching(false)
    })
    }

    const handleClick = async() => {
        if(emailRegex.test(contragent)){
            const result = await ContrService.addContr({email:contragent,name:contragentName,userid:user.user.id})
            if (result.errors){
                setError(result.message)
            } else {
                setFetching(true)
                emailBox.current.value=""
                nameBox.current.value=""
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
                            placeholder="Введите имя контрагента"
                            onChange={(e)=>setContragentName(e.target.value)}
                            ref={nameBox}
                        />
                        <Form.Control
                            placeholder="Введите e-mail контрагента"
                            onChange={(e)=>setContragent(e.target.value)}
                            ref={emailBox}
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
                        <th>Имя</th>
                        <th>E-mail</th>
                        <th>Удалить</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listCont.map((item,index)=>
                    <tr>
                        <td style={{"width":"10%"}}>{index+1}</td>
                        <td style={{"width":"50%"}}>{item.Name}</td>
                        <td>{item.Email}</td>
                        <td><XCircle color="red" style={{"width": "25px", "height": "25px"}}
                            onClick={(e)=>{deleteContr(item.Email)}} /></td>
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