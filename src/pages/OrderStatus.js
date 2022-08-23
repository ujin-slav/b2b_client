import React,{useState,useEffect,useContext} from 'react';
import {Context} from "../index";
import PriceService from '../services/PriceService'

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
        label: "paid",
        labelRu: "Оплата произведена"
    },   
    {
        value: 5,
        label: "shipment",
        labelRu: "Товар в пути"
    },
    {
        value: 6,
        label: "received",
        labelRu: "Товар получен"
    },
]

const OrderStatus = ({priceAskId}) => {

    const[status,setStatus] = useState(1)
    const [filesBils, setFilesBils] = useState([])
    const [fileSizeBils, setFileSizeBils] = useState(0);
    const [filesPaid, setFilesPaid] = useState([])
    const [fileSizePaid, setFileSizePaid] = useState(0);
    const [filesShipment, setFilesShipment] = useState([])
    const [fileSizeShipment, setFileSizeShipment] = useState(0);
    const [filesReceived, setFilesReceived] = useState([])
    const [fileSizeReceived, setFileSizeReceived] = useState(0);
    const {myalert} = useContext(Context);

    const send=async()=>{
        const data = new FormData();
        filesBils.forEach((item)=>{data.append("file", item);data.append("Bilsfiles", item.name)})
        filesPaid.forEach((item)=>{data.append("file", item);data.append("Paidfiles", item.name)})
        filesShipment.forEach((item)=>{data.append("file", item);data.append("Shipmentfiles", item.name)})
        filesReceived.forEach((item)=>{data.append("file", item);data.append("Receivedfiles", item.name)})
        data.append("PriceAskId", priceAskId)
        data.append("Status", JSON.stringify(statusOrder.find(item=>item.value===status)))
        const result = await PriceService.setStatus(data)
        if (result.status===200){
            myalert.setMessage("Успешно");
          } else {
            myalert.setMessage(result?.data?.message)
        }
    }

    useEffect(() => {
        PriceService.getStatus(priceAskId).then((result)=>{
            console.log(result)
            setFilesBils(result.Bilsfiles)
            setFilesPaid(result.Paidfiles)
            setFilesShipment(result.Shipmentfiles)
            setFilesReceived(result.Receivedfiles)
        })
      },[]);

    const increment=()=>{
        setStatus(status+1)
    }

    const decrement=()=>{
        setStatus(status-1)
    }

    const removeFile = (id,files,setFiles,fileSize,setFileSize) => {
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
                return paid(active) 
            case 5:
                return shipment(active) 
            case 6:
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
                        multiple/> {filesBils.map((a,key)=>{
                            console.log(a)
                            return(
                    <div key={key}>{a.name||a.originalname}
                        <button disabled={!active} onClick={()=>removeFile(key,filesBils,setFilesBils,fileSizeBils,setFileSizeBils)}>X</button>
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
                        multiple/> {filesPaid.map((a,key)=>
                    <div key={key}>{a.name||a.originalname}
                        <button disabled={!active} onClick={()=>removeFile(key,filesPaid,setFilesPaid,fileSizePaid,setFileSizePaid)}>X</button>
                    </div>
                )}  
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
                        multiple/> {filesShipment.map((a,key)=>
                    <div key={key}>{a.name||a.originalname}
                        <button disabled={!active} onClick={()=>removeFile(key,filesShipment,setFilesShipment,fileSizeShipment,setFileSizeShipment)}>X</button>
                    </div>
                )}  
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
                        multiple/> {filesReceived.map((a,key)=>
                    <div key={key}>{a.name||a.originalname}
                        <button disabled={!active} onClick={()=>removeFile(key,filesReceived,setFilesReceived,fileSizeReceived,setFileSizeReceived)}>X</button>
                    </div>
                )}  
            </div> 
        )
    }

    return (
        <div>
            {statusOrder.map((item,index)=>
                <div key={index}>
                    <div className='statusRingContainer'>
                        <div className={status>item.value ? "statusRingActive" : "statusRing"}>
                            <span className={status>item.value ? "statusNumberActive" : "statusNumber"}>{item.value}</span>
                        </div>
                        <div className='nameStatus'>
                            <div className={status>item.value ? 'nameStatusTextActive' : 'nameStatusText'}>{item.labelRu}</div>
                            {addOptionStatus(item.value,status>item.value)}
                        </div>
                    </div>
                    {item.value<statusOrder.length ?
                        <div className='statusLineContainer'>
                            <div className={status>item.value ? "statusLineActive" : "statusLine"}>
                            </div>
                        </div>
                        :
                        <div></div>
                    }
                </div>
            )}
        <button onClick={()=>decrement()}>-</button>
        <button onClick={()=>increment()}>+</button>
        <button onClick={()=>send()}>Отправить</button>
        </div>
    );
};

export default OrderStatus;