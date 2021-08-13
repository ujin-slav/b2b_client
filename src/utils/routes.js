import Auth from "../pages/Auth";
import B2B from "../pages/B2b"
import CardAsk from "../pages/CardAsk";
import CreateAsk from "../pages/CreateAsk";
import Forgot from "../pages/Forgot";
import Registration from "../pages/Registration";
import Reset from "../pages/Reset";

export const ADMIN_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const RESET = '/reset'
export const FORGOT = '/forgot'
export const REGISTRATION_ROUTE = '/registration'
export const B2B_ROUTE = '/'
export const CARDASK = '/cardask'
export const CREATEASK = '/createask'

export const authRoutes = [
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
    }
]
