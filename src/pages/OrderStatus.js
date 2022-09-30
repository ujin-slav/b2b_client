import React,{useState,useEffect,useContext} from 'react';
import {Context} from "../index";
import PriceService from '../services/PriceService'
import {Eye} from 'react-bootstrap-icons';
import {observer} from "mobx-react-lite";
import {
    Form,
    InputGroup,
    Button,
 } from "react-bootstrap";

export const statusOrder = [
    {
        value: 1,
        label: "deliveredSupplier",
        labelRu: "Доставлен поставщику"
    },
    {
        value: 2,
        label: "processedSupplier",
        labelRu: "Обрабатывается поставщиком"
    },
    {
        value: 3,
        label: "biled",
        labelRu: "Выставлен счет(ожидается оплата)"
    },
    {
        value: 4,
        label: "crContract",
        labelRu: "Создан договор(контракт)"
    },
    {
        value: 5,
        label: "siContract",
        labelRu: "Подписан договор(контракт)"
    },
    {
        value: 6,
        label: "paid",
        labelRu: "Оплата произведена"
    },   
    {
        value: 7,
        label: "shipment",
        labelRu: "Создана реализация(товар в пути)"
    },
    {
        value: 8,
        label: "received",
        labelRu: "Товар получен"
    },
]

const OrderStatus = observer(({priceAskId}) => {

    const [status,setStatus] = useState(1)
    const [author, setAuthor] = useState()
    const [fiz, setFiz] = useState(false)
    const [filesBils, setFilesBils] = useState([])
    const [fileSizeBils, setFileSizeBils] = useState(0);
    const [filesSiContract, setFilesSiContract] = useState([])
    const [fileSizeSiContract, setFileSizeSiContract] = useState(0);
    const [filesCrContract, setFilesCrContract] = useState([])
    const [fileSizeCrContract, setFileSizeCrContract] = useState(0);
    const [filesPaid, setFilesPaid] = useState([])
    const [fileSizePaid, setFileSizePaid] = useState(0);
    const [filesShipment, setFilesShipment] = useState([])
    const [fileSizeShipment, setFileSizeShipment] = useState(0)
    const [filesReceived, setFilesReceived] = useState([])
    const [fileSizeReceived, setFileSizeReceived] = useState(0)
    const [deletedFiles,setDeletedFiles] = useState([])
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);

    const send=async()=>{
        const data = new FormData();
        filesCrContract?.forEach((item)=>{data.append("file", item);data.append("CrContractfiles", item.name)})
        filesSiContract?.forEach((item)=>{data.append("file", item);data.append("SiContractfiles", item.name)})
        filesBils?.forEach((item)=>{data.append("file", item);data.append("Bilsfiles", item.name)})
        filesPaid?.forEach((item)=>{data.append("file", item);data.append("Paidfiles", item.name)})
        filesShipment?.forEach((item)=>{data.append("file", item);data.append("Shipmentfiles", item.name)})
        filesReceived?.forEach((item)=>{data.append("file", item);data.append("Receivedfiles", item.name)})
        data.append("PriceAskId", priceAskId)
        data.append("Status", JSON.stringify(statusOrder.find(item=>item.value==status)))
        data.append("DeletedFiles", JSON.stringify(deletedFiles))
        const result = await PriceService.setStatus(data)
        if (result.status===200){
            myalert.setMessage("Успешно");
          } else {
            myalert.setMessage(result?.data?.message)
        }
    }

    useEffect(() => {
        PriceService.getStatus(priceAskId).then((result)=>{
            if(result.Status){
                setStatus(result?.Status?.Status?.value)
                setFilesBils(result?.Status?.Bilsfiles)
                setFilesCrContract(result?.Status?.CrContract)
                setFilesSiContract(result?.Status?.SiContract)
                setFilesPaid(result?.Status?.Paidfiles)
                setFilesShipment(result?.Status?.Shipmentfiles)
                setFilesReceived(result?.Status?.Receivedfiles)
                setFiz(result.Fiz)
                setAuthor(result.author)
            }
            setFiz(result.Fiz)
            setAuthor(result.author)
        })
      },[user.user]);

    if(fiz){
        return <div></div>
    }

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
            case 3:
                return biled(active) 
            case 4:
                return crContract(active) 
            case 5:
                return siContract(active) 
            case 6:
                return paid(active) 
            case 7:
                return shipment(active) 
            case 8:
                return received(active) 
            default:
              break;
        }
    }
    const crContract=(active)=>{
        return(
            <div>
                Можете прикрепить файлы договора(контракта).
                    <input type="file"
                        onChange={(e)=>onInputChange(e,filesCrContract,setFilesCrContract,fileSizeCrContract,setFileSizeCrContract)}
                        className="form-control"
                        disabled={!active}
                        multiple/> {filesCrContract?.map((a,key)=>{
                            return(
                        <div key={key}>
                        {a.originalname ?
                            <div>
                                <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                                ${process.env.REACT_APP_API_URL}getstatusfile/${a.filename}`)}/>
                                <a
                                href={process.env.REACT_APP_API_URL + `getstatusfile/` + a.filename}
                                >{a.originalname}</a>
                                <button disabled={!active} onClick={()=>removeFile(key,filesCrContract,setFilesCrContract,fileSizeCrContract,setFileSizeCrContract)}>X</button>     
                            </div>
                        :
                            <div>
                                {a.name}
                                <button disabled={!active} onClick={()=>removeFile(key,filesCrContract,setFilesCrContract,fileSizeCrContract,setFileSizeCrContract)}>X</button>     
                            </div>
                        }
                    </div>
                    )})}  
            </div> 
        )
    }
    const siContract=(active)=>{
        return(
            <div>
                Можете прикрепить файлы договора(контракта).
                    <input type="file"
                        onChange={(e)=>onInputChange(e,filesSiContract,setFilesSiContract,fileSizeSiContract,setFileSizeSiContract)}
                        className="form-control"
                        disabled={!active}
                        multiple/> {filesSiContract?.map((a,key)=>{
                            return(
                        <div key={key}>
                        {a.originalname ?
                            <div>
                                <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                                ${process.env.REACT_APP_API_URL}getstatusfile/${a.filename}`)}/>
                                <a
                                href={process.env.REACT_APP_API_URL + `getstatusfile/` + a.filename}
                                >{a.originalname}</a>
                                <button disabled={!active} onClick={()=>removeFile(key,filesSiContract,setFilesSiContract,fileSizeSiContract,setFileSizeSiContract)}>X</button>     
                            </div>
                        :
                            <div>
                                {a.name}
                                <button disabled={!active} onClick={()=>removeFile(key,filesSiContract,setFilesSiContract,fileSizeSiContract,setFileSizeSiContract)}>X</button>     
                            </div>
                        }
                    </div>
                    )})}  
            </div> 
    )
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
                    <option value="2">Обрабатывается поставщиком</option>
                    <option value="3">Выставлен счет(ожидается оплата)</option>
                    <option value="4">Создан договор(контракт)</option>
                    <option value="5">Подписан договор(контракт)</option>
                    <option value="7">Создана реализация(товар в пути)</option>
                </Form.Control> 
            )
        }else{
            return (
                <Form.Control
                as="select" 
                onChange={(e)=>setStatus(e.target.value)}        
                 >       
                    <option>Выбрать</option>
                    <option value="4">Создан договор(контракт)</option>
                    <option value="5">Подписан договор(контракт)</option>
                    <option value="6">Оплата произведена</option>
                    <option value="8">Товар получен</option>
                </Form.Control> 
            )
        }    
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
    );
});

export default OrderStatus;