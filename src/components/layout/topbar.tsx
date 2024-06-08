import { useCallback, useContext } from "react";
import GlobalContext from "../../context/context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutFirebase } from "../../composables/authen";
import { AlertType } from "../shared/toast";

function LinkButton(props: { isActive: boolean, link: string, title: string }) {
    return (
        <Link to={props.link}>
            <button className={"flex items-center gap-2 focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-4 py-2 text-center " + (props.isActive ? 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 text-white' : 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 text-black')}>
                {props.title}
            </button>
        </Link>
    )
}

export default function Topbar() {
    const { alert } = useContext(GlobalContext);
    const navigate = useNavigate();
    const location = useLocation();

    const logout = useCallback(async () => {
        try {
            await logoutFirebase();
            localStorage.removeItem('uid')
            navigate('/login');
            alert({type: AlertType.Success, message: 'Logout successfully!'})
        } catch (error) {
            alert({type: AlertType.Error, message: 'Email or password is incorrect!'})
        }
    }, [alert, navigate])

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 px-4 border">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Match Word</span>
                </Link>
                
                <div className="flex items-center gap-2" id="navbar-default">
                    <LinkButton link="/" title="Dashboard" isActive={location.pathname==='/'} />
                    <LinkButton link="/management" title="Management" isActive={location.pathname.startsWith('/management')} />
                    <button
                        type="button"
                        className="flex items-center gap-2 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-2 text-center"
                        onClick={logout}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                        <p>Logout</p>
                    </button>
                </div>
            </div>
        </nav>
    )
}