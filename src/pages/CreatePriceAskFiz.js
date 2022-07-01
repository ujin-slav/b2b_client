import React,{useState,useEffect,useContext} from 'react';
import {useParams} from 'react-router-dom';
import {Card, Table, Col, Container, Row, InputGroup,Form,Button} from "react-bootstrap";
import dateFormat, { masks } from "dateformat";
import PriceService from '../services/PriceService'
import { XCircle} from 'react-bootstrap-icons';
import { fetchUser} from '../http/askAPI';
import {Context} from "../index";
import Captcha from "demos-react-captcha";

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ data, formErrors }) => {
    let valid = true;
  
    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });
  
    // validate the form was filled out
    Object.values(data).forEach(val => {
        val === null && (valid = false);
  });
  
  return valid;
  };
  

const CreatePriceAskFiz = () => {
    const {idorg,idprod} = useParams();
    const [recevier, setRecevier] = useState();
    const [org, setOrg] = useState();
    const [captcha, setCaptcha] = useState(false);
    const[fetching,setFetching] = useState(true);
    const [price,setPrice] = useState([]); 
    const [sumTotal,setSumTotal] = useState(0); 
    const [result,setResult] = useState([]); 
    const[totalDocs,setTotalDocs] = useState(0);
    const[currentPage,setCurrentPage] = useState();
    const[comment,setComment] = useState("");
    const[search,setSearch] = useState("");
    const {myalert} = useContext(Context);
    const {user} = useContext(Context);
    const[priceAsk,setPriceAsk] = useState( {
        data: {
          Name: null,
          Email: null,
          Telefon:""
        },
        formErrors: {
          Name: "",
          Email: "",
        }
      }
      );
    let limit = 30

    useEffect(() => {
        if(fetching){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice({page:currentPage,limit,search,org:idorg}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice([...price, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>setFetching(false))
            if(idprod){
                PriceService.getPriceUnit(idprod).then((data)=>{
                    addToResult(null,data)
                })
            }
        }
        }
    },[fetching]);

    useEffect(() => {
        fetchUser(idorg).then((data)=>{
            setRecevier(data)
        })
        document.addEventListener('scroll',scrollHandler);
        return function(){
            document.removeEventListener('scroll',scrollHandler);
        }
    },[]);

    const scrollHandler = (e) =>{
        if((e.target.documentElement.scrollHeight - 
            (e.target.documentElement.scrollTop + window.innerHeight) < 100)) {
                setFetching(true)
            }
    }

    const handleSearch = (e) =>{
        PriceService.getPrice({page:currentPage,limit,search,org:idorg}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(prevState=>prevState + 1)
                setSearch(e.target.value)
        }).finally(
            ()=>setFetching(false)
        )
    }
    
    const addToResult=(e,item)=>{
        let searchResult = false
        result.map((el,index)=>{
            if(el._id===item._id){
                searchResult = true
                result[index].Count = result[index].Count + 1
                return
            }
        })
        if(searchResult){
            setResult([...result])   
        }else{
            item.Count=1
            setResult([...result, item])  
        }
        setSumTotal(sumTotal + item.Price)
    }

    const delFromResult=(index)=>{
        setSumTotal(sumTotal - result[index].Price*result[index].Count)
        const newResult = result.filter((_,itemIndex) => index !== itemIndex)
        setResult(newResult)
    }

    const changeInput=(e,item)=>{
        let totalSum = 0
        result.map((el,index)=>{
            if(el._id===item._id){
                result[index].Count = e.target.value
            }
            totalSum = totalSum + result[index].Count * result[index].Price
        })
        setSumTotal(totalSum)
        setResult([...result]) 
    }

    const saveOrder=async()=>{
        if (formValid(priceAsk)) {
            const res = await PriceService.saveAsk(
                {Table:result,
                To:idorg,
                Comment:comment,
                Sum:sumTotal,
                Sent:false,
                FIZ:true,
                NameFiz:priceAsk.data.Name,
                EmailFiz:priceAsk.data.Email,
                TelefonFiz:priceAsk.data.Telefon,
            })
            if (res.status===200){
                myalert.setMessage("Успешно"); 
            } else {
                myalert.setMessage(res?.data?.message);
            }
        }else{
            myalert.setMessage("Не заполнены поля формы");
        }
    }

    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = priceAsk.formErrors;
        let data = priceAsk.data
        data[name] = value;
        console.log(name)
        
        switch (name) {
          case "name":
            formErrors.Name =
              value.length < 3 ? "минимум 3 символа" : "";
            break;   
          case "email":
                formErrors.Email = emailRegex.test(value)
                  ? ""
                  : "неверный email";
            break;
          default:
            break;
        }
        setPriceAsk({ data, formErrors});
      }
      const handleChangeCaptcha = (value) => {
        if(value){
          setCaptcha(true)
        }
      }

    return (
        <div class="container-priceask">
        <div class="container-priceask-center">   
            <div>
            <Form.Group className="mx-auto my-2">
                <Form.Label><span class="boldtext">Получатель:</span> {recevier?.name}, {recevier?.nameOrg}
                </Form.Label>
            </Form.Group> 
            <Form.Group className="mx-auto my-2">
                <Form.Control
                    onChange={handleSearch}
                    placeholder="Начните набирать артикул или название продукта"
                />
            </Form.Group>
            <div class="table-responsive">
                <Table class="table table-hover">
                <thead>
                    <tr>
                        <th>Артикул</th>
                        <th>Наименование</th>
                        <th>Цена</th>
                        <th>Остаток</th>
                        <th>Дата</th>
                    </tr>
                </thead>
                    <tbody>
                        {price?.map((item,index)=>
                            <tr key={index} onClick={(e)=>addToResult(e,item)}>
                                <td>{item?.Code}</td>
                                <td>{item?.Name}</td>
                                <td>{item?.Price}</td>
                                <td>{item?.Balance}</td>
                                <td>{dateFormat(item.Date, "dd/mm/yyyy")}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            </div>
            <div class="border-price">
            <div class="table-responsive">
                <Table  class="table table-hover">
                <thead>
                    <tr>
                        <th>Артикул</th>
                        <th>Наименование</th>
                        <th>Цена</th>
                        <th>Кол-во</th>
                        <th>Сумма</th>
                        <th>Del</th>
                    </tr>
                    </thead>
                    <tbody>
                        {result?.map((item,index)=>
                            <tr key={index}>
                                <td>{item.Code}</td>
                                <td>{item.Name}</td>
                                <td>{item.Price}</td>
                                <td style={{"width": "100px","padding":"3px"}}>
                                    <Form.Control 
                                        defaultValue={item.Count}
                                        type="number"
                                        onChange={(e)=>changeInput(e,item)}
                                    />
                                </td>
                                <td>{item.Count*item.Price}</td>
                                <td><XCircle color="red" 
                                style={{"width": "25px", "height": "20px"}} 
                                onClick={()=>delFromResult(index)}/></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <hr style={{"border": "none","background-color": "black","height": "5px"}}/>
                <div class="total-sum">
                    Сумма итого:<span style={{"font-weight":"500"}}>  {sumTotal}</span>
                    <div>Всего наименований: {result.length}</div>
                    </div>
            </div>
            <Form.Group className="mx-auto my-2">
                <Form.Control
                    onChange={(e)=>setComment(e.target.value)}
                    placeholder="Комментарий к заказу"
                    as="textarea"
                />
            </Form.Group>
            <div  style={{"text-align": "right"}}>
            <Form.Label><span class="boldtext">Ваши контактные данные:</span></Form.Label>
            <div class="mb-3 row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Имя</label>
                <div class="col-sm-10">
                <Form.Control type="text" name="name" placeholder="Обязательно" onChange={handleChange}/>
                <span className="errorMessage" style={{color:"red"}}>{priceAsk.formErrors.Name}</span>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-2 col-form-label">E-mail</label>
                <div class="col-sm-10">
                <Form.Control type="text" name="email" placeholder="Обязательно" onChange={handleChange}/>
                <span className="errorMessage" style={{color:"red"}}>{priceAsk.formErrors.Email}</span>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="inputPassword" class="col-sm-2 col-form-label">Телефон</label>
                <div class="col-sm-10">
                <Form.Control type="telefon"/>
                </div>
            </div>
            <Captcha onChange={handleChangeCaptcha} placeholder="Введите символы"/>     
            <Button
                onClick={saveOrder}
                variant="primary"
                className="btn btn-success mt-3"
                >
                Отправить поставщику
            </Button>
        </div>
        </div>
        </div>
    );
};

export default CreatePriceAskFiz;