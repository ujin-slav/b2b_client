import React,{useState,useEffect,useContext} from 'react';
import {Context} from "../index";
import PriceService from '../services/PriceService'
import {Eye} from 'react-bootstrap-icons';
import {observer} from "mobx-react-lite";
import ModalAlert from '../components/ModalAlert'
import {
    Form,
    InputGroup,
    Button,
 } from "react-bootstrap";
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

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
    const[prevStatus,setPrevStatus] = useState(1)
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
    const [loading,setLoading] = useState(false)   
    const {user} = useContext(Context);  
    const {myalert} = useContext(Context);
    const [modalActive,setModalActive] = useState(false);
    const [deletingFile,setDeletingFile] = useState({});

    const send=async()=>{
        const data = new FormData();
        filesCrContract?.forEach((item)=>{data.append("file", item);data.append("CrContractfiles", item.name)})
        filesSiContract?.forEach((item)=>{data.append("file", item);data.append("SiContractfiles", item.name)})
        filesBils?.forEach((item)=>{data.append("file", item);data.append("Bilsfiles", item.name)})
        filesPaid?.forEach((item)=>{data.append("file", item);data.append("Paidfiles", item.name)})
        filesShipment?.forEach((item)=>{data.append("file", item);data.append("Shipmentfiles", item.name)})
        filesReceived?.forEach((item)=>{data.append("file", item);data.append("Receivedfiles", item.name)})
        data.append("PriceAskId", priceAskId)
        data.append("Author", user.user.id)
        data.append("PrevStatus", JSON.stringify(statusOrder.find(item=>item.value==prevStatus)))
        data.append("Status", JSON.stringify(statusOrder.find(item=>item.value==status)))
        const result = await PriceService.setStatus(data)
        if (result.status===200){
            getStatus()
            myalert.setMessage("Успешно");
            setPrevStatus(status)
          } else {
            myalert.setMessage(result?.data?.message)
        }
    }

    useEffect(() => {
        getStatus()
    },[user.user]);

    const getStatus = () => {
        setLoading(true)
        PriceService.getStatus(priceAskId).then((result)=>{
            if(result.Status){
                setStatus(result?.Status?.Status?.value)
                setPrevStatus(result?.Status?.Status?.value)
                setFilesBils(result?.Status?.Bilsfiles || [])
                setFilesCrContract(result?.Status?.CrContractfiles || [])
                setFilesSiContract(result?.Status?.SiContractfiles || [])
                setFilesPaid(result?.Status?.Paidfiles || [])
                setFilesShipment(result?.Status?.Shipmentfiles || [])
                setFilesReceived(result?.Status?.Receivedfiles || [])
                setFiz(result.Fiz)
                setAuthor(result.author)
            }
            setFiz(result.Fiz)
            setAuthor(result.author)
        }).finally(()=>setLoading(false))
    }

    if(fiz){
        return <div></div>
    }

    const removeFile = async(id,a,files,setFiles,fileSize,setFileSize,nameArray) => {
        
        setDeletingFile({id,a,files,setFiles,fileSize,setFileSize,nameArray})
        setModalActive(true)
    }
    
    const delFile = async()=> {

        const {
            id,a,files,setFiles,fileSize,setFileSize,nameArray
        } = deletingFile

        const newFiles = files.filter((item,index,array)=>index!==id);
        if(a.originalname){
                const result = await PriceService.deleteFile({
                file:a,
                priceAskId,
                newFiles,
                nameArray  
            })
            if (result.status===200){
                myalert.setMessage("Успешно");
                setFileSize(fileSize - files[id].size)
                setFiles(newFiles);
              } else {
                myalert.setMessage(result?.data?.message)
            }
        }else{
            setFileSize(fileSize - files[id].size)
            setFiles(newFiles);
        }
        setDeletingFile({})
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
                return inputFiles(active,filesBils,setFilesBils,fileSizeBils,setFileSizeBils,"CrContractfiles")  
            case 4:
                return inputFiles(active,filesCrContract,setFilesCrContract,fileSizeCrContract,setFileSizeCrContract,"CrContractfiles")  
            case 5:
                return inputFiles(active,filesSiContract,setFilesSiContract,fileSizeSiContract,setFileSizeSiContract,"SiContractfiles") 
            case 6:
                return inputFiles(active,filesPaid,setFilesPaid,fileSizePaid,setFileSizePaid,"Paidfiles") 
            case 7:
                return inputFiles(active,filesShipment,setFilesShipment,fileSizeShipment,setFileSizeShipment,"Shipmentfiles") 
            case 8:
                return inputFiles(active,filesReceived,setFilesReceived,fileSizeReceived,setFileSizeReceived,"Receivedfiles")  
            default:
              break;
        }
    }

    const inputFiles = (active, files,setFiles,fileSize,setFileSize,nameArray) => {
        return(
            <div>
                Можете прикрепить файлы документов.
                <input type="file"
                        onChange={(e)=>onInputChange(e,files,setFiles,fileSize,setFileSize)}
                        className="form-control"
                        disabled={!active}
                        multiple/> {files?.map((a,key)=>{
                            return(
                    <div key={key}>
                        {a.originalname ?
                            <div>
                                <Eye className="eye" onClick={()=>window.open(`http://docs.google.com/viewer?url=
                                ${process.env.REACT_APP_API_URL}getstatusfile/${a.filename}`)}/>
                                <a
                                href={process.env.REACT_APP_API_URL + `getstatusfile/` + a.filename}
                                >{a.originalname}</a>
                                {user.user.id === a.author ?
                                    <button disabled={!active} onClick={()=>removeFile(key,a,files,setFiles,fileSize,setFileSize,nameArray)}>X</button>  
                                    :
                                    <div></div>
                                }   
                            </div>
                        :
                            <div>
                                {a.name}
                                <button disabled={!active} onClick={()=>removeFile(key,a,files,setFiles,fileSize,setFileSize,nameArray)}>X</button>     
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
        <ModalAlert header="Вы действительно хотите удалить" 
        active={modalActive} 
        setActive={setModalActive} 
        funRes={delFile}
        />
        </div>
    );
});

export default OrderStatus;