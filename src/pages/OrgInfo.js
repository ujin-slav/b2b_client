import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {fetchUser} from '../http/askAPI';
import {Card, Table, Col, Container, Row, Lable,Form,Button} from "react-bootstrap";
import PriceService from '../services/PriceService'
import dateFormat, { masks } from "dateformat";
import ModalCT from '../components/ModalCT';
import MessageBox from '../components/MessageBox'
import {CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
import SpecOffersTable from "../components/SpecOffersTable";
import Prices from "../components/Price";
import TableAsk from "../components/TableAsk";

const OrgInfo = () => {
    const {id} = useParams();
    const [org, setOrg] = useState();
    const[fetching,setFetching] = useState(true);
    const [price,setPrice] = useState([]); 
    const[visible,setVisible] = useState(false);
    const[totalDocs,setTotalDocs] = useState(0);
    const[currentPage,setCurrentPage] = useState();
    const [modalActiveMessage,setModalActiveMessage] = useState(false)
    const[search,setSearch] = useState("");
    let limit = 30

    useEffect(() => {
        if(fetching){
            if(price.length===0 || price.length<totalDocs) {
            PriceService.getPrice({page:currentPage,limit,search,org:id}).then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice([...price, ...data.docs]);
                setCurrentPage(prevState=>prevState + 1)
            }).finally(()=>setFetching(false))
            }
        }
    },[fetching]);

    useEffect(() => {
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

    useEffect(() => {
        fetchUser(id).then((data)=>{
            setOrg(data)
        })

      },[]);

    const handleSearch = (e) =>{
        PriceService.getPrice({page:currentPage,limit,search,org:id}).
            then((data)=>{
                setTotalDocs(data.totalDocs);
                setPrice(data.docs);
                setCurrentPage(prevState=>prevState + 1)
                setSearch(e.target.value)
        }).finally(
            ()=>setFetching(false)
        )
    }

    return (
        <div>
            <div>
            <Container style={{width: "80%"}}>
            <Row>
                <Col>
                <Form>
                     <Table >
                        <tbody>
                            <tr>
                            <td>??????</td>
                            <td>{org?.name}
                            <Button style={{fontSize:"13px",padding:"2px"}} 
                                    onClick={()=>setModalActiveMessage(true)}>
                                    ???????????????? ??????????????????
                            </Button>
                            </td>
                            </tr>
                            <tr>
                            <td>???????????????? ??????????????????????</td>
                            <td>{org?.nameOrg}</td>
                            </tr>
                            <tr>
                            <td>?????????? ??????????????????????</td>
                            <td>{org?.adressOrg}</td>
                            </tr>
                            <tr>
                            <td>??????</td>
                            <td>{org?.inn}</td>
                            </tr>
                            <tr>
                            <td>???????????????????? ??????????????</td>
                            <td> 
                                {org?.telefon}
                            </td>
                            </tr>
                        </tbody>
                    </Table>
                    </Form>
                </Col>
            </Row>
            <Row>
            <Row>
                <TableAsk/>
            </Row>
            <Row>
                <SpecOffersTable/>
            </Row>
                <Card className='section'>
                <Card.Header className='sectionHeader headerPrices' 
                onClick={()=>setVisible(!visible)}>
                <div className='sectionName'>
                 {visible ?
                        <CaretUpFill className='caret'/>
                        :
                        <CaretDownFill className='caret'/>
                    }
                    ??????????
                </div>
                </Card.Header>
                {visible ?
                <div>
                 <Form.Group className="mx-auto my-2">
                 <Form.Label>??????????:</Form.Label>
                 <Form.Control
                     onChange={handleSearch}
                     placeholder="?????????????? ???????????????? ?????????????? ?????? ???????????????? ????????????????"
                 />
                </Form.Group>
                <Table>
                    <thead>
                        <tr>
                            <th>??????????????</th>
                            <th>????????????????????????</th>
                            <th>????????</th>
                            <th>??????????????</th>
                            <th>????????</th>
                        </tr>
                        </thead>
                        <tbody>
                            {price?.map((item,index)=>
                                <tr key={index}>
                                    <td>{item?.Code}</td>
                                    <td>{item?.Name}</td>
                                    <td>{item?.Price}</td>
                                    <td>{item?.Balance}</td>
                                    <td>{dateFormat(item.Date, "dd/mm/yyyy HH:MM:ss")}</td>
                                </tr>
                            )}
                        </tbody>
                 </Table>
                 </div>
                 :
                 <div></div>
                }
                </Card>
            </Row>
        </Container>
        </div>
        <ModalCT 
                  header="??????????????????" 
                  active={modalActiveMessage}
                  component={<MessageBox author={org} setActive={setModalActiveMessage}/>}
                  setActive={setModalActiveMessage}   
        />
        </div>
    );
};

export default OrgInfo;