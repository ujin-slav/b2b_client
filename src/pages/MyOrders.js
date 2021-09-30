import { useEffect ,useContext} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import TableAsk from "../components/TableAsk";

const MyOrders = observer(() => {
    const {user} = useContext(Context);  

    return (
        <div>
           <TableAsk authorId={user.user.id}/>
        </div>
    );
});

export default MyOrders;