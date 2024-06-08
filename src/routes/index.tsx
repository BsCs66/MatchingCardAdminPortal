import { useCallback, useContext } from "react"
import { useNavigate } from "react-router-dom"
import GlobalContext from "../context/context";
import { logoutFirebase } from "../composables/authen";
import { AlertType } from "../components/shared/toast";

export default function HomePage() {
    const { alert } = useContext(GlobalContext);
    const navigate = useNavigate();

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
        <>
            <button onClick={logout}>Logout</button>
        </>
    )
}