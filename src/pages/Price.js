import React,{useContext,useState} from 'react';
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
import { uploadPrice } from '../http/askAPI';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import waiting from "../waiting.gif";

const Price = observer(() => {
    const {myalert} = useContext(Context);
    const [file, setFile] = useState([])
    const {user} = useContext(Context);  
    const [fetch,setFetch] = useState(false); 
    const [price,setPrice] = useState([]);  

    const onInputChange = (e) => {
        try{
            if(e.target.files[0].size < 5242880){
                setFile(e.target.files[0])
            } else {
                myalert.setMessage("Превышен размер файла");
            }  
        }catch(e){
            console.log(e)
        }
    };

    if(fetch){
        return(
            <p className="waiting">
                <img height="320" src={waiting}/>
            </p> 
        )
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if(file.length!==0){
            const data = new FormData()
            data.append("file", file)
            data.append("userID", user.user.id)
            setFetch(true)
            const result = await uploadPrice(data)
            if(result.result){
                myalert.setMessage("Прайс загружен");
                setPrice(result.result)
            } else if(result.errors){
                myalert.setMessage(result.message);
            }
            setFetch(false)
            setFile([])
        }else{
            myalert.setMessage("Выберите файл");
        }
      };

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                    <Form.Group className="mx-auto my-2">
                    <Form onSubmit={onSubmit}>
                            <div class="mb-3">
                                <label for="formFile" class="form-label">Загрузить фаил прайс листа.</label>
                                <input 
                                    onChange={onInputChange}
                                    class="form-control" 
                                    type="file" 
                                    accept=".xlsx, .xls,"
                                    id="formFile"/>
                            </div>
                            <Button
                                variant="primary"
                                type="submit"
                                className="btn btn-success ml-auto mr-1"
                            >
                                Загрузить
                            </Button>
                    </Form>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                <table>
                        {price?.map((item)=>
                        <tr>
                            <td>{item.art}</td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                        </tr>
                        )}
                </table>
                </Row>
             </Container>
        </div>
    );
});

export default Price;