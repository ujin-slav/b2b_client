import Auth from "../pages/Auth";
import B2B from "../pages/B2b"
import CardAsk from "../pages/CardAsk";
import CreateAsk from "../pages/CreateAsk";
import Forgot from "../pages/Forgot";
import Registration from "../pages/Registration";
import Reset from "../pages/Reset";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import MyOffers from "../pages/MyOffers";
import ModifyAsk from "../pages/ModifyAsk";
import CatOrg from "../pages/CatOrg";
import MyContr from "../pages/MyContr";
import Chat from "../pages/Chat";
import ChatPage from "../pages/ChatPage";


export const ADMIN_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const RESET = '/reset'
export const FORGOT = '/forgot'
export const REGISTRATION_ROUTE = '/registration'
export const B2B_ROUTE = '/'
export const CARDASK = '/cardask'
export const CREATEASK = '/createask'
export const DOWNLOAD = '/download'
export const PROFILE = '/profile'
export const MYORDERS = '/myorders'
export const MYOFFERS = '/myoffers'
export const MODIFYASK = '/modifyask'
export const CATORG = '/catorg'
export const MYCONTR = '/mycontr'
export const CHAT = '/chat'

export const authRoutes = [
    {
        path: CREATEASK,
        Component: CreateAsk
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration
    },
    {
        path: B2B_ROUTE,
        Component: B2B
    },
    {
        path: RESET + "/:token",
        Component: Reset
    },
    {
        path: FORGOT,
        Component: Forgot
    },
    {
        path: CARDASK + '/:id',
        Component: CardAsk
    },
    {
        path: CREATEASK,
        Component: CreateAsk
    },
    {
        path: DOWNLOAD,
        Component: CreateAsk
    },
    {
        path: MYORDERS,
        Component: MyOrders
    },
    {
        path: PROFILE,
        Component: Profile
    },
    {
        path: MYOFFERS,
        Component: MyOffers
    },
    {
        path: MODIFYASK + '/:id',
        Component: ModifyAsk
    },
    {
        path: CATORG,
        Component: CatOrg
    },
    {
        path: MYCONTR,
        Component: MyContr
    },
    {
        path: CHAT,
        Component: ChatPage
    }
]

