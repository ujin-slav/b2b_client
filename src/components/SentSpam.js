import React,{useEffect,useState,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {Card, Form, InputGroup,Button,Col,Row} from "react-bootstrap";
import {Context} from "../index";
import ModalAlert from '../components/ModalAlert';
import AdminService from '../services/AdminService'
import ReactPaginate from "react-paginate";

const SentSpam = ({Ask,SpecOffer}) => {

    const [list,setList] = useState([]);
    const [modalActive,setModalActive] = useState(false);
    const {myalert} = useContext(Context);
    const[fetching,setFetching] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [startDate, setStartDate] = useState(new Date(2022, 0, 1, 0, 0, 0, 0))
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    const[limit,setLimit] = useState(10);
    const {id} = useParams();

    useEffect(() => {
        setLoading(true)
        AdminService.getSentSpamByAsk({
            Ask,
            limit,
            page:currentPage,
            }).then((data)=>{
                    console.log(data)
                    // setList(data.docs);
                    // setPageCount(data.totalPages);
                    // setCurrentPage(data.page)
        }).finally(
            ()=>setLoading(false)
        )
    },[fetching]);

    const fetchPage = async (currentPage) => {
        setCurrentPage(currentPage)
        setFetching(!fetching)
    };

    const handlePageClick = async (data) => {
        await fetchPage(data.selected + 1);
    }

    return (    
        <div className='my-2 mx-2'>
            {list?.map((item,index)=>{
                <Card className="mx-2 my-1">
                    {item}
                </Card>
            })}
            <ReactPaginate
            forcePage = {currentPage-1}
            previousLabel={"предыдущий"}
            nextLabel={"следующий"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
            />
        </div>
    );
};

export default SentSpam;