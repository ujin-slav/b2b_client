import Auth from "../pages/Auth";
import B2B from "../pages/B2b"
import CardAsk from "../pages/CardAsk";
import CardPriceAsk from "../pages/CardPriceAsk";
import CreateAsk from "../pages/CreateAsk";
import CreateSpecOffer from "../pages/CreateSpecOffer";
import CreatePriceAsk from "../pages/CreatePriceAsk";
import CreatePriceAskFiz from "../pages/CreatePriceAskFiz";
import Forgot from "../pages/Forgot";
import Registration from "../pages/Registration";
import Reset from "../pages/Reset";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import MyOrdersPrice from "../pages/MyOrdersPrice";
import MyOffers from "../pages/MyOffers";
import MySpecOffers from "../pages/MySpecOffers";
import ModifyAsk from "../pages/ModifyAsk";
import ModifySpecOffer from "../pages/ModifySpecOffer";
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
import InvitedPrice from "../pages/InvitedPrice";
import Test from "../pages/Test";
import UploadPrice from "../pages/UploadPrice";
import Prices from "../pages/Prices";
import MyPrice from "../pages/MyPrice";
import CardSpecOffer from "../pages/CardSpecOffer";
import InvitedSpecOffer from "../pages/InvitedSpecOffer";
import QuestForMe from "../pages/QuestForMe";
import QuestFromMe from "../pages/QuestFromMe";

export const ADMIN_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const RESET = '/reset'
export const FORGOT = '/forgot'
export const REGISTRATION_ROUTE = '/registration'
export const B2B_ROUTE = '/'
export const CARDASK = '/cardask'
export const CARDPRICEASK = '/cardpriceask'
export const CARDSPECOFFER = '/cardspecoffer'
export const CREATEASK = '/createask'
export const CREATESPECOFFER = '/createspecoffer'
export const CREATEPRICEASK = '/createpriceask'
export const CREATEPRICEASKFIZ = '/createpriceaskfiz'
export const DOWNLOAD = '/download'
export const PROFILE = '/profile'
export const MYORDERS = '/myorders'
export const MYORDERSPRICE = '/myordersprice'
export const MYOFFERS = '/myoffers'
export const MYSPECOFFERS = '/myspecoffers'
export const MODIFYSPECOFFER = '/modifyspecoffer'
export const MODIFYASK = '/modifyask'
export const MODIFYPRICEASK = '/modifypriceask'
export const CATORG = '/catorg'
export const MYCONTR = '/mycontr'
export const CHAT = '/chat'
export const QUEST = '/quest'
export const QUESTFORME = '/questforme'
export const QUESTFROMME = '/questfromme'
export const ORGINFO = '/orginfo'
export const HELP = '/help'
export const ABOUT = '/about'
export const UPLOADPRICE = '/uploadprice'
export const MYPRICE = '/myprice'
export const PRICES = '/prices'
export const INVITED = '/invited'
export const INVITEDPRICE = '/invitedprice'
export const INVITEDSPECOFFER = '/invitedspecoffer'
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
        path: CARDPRICEASK + '/:id',
        Component: CardPriceAsk
    },
    {
        path: CARDSPECOFFER + '/:id',
        Component: CardSpecOffer
    },
    {
        path: CREATEASK,
        Component: CreateAsk
    },
    {
        path: CREATESPECOFFER,
        Component: CreateSpecOffer
    },
    {
        path: CREATEPRICEASK + '/:idorg/:idprod',
        Component: CreatePriceAsk
    },
    {
        path: CREATEPRICEASKFIZ + '/:idorg/:idprod',
        Component: CreatePriceAskFiz
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
        path: MYSPECOFFERS,
        Component: MySpecOffers
    },
    {
        path: MODIFYASK + '/:id',
        Component: ModifyAsk
    },
    {
        path: MODIFYSPECOFFER + '/:id',
        Component: ModifySpecOffer
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
        path: QUESTFORME,
        Component: QuestForMe
    },
    {
        path: QUESTFROMME,
        Component: QuestFromMe
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
        path: INVITEDPRICE,
        Component: InvitedPrice
    },
    {
        path: INVITEDSPECOFFER,
        Component: InvitedSpecOffer
    },
    {
        path: UPLOADPRICE,
        Component: UploadPrice
    },
    {
        path: PRICES,
        Component: Prices
    },
    {
        path: MYPRICE,
        Component: MyPrice
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
        path: CARDSPECOFFER + '/:id',
        Component: CardSpecOffer
    },
    {
        path: CREATEPRICEASKFIZ + '/:idorg/:idprod',
        Component: CreatePriceAskFiz
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
        path: UPLOADPRICE,
        Component: UploadPrice
    },
    {
        path: PRICES,
        Component: Prices
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

