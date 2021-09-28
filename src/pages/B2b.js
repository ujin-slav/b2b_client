import { useEffect ,useContext} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import { fetchAsks } from "../http/askAPI";
import TableAsk from "../components/TableAsk";
import SearchForm from "../components/SearchForm";

const B2b = observer(() => {

    return (
        <div>
            <SearchForm/>
           <TableAsk/>
        </div>
    );
});

export default B2b;