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
        label: "crContract",
        labelRu: "Создан договор(контракт)"
    },
    {
        value: 3,
        label: "siContract",
        labelRu: "Подписан договор(контракт)"
    },
    {
        value: 4,
        label: "paid",
        labelRu: "Оплата произведена"
    },   
    {
        value: 5,
        label: "shipment",
        labelRu: "Создана реализация(товар в пути)"
    },
    {
        value: 6,
        label: "received",
        labelRu: "Товар получен"
    },
]

const AskStatus = observer(({askId}) => {

    const[status,setStatus] = useState(1)
    const[prevStatus,setPrevStatus] = useState(1)
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
    const {myalert} = useContext(Context);
    const [author, setAuthor] = useState()
    const [winner, setWinner] = useState()
    const {user} = useContext(Context);  

    const send=async()=>{
        const data = new FormData();
        filesCrContract?.forEach((item)=>{data.append("file", item);data.append("CrContractfiles", item.name)})
        filesSiContract?.forEach((item)=>{data.append("file", item);data.append("SiContractfiles", item.name)})
        filesPaid?.forEach((item)=>{data.append("file", item);data.append("Paidfiles", item.name)})
        filesShipment?.forEach((item)=>{data.append("file", item);data.append("Shipmentfiles", item.name)})
        filesReceived?.forEach((item)=>{data.append("file", item);data.append("Receivedfiles", item.name)})
        data.append("AskId", askId)
        data.append("Author", author)
        data.append("Winner", winner)
        data.append("PrevStatus", JSON.stringify(statusOrder.find(item=>item.value==prevStatus)))
        data.append("Status", JSON.stringify(statusOrder.find(item=>item.value==status)))
        data.append("DeletedFiles", JSON.stringify(deletedFiles))
        const result = await AskService.setStatus(data)
        if (result.status===200){
            myalert.setMessage("Успешно");
            setPrevStatus(status)
          } else {
            myalert.setMessage(result?.data?.message)
        }
    }

    useEffect(() => {
        AskService.getStatus(askId).then((result)=>{
            if(result.Status){
                setStatus(result?.Status?.Status?.value)
                setPrevStatus(result?.Status?.Status?.value)
                setFilesCrContract(result?.Status?.CrContract || [])
                setFilesSiContract(result?.Status?.SiContract || [])
                setFilesPaid(result?.Status?.Paidfiles || [])
                setFilesShipment(result?.Status?.Shipmentfiles || [])
                setFilesReceived(result?.Status?.Receivedfiles || [])
            }
            setAuthor(result.Author)
            setWinner(result.Winner)
        })
      },[user.user]);
    
    const removeFile = async(id,a,files,setFiles,fileSize,setFileSize) => {
        if(a.originalname){
            const result = await AskService.deleteFile({file:a,askId})
            if (result.status===200){
                myalert.setMessage("Успешно");
                setPrevStatus(status)
              } else {
                myalert.setMessage(result?.data?.message)
            }
        }
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
                return inputFiles(active,filesCrContract,setFilesCrContract,fileSizeCrContract,setFileSizeCrContract) 
            case 3:
                return inputFiles(active,filesSiContract,setFilesSiContract,fileSizeSiContract,setFileSizeSiContract)
            case 4:
                return inputFiles(active,filesPaid,setFilesPaid,fileSizePaid,setFileSizePaid)
            case 5:
                return inputFiles(active,filesShipment,setFilesShipment,fileSizeShipment,setFileSizeShipment)
            case 6:
                return inputFiles(active,filesReceived,setFilesReceived,fileSizeReceived,setFileSizeReceived) 
            default:
              break;
        }
    }
    const inputFiles = (active, files,setFiles,fileSize,setFileSize) => {
        return(
            <div>
                Можете прикрепить файлы подписанных документов.
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
                                <button disabled={!active} onClick={()=>removeFile(key,a,files,setFiles,fileSize,setFileSize)}>X</button>     
                            </div>
                        :
                            <div>
                                {a.name}
                                <button disabled={!active} onClick={()=>removeFile(key,a,files,setFiles,fileSize,setFileSize)}>X</button>     
                            </div>
                        }
                    </div>
                    )})}  
            </div> 
        )
    }
    const getChoise =()=>{
        if(user.user.id === author){
            return (
                <Form.Control
                        as="select" 
                        onChange={(e)=>setStatus(e.target.value)}        
                    >       
                            <option>Выбрать</option>
                            <option value="2">Создан договор(контракт)</option>
                            <option value="3">Подписан договор(контракт)</option>
                            <option value="4">Оплата произведена</option>
                            <option value="6">Товар получен</option>
                </Form.Control>
            )
        }else if(user.user._id === winner){
            return (
                <Form.Control
                as="select" 
                onChange={(e)=>setStatus(e.target.value)}        
                >       
                    <option>Выбрать</option>
                    <option value="2">Создан договор(контракт)</option>
                    <option value="3">Подписан договор(контракт)</option>
                    <option value="5">Создана реализация(товар в пути)</option>
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