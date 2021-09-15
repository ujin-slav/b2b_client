import { useEffect ,useContext} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import { fetchAsks } from "../http/askAPI";
import TableAsk from "../components/TableAsk";
import SearchForm from "../components/SearchForm";

const B2b = observer(() => {
    const {ask} = useContext(Context);

    useEffect(() => {
        fetchAsks().then((data)=>{
            ask.setAsk(data)
        })
      },[]);

    if (ask.isLoading){
        return <h1>Загрузка</h1>
    }
    return (
        <div>
           <TableAsk/>
        </div>
    );
});

export default B2b;