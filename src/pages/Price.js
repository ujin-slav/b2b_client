import React,{useContext,useState,useRef} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Table
  } from "react-bootstrap";
import { uploadPrice } from '../http/askAPI';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import waiting from "../waiting.gif";
import * as XLSX from 'xlsx';

const make_cols = refstr => {
    let o = [],
      C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
    return o;
};

const Price = observer(() => {
    const {myalert} = useContext(Context);
    const [file, setFile] = useState([])
    const {user} = useContext(Context);  
    const [fetch,setFetch] = useState(false); 
    const [price,setPrice] = useState([]);  
    const [dats,setData] = useState(); 
    const input = useRef(null);

    const onInputChange = (e) => {
        try{
            if(e.target.files[0].size < 5242880){
                setFile(e.target.files[0])
                const reader = new FileReader();
                const rABS = !!reader.readAsBinaryString;
                reader.onload = e => {
                /* Parse data */
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                /* Update state */
                setPrice(data);
                input.current.value=null
                };
                if (rABS) reader.readAsBinaryString(e.target.files[0]);
                else reader.readAsArrayBuffer(e.target.files[0]);
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
            data.append("price",JSON.stringify(price))
            data.append("userID", user.user.id)
            setFetch(true)
            const result = await uploadPrice(data)
            if(result.result){
                myalert.setMessage("Прайс загружен");
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
                                    ref={input}
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
                </Row>
             </Container>
             <Table>
             <thead>
                <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Цена</th>
                    <th>Остаток</th>
                </tr>
                </thead>
                <tbody>
                    {price?.map((item)=>
                    
                        <tr>
                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                            <td>{item[2]}</td>
                            <td>{item[3]}</td>
                            <td>{item[4]}</td>
                        </tr>
                    )}
                 </tbody>
            </Table>
        </div>
    );
});

export default Price;