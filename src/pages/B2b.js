import { useEffect ,useContext} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import { fetchAsks } from "../http/askAPI";
import TableAskCard from "../components/TableAskCard";
import SearchForm from "../components/SearchForm";
import SpecOffersTable from "../components/SpecOffersTable";
import Prices from "../components/Price";
import { urlToBase64 } from "blob-url-to-file";
import Carousel from "../components/Carousel";

const B2b = observer(() => {

    return (
        <div>
           <SearchForm/>
           <TableAskCard/>
           <SpecOffersTable/>
           <Prices/>
           <Carousel/>
        </div>
    );
});

export default B2b;