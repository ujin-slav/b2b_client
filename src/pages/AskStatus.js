import React,{useState,useEffect,useContext} from 'react';
import {Context} from "../index";
import AskService from '../services/AskService'
import {Eye} from 'react-bootstrap-icons';
import {observer} from "mobx-react-lite";
import {
    Form,
    InputGroup,
    Button,
 } from "react-bootstrap";

export const statusOrder = [
    // {
    //     value: 1,
    //     label: "deliveredSupplier",
    //     labelRu: "Доставлен поставщику"
    // },
    // {
    //     value: 2,
    //     label: "processedSupplier",
    //     labelRu: "Обрабатывается поставщиком"
    // },
    // {
    //     value: 3,
    //     label: "biled",
    //     labelRu: "Выставлен счет(ожидается оплата)"
    // },
    {
         value: 1,
         label: "deliveredSupplier",
         labelRu: "Выбран победитель"
    },
    {
        value: 2,
        label: "paid",
        labelRu: "Оплата произведена"
    },   
    {
        value: 3,
        label: "shipment",
        labelRu: "Создана реализация(товар в пути)"
    },
    {
        value: 4,
        label: "received",
        labelRu: "Товар получен"
    },
]

const AskStatus = observer(({askId}) => {

    const[status,setStatus] = useState(1)
    const [filesBils, setFilesBils] = useState([])
    const [fileSizeBils, setFileSizeBils] = useState(0);
    const [filesPaid, setFilesPaid] = useState([])
    const [fileSizePaid, setFileSizePaid] = useState(0);
    const [filesShipment, setFilesShipment] = useState([])
    const [fileSizeShipment, setFileSizeShipment] = useState(0)
    const [filesReceived, setFilesReceived] = useState([])
    const [fileSizeReceived, setFileSizeReceived] = useState(0)
    const [deletedFiles,setDeletedFiles] = useState([])
    const {myalert} = useContext(Context);
    const [author, setAuthor] = useState()
    const [winner, setWinner] = useState()
    const {user} = useContext(Context);  

    const send=async()=>{
        const data = new FormData();
        filesBils?.forEach((item)=>{data.append("file", item);data.append("Bilsfiles", item.name)})
        filesPaid?.forEach((item)=>{data.append("file", item);data.append("Paidfiles", item.name)})
        filesShipment?.forEach((item)=>{data.append("file", item);data.append("Shipmentfiles", item.name)})
        filesReceived?.forEach((item)=>{data.append("file", item);data.append("Receivedfiles", item.name)})
        data.append("askId", askId)
        data.append("Status", JSON.stringify(statusOrder.find(item=>item.value==status)))
        data.append("DeletedFiles", JSON.stringify(deletedFiles))
        const result = await AskService.setStatus(data)
        if (result.status===200){
            myalert.setMessage("Успешно");
          } else {
            myalert.setMessage(result?.data?.message)
        }
    }

    useEffect(() => {
        AskService.getStatus(askId).then((result)=>{
            if(result.Status){
                setStatus(result?.Status?.Status?.value)
                setFilesBils(result?.Status?.Bilsfiles)
                setFilesPaid(result?.Status?.Paidfiles)
                setFilesShipment(result?.Status?.Shipmentfiles)
                setFilesReceived(result?.Status?.Receivedfiles)
            }
            setAuthor(result.Author)
            setWinner(result.Winner)
        })
      },[user.user]);
    console.log(author) 
    console.log(winner)   
    console.log(user?.user?.id) 
    
    const removeFile = (id,files,setFiles,fileSize,setFileSize) => {
        setDeletedFiles(((oldItems) => [...oldItems,files[id]]));
        setFileSize(fileSize - files[id].size)
        const newFiles = files.filter((item,index,array)=>index!==id);
        setFiles(newFiles);
    }

    const onInputChange = (e,files,setFiles,fileSize,setFileSize) => {
        if(files.length+e.target.files.length<10){
          for(let i = 0; i < e.target.files.length; i++) { 
            try{
              if(fileSize + e.target.files[i].size < 5242880){
                setFileSize(fileSize + e.target.files[i].size)
                setFiles(((oldItems) => [...oldItems, e.target.files[i]]))
              } else {
                myalert.setMessage("Превышен размер файлов");
              }  
            }catch(e){
              console.log(e)
            }
          }
        }else{
          myalert.setMessage("Превышено количество файлов");
        }
      };
    
    const addOptionStatus = (number,active) => {
        switch (number) {
            case 2:
                return paid(active) 
            case 3:
                return shipment(active) 
            case 4:
                return received(active) 
            default:
              break;
        }
    }
    const biled=(active)=>{
        return(
            <div>
                Можете прикрепить файлы счета.
                    <input type="file"
                        onChange={(e)=>onInputChange(e,filesBils,setFilesBils,fileSizeBils,setFileSizeBils)}
                        className="form-control"
                        disabled={!active}
                        multiple/> {filesBils?.map((a,key)=>{
                            return(
                        <div key={key}>
                        {a.originalname ?
                            <div>
                                <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                                ${process.env.REACT_APP_API_URL}getstatusfile/${a.filename}`)}/>
                                <a
                                href={process.env.REACT_APP_API_URL + `getstatusfile/` + a.filename}
                                >{a.originalname}</a>
                                <button disabled={!active} onClick={()=>removeFile(key,filesBils,setFilesBils,fileSizeBils,setFileSizeBils)}>X</button>     
                            </div>
                        :
                            <div>
                                {a.name}
                                <button disabled={!active} onClick={()=>removeFile(key,filesBils,setFilesBils,fileSizeBils,setFileSizeBils)}>X</button>     
                            </div>
                        }
                    </div>
                    )})}  
            </div> 
        )
    }
    const paid=(active)=>{
        return(
            <div>
                Можете прикрепить файлы платежного поручения.
                <input type="file"
                        onChange={(e)=>onInputChange(e,filesPaid,setFilesPaid,fileSizePaid,setFileSizePaid)}
                        className="form-control"
                        disabled={!active}
                        multiple/> {filesPaid?.map((a,key)=>{
                            return(
                        <div key={key}>
                        {a.originalname ?
                            <div>
                                <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                                ${process.env.REACT_APP_API_URL}getstatusfile/${a.filename}`)}/>
                                <a
                                href={process.env.REACT_APP_API_URL + `getstatusfile/` + a.filename}
                                >{a.originalname}</a>
                                <button disabled={!active} onClick={()=>removeFile(key,filesPaid,setFilesPaid,fileSizePaid,setFileSizePaid)}>X</button>     
                            </div>
                        :
                            <div>
                                {a.name}
                                <button disabled={!active} onClick={()=>removeFile(key,filesPaid,setFilesPaid,fileSizePaid,setFileSizePaid)}>X</button>     
                            </div>
                        }
                    </div>
                    )})}  
            </div> 
        )
    }
    const shipment=(active)=>{
        return(
            <div>
                Можете прикрепить файлы реализации(Накладная,СФ,УПД ...).
                <input type="file"
                        onChange={(e)=>onInputChange(e,filesShipment,setFilesShipment,fileSizeShipment,setFileSizeShipment)}
                        className="form-control"
                        disabled={!active}
                        multiple/> {filesShipment?.map((a,key)=>{
                            return(
                        <div key={key}>
                        {a.originalname ?
                            <div>
                                <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                                ${process.env.REACT_APP_API_URL}getstatusfile/${a.filename}`)}/>
                                <a
                                href={process.env.REACT_APP_API_URL + `getstatusfile/` + a.filename}
                                >{a.originalname}</a>
                                <button disabled={!active} onClick={()=>removeFile(key,filesShipment,setFilesShipment,fileSizeShipment,setFileSizeShipment)}>X</button>     
                            </div>
                        :
                            <div>
                                {a.name}
                                <button disabled={!active} onClick={()=>removeFile(key,filesShipment,setFilesShipment,fileSizeShipment,setFileSizeShipment)}>X</button>     
                            </div>
                        }
                    </div>
                    )})}  
            </div> 
        )
    }
    const received=(active)=>{
        return(
            <div>
                Можете прикрепить файлы подписанных документов.
                <input type="file"
                        onChange={(e)=>onInputChange(e,filesReceived,setFilesReceived,fileSizeReceived,setFileSizeReceived)}
                        className="form-control"
                        disabled={!active}
                        multiple/> {filesReceived?.map((a,key)=>{
                            return(
                        <div key={key}>
                        {a.originalname ?
                            <div>
                                <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                                ${process.env.REACT_APP_API_URL}getstatusfile/${a.filename}`)}/>
                                <a
                                href={process.env.REACT_APP_API_URL + `getstatusfile/` + a.filename}
                                >{a.originalname}</a>
                                <button disabled={!active} onClick={()=>removeFile(key,filesReceived,setFilesReceived,fileSizeReceived,setFileSizeReceived)}>X</button>     
                            </div>
                        :
                            <div>
                                {a.name}
                                <button disabled={!active} onClick={()=>removeFile(key,filesReceived,setFilesReceived,fileSizeReceived,setFileSizeReceived)}>X</button>     
                            </div>
                        }
                    </div>
                    )})}  
            </div> 
        )
    }
    const getChoise =()=>{
        if(user.user._id === author){
            return (
                <Form.Control
                        as="select" 
                        onChange={(e)=>setStatus(e.target.value)}        
                    >       
                            <option>Выбрать</option>
                            <option value="2">Оплата произведена</option>
                            <option value="4">Товар получен</option>
                </Form.Control>
            )
        }else if(user.user._id === winner){
            return (
                <Form.Control
                as="select" 
                onChange={(e)=>setStatus(e.target.value)}        
                >       
                    <option>Выбрать</option>
                    <option value="3">Создана реализация(товар в пути)</option>
                </Form.Control>
            )
        }else{
            return (
                <Form.Control as="select" onChange={(e)=>setStatus(e.target.value)}>  
                     <option>Выбрать</option>
                </Form.Control>
            )
        }
    }
    if(!(user?.user?.id===author || user?.user?.id===winner)){
        return(
            <div></div>
        )
    }

    return (
        <div>
            <InputGroup className="mt-4 mb-4"> 
                <Form.Label className="px-3 mt-2">Изменить статус:</Form.Label>
                    {getChoise()}
                    <Button onClick={()=>send()}>Сохранить
                    </Button> 
                </InputGroup>
            {statusOrder.map((item,index)=>
                <div key={index}>
                    <div className='statusRingContainer'>
                        <div className={status>=item.value ? "statusRingActive" : "statusRing"}>
                            <span className={status>=item.value ? "statusNumberActive" : "statusNumber"}>{item.value}</span>
                        </div>
                        <div className='nameStatus'>
                            <div className={status>=item.value ? 'nameStatusTextActive' : 'nameStatusText'}>{item.labelRu}</div>
                            {addOptionStatus(item.value,status>=item.value)}
                        </div>
                    </div>
                    {item.value<statusOrder.length ?
                        <div className='statusLineContainer'>
                            <div className={status>=item.value ? "statusLineActive" : "statusLine"}>
                            </div>
                        </div>
                        :
                        <div></div>
                    }
                </div>
            )}
        </div>
    )
});

export default AskStatus;