import { Route, NonIndexRouteObject, Routes, useNavigate, useLocation } from "react-router-dom";
import LoginPage from "../routes/login";
import HomePage from "../routes";
import NotFoundPage from "../routes/not-found";
import { useMemo } from "react";
import { observeAuth } from "../composables/authen";

interface RouterObject extends NonIndexRouteObject {
    title?: string
}

const routers: RouterObject[] = [
    {
        title: 'Login',
        path: '/login',
        element: <LoginPage />,
    },
    {
        title: 'Dashboard',
        path: '/',
        element: <HomePage />,
    },
]

export function Page(props: {element: React.ReactNode, title?: string}) {
    document.title = `Matching Card | ${props.title || 'Not Found'}`;
    return <>{props.element}</>;
}

export default function Router() {
    const navigate = useNavigate();
    const location = useLocation();
    useMemo(async () => {
        let isObserveOnInitial = false;
        return observeAuth(async (user) => {
            if (!user) {
                if (!isObserveOnInitial) {
                    navigate('/login')
                    isObserveOnInitial = true;
                }
                return;
            } else if (location.pathname.startsWith('/login')) {
                navigate('');
            }
            isObserveOnInitial = true;
        });
    }, [navigate, location]);

    return (
        <Routes>
            {routers.map((router, index) => (
                <Route
                    key={index}
                    path={router.path}
                    element={<Page element={router.element} title={router.title} />}
                />
            ))}
            <Route path="*" element={<Page element={<NotFoundPage />} />} />
        </Routes>
    )
}
