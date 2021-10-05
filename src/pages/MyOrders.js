import {observer} from "mobx-react-lite";
import TableAskUser from "../components/TableAskUser";

const MyOrders = observer(() => {
    return (
        <div>
           <TableAskUser/>
        </div>
    );
});

export default MyOrders;