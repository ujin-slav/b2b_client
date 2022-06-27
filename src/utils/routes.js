import Auth from "../pages/Auth";
import B2B from "../pages/B2b"
import CardAsk from "../pages/CardAsk";
import CreateAsk from "../pages/CreateAsk";
import CreatePriceAsk from "../pages/CreatePriceAsk";
import Forgot from "../pages/Forgot";
import Registration from "../pages/Registration";
import Reset from "../pages/Reset";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import MyOrdersPrice from "../pages/MyOrdersPrice";
import MyOffers from "../pages/MyOffers";
import ModifyAsk from "../pages/ModifyAsk";
import ModifyPriceAsk from "../pages/ModifyPriceAsk";
import CatOrg from "../pages/CatOrg";
import MyContr from "../pages/MyContr";
import ChatPage from "../pages/ChatPage";
import Quest from "../pages/Quest";
import OrgInfo from "../pages/OrgInfo";
import Help from "../pages/Help";
import About from "../pages/About";
import Activate from "../pages/Activate";
import Invited from "../pages/Invited";
import Test from "../pages/Test";
import MyPrice from "../pages/Price";
import Price from "../pages/Prices";

export const ADMIN_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const RESET = '/reset'
export const FORGOT = '/forgot'
export const REGISTRATION_ROUTE = '/registration'
export const B2B_ROUTE = '/'
export const CARDASK = '/cardask'
export const CREATEASK = '/createask'
export const CREATEPRICEASK = '/createpriceask'
export const DOWNLOAD = '/download'
export const PROFILE = '/profile'
export const MYORDERS = '/myorders'
export const MYORDERSPRICE = '/myordersprice'
export const MYOFFERS = '/myoffers'
export const MODIFYASK = '/modifyask'
export const MODIFYPRICEASK = '/modifypriceask'
export const CATORG = '/catorg'
export const MYCONTR = '/mycontr'
export const CHAT = '/chat'
export const QUEST = '/quest'
export const ORGINFO = '/orginfo'
export const HELP = '/help'
export const ABOUT = '/about'
export const MYPRICE = '/price'
export const PRICE = '/prices'
export const INVITED = '/invited'
export const TEST = '/test'
export const ACTIVATE = '/activate'

export const authRoutes = [
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
        path: CREATEPRICEASK,
        Component: CreatePriceAsk
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
        path: MYORDERSPRICE,
        Component: MyOrdersPrice
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
        path: MODIFYPRICEASK + '/:id',
        Component: ModifyPriceAsk
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
    },
    {
        path: QUEST,
        Component: Quest
    },
    {
        path: ORGINFO +  '/:id',
        Component: OrgInfo
    },
    {
        path: ABOUT,
        Component: About
    },
    {
        path: HELP,
        Component: Help
    },
    {
        path: ACTIVATE +  '/:activationLink',
        Component: Activate
    },
    {
        path: INVITED,
        Component: Invited
    },
    {
        path: MYPRICE,
        Component: MyPrice
    },
    {
        path: PRICE,
        Component: Price
    },
    {
        path: "*",
        Component: B2B
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
        Component: Auth
    },
    {
        path: MYORDERS,
        Component: Auth
    },
    {
        path: PROFILE,
        Component: Auth
    },
    {
        path: MYOFFERS,
        Component: Auth
    },
    {
        path: MODIFYASK + '/:id',
        Component: Auth
    },
    {
        path: CATORG,
        Component: CatOrg
    },
    {
        path: MYCONTR,
        Component: Auth
    },
    {
        path: CREATEPRICEASK,
        Component: CreatePriceAsk
    },
    {
        path: CHAT,
        Component: Auth
    },
    {
        path: QUEST,
        Component: Auth
    },
    {
        path: MYPRICE,
        Component: MyPrice
    },
    {
        path: PRICE,
        Component: Price
    },
    {
        path: ORGINFO +  '/:id',
        Component: OrgInfo
    },
    {
        path: INVITED,
        Component: Auth
    },
    {
        path: HELP,
        Component: Help
    },
    {
        path: ABOUT,
        Component: About
    },
    {
        path: ACTIVATE +  '/:activationLink',
        Component: Activate
    },
    {
        path: "*",
        Component: B2B
    },
    {
        path: TEST,
        Component: Test
    }
]

