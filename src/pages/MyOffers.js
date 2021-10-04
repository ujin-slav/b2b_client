import { useEffect ,useContext} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import TableOffer from "../components/TableOffer";

const MyOffers = observer(() => {
    return (
        <div>
           <TableOffer/>
        </div>
    );
});

export default MyOffers;