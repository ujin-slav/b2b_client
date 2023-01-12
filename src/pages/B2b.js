import {observer} from "mobx-react-lite";
import TableAskCard from "../components/TableAskCard";
import SearchForm from "../components/SearchForm";
import SpecOffersTable from "../components/SpecOffersTable";
import Prices from "../components/Price";
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