import {React,useContext,useEffect,useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Card} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { fetchLentStatus } from "../http/askAPI";
import "../style.css";
import ReactPaginate from "react-paginate";

const LentStatus = observer(() => {
    const {askUser} = useContext(Context);
    const {user} = useContext(Context);
    const {myalert} = useContext(Context);
    const [deleteId,setDeleteId] = useState();
    const [modalActive,setModalActive] = useState(false);
    const history = useHistory();
    const [pageCount, setpageCount] = useState(0)
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(false)
    let limit = 10;

    useEffect(() => {
        if(user?.user?.id){
            fetchLentStatus({authorId:user.user.id,limit,page:currentPage}).then((data)=>{
                askUser.setAsk(data.docs)
                setpageCount(data.totalPages);
            })
        }
      },[loading]);

    const fetchPage = async (currentPage) => {
        fetchLentStatus({authorId:user.user.id,limit,page:currentPage}).then((data)=>{
        askUser.setAsk(data.docs)
    })};


    const handlePageClick = async (data) => {
      setCurrentPage(data.selected + 1)
      await fetchPage(data.selected + 1);
    };
    return (
      <div>
      <div className='parentSpecAsk'>
        {askUser?.getAsk().map((item, index)=>
          <div key={index} className='childSpecAsk'>
          <Card>
              <Card.Header>
              </Card.Header>
          </Card>      
        </div>
        )}  
     </div> 
      <ReactPaginate
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
})

export default LentStatus;