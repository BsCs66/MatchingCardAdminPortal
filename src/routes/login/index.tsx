import { useCallback, useContext, useState } from "react"
import { loginFirebase } from "../../composables/authen";
import { Spinner } from "../../components/shared/spinner";
import GlobalContext from "../../context/context";
import { AlertType } from "../../components/shared/toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { alert } = useContext(GlobalContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidating, setIsValidating] = useState(false)

    const login = useCallback(async (email: string, password: string) => {
        setIsValidating(true)
        try {
            await loginFirebase(email, password);
            navigate('/');
        } catch (error) {
            alert({type: AlertType.Error, message: 'Email or password is incorrect!'})
        } finally {
            setIsValidating(false)
        }
    }, [navigate, alert]);

    return (
        <>
            <div className="flex h-screen items-center bg-gray-200">
                <div className="w-fit m-auto">
                    <div className="w-96 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden">
                        <Spinner loading={isValidating} />
                        <div className="m-auto w-fit flex-col justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <h5 className="text-xl text-center font-medium text-gray-900 dark:text-white">
                                Login
                            </h5>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={isValidating}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={isValidating}
                            />
                        </div>
                        <button
                            type="submit"
                            className={(email.trim().length === 0 || password.length === 0 || isValidating ? '!bg-gray-400 hover:!bg-gray-400 ' : '') + "w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"}
                            disabled={email.trim().length === 0 || password.length === 0 || isValidating}
                            onClick={() => login(email, password)}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}