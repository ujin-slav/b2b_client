import React,{useContext,useState,useRef,useEffect} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Table,
    Card,
    ProgressBar
  } from "react-bootstrap";
import { uploadPrice } from '../http/askAPI';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import * as XLSX from 'xlsx';
import PriceService from '../services/PriceService'
import ModalAlert from '../components/ModalAlert';


const UploadPrice = observer(() => {

    const {myalert} = useContext(Context);
    const [modalActive,setModalActive] = useState(false);
    const [file, setFile] = useState([])
    const {user} = useContext(Context);  
    const [fetch,setFetch] = useState(false); 
    const [price,setPrice] = useState([]);  
    const [dats,setData] = useState(); 
    const[currentPage,setCurrentPage] = useState(1);
    const[fetching,setFetching] = useState(true);
    const[totalDocs,setTotalDocs] = useState(0);
    const[help,setHelp] = useState(false);
    const [progress, setProgress] = useState(0)
    const[search,setSearch] = useState("");
    const input = useRef(null);
    let limit = 30

    useEffect(() => {
        // if(user.user.id){
        //     if(fetching){
        //         if(price.length===0 || price.length<totalDocs) {
        //         PriceService.getPrice({page:currentPage,limit,search,org:user.user.id}).then((data)=>{
        //             setTotalDocs(data.totalDocs);
        //             setPrice([...price, ...data.docs]);
        //             setCurrentPage(prevState=>prevState + 1)
        //         }).finally(()=>setFetching(false))
        //         }
        //     }
        // } 
    },[fetching,user.user]);

    useEffect(() => {
        // document.addEventListener('scroll',scrollHandler);
        // return function(){
        //     document.removeEventListener('scroll',scrollHandler);
        // }
    },[]);

    // const scrollHandler = (e) =>{
    //     if((e.target.documentElement.scrollHeight - 
    //         (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
    //             setFetching(true)
    //         }
    // }

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
                const data = XLSX.utils.sheet_to_json(ws, { header: 1,blankrows: true, defval: '', });
                /* Update state */
                console.log(data)
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
                <div class="loader">Loading...</div>
            </p> 
        )
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        const options = {
            onUploadProgress: (progressEvent) => {
              const {loaded, total} = progressEvent;
              let percent = Math.floor( (loaded * 100) / total )
              console.log( `${loaded}kb of ${total}kb | ${percent}%` );
              if( percent < 100 ){
                setProgress(percent)
              }
            }
        }
        if(file.length!==0){
            const data = new FormData()
            data.append("price",JSON.stringify(price))
            data.append("userID", user.user.id)
            const result = await uploadPrice(data,options)
            if(result.result){
                myalert.setMessage("Прайс загружен");
            } else if(result.errors){
                myalert.setMessage(result.message);
            }
            setFile([])
        }else{
            myalert.setMessage("Выберите файл");
        }
      };
    const clearPrice = async()=>{
      setFetch(true)
      const result = await PriceService.clearPrice({org:user.user.id});
      if (result.status===200){
        myalert.setMessage("Успешно");
      } else {
        myalert.setMessage(result.data.message);
      }
      setPrice([])
      setFetch(false)
    }  

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
                            <Card>
                                <Card.Header style={{"text-decoration": "underline",
                                                     "color": "#EC4D3C",
                                                     "cursor": "pointer"                                            
                            }} onClick={()=>setHelp(!help)}>Инструкция</Card.Header>
                                {help ?
                                <div style={{"padding":"20px"}}>
                                    Файл прайса можно загрузить в формате Excel *.xls, *xlsx.<br/>
                                    После выбора файла вы увидите, каким образом будут отображаться данные
                                    в системе.<br/>
                                    Если колонки находятся не на своем месте, или строки пустые,
                                    отредактируйте файл своего<br/>
                                    прайса согласно образцу:<br/>
                                    <ul>
                                    <li>1-я колонка - Артикул (не обязателен)</li>
                                    <li>2-я колонка - Наименование (обязательно)</li>
                                    <li>3-я колонка - Цена (обязательно)</li>
                                    <li>4-я колонка - Остаток (обязательно)</li>
                                    <li>5-я колонка - Единица измерения (не обязательно)</li>
                                    </ul>
                                    Заголовки колонок подписывать не нужно.<br/>
                                    Если данные отображаются как надо, нажимайте кнопку загрузить,
                                    предыдущие данные будут <br/>
                                    затерты новыми. Если в строке отсутствует наименование или остаток,
                                    строка будет пропущена.<br/>
                                    <a href={`${process.env.REACT_APP_API_URL}static/sample/price.xls`}>Образец файла.</a><br/>
                                </div>
                                :
                                <div></div>
                                }
                            </Card>
                                 {progress!==0 ? 
                                    <ProgressBar now={progress} active label={`${progress}%`} className="mt-3 mb-3"/>
                                :
                                    <div></div>
                                }   
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="btn btn-success mt-3"
                                >
                                    Загрузить
                                </Button>
                                <Button
                                    variant="primary"
                                    className="btn btn-success mt-3 mx-3"
                                    onClick={()=>setModalActive(true)}
                                >
                                    Удалить данные на сервере
                                </Button>
                    </Form>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                </Row>
                <Row>
                    <Col>
                    {/* <Form.Group className="mx-auto my-2">
                        <Form.Label>Поиск:</Form.Label>
                        <Form.Control
                            onChange={handleSearch}
                            placeholder="Начните набирать артикул или название продукта"
                        />
                    </Form.Group> */}
                    </Col>
                </Row>
             </Container>
             <Table>
             <thead>
                <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Цена</th>
                    <th>Остаток</th>
                    <th>Ед.изм</th>
                </tr>
                </thead>
                <tbody>
                    {price?.map((item)=>
                    
                        <tr>
                            <td>{item[0]||item.Code||<div style={{"color":"red"}}>нет</div>}</td>
                            <td>{item[1]||item.Name||<div style={{"color":"red"}}>нет</div>}</td>
                            <td>{item[2]||item.Price||<div style={{"color":"red"}}>нет</div>}</td>
                            <td>{item[3]||item.Balance||<div style={{"color":"red"}}>нет</div>}</td>
                            <td>{item[4]||item.Measure||<div style={{"color":"red"}}>нет</div>}</td>
                        </tr>
                    )}
                 </tbody>
            </Table>
            <ModalAlert header="Предыдущие данные будут удалены, продолжить?" 
              active={modalActive} 
              setActive={setModalActive} funRes={clearPrice}/>
        </div>
    );
});

export default UploadPrice;