import { Route, NonIndexRouteObject, Routes, useNavigate } from "react-router-dom";
import LoginPage from "../routes/login";
import HomePage from "../routes";
import NotFoundPage from "../routes/not-found";
import { useMemo } from "react";
import { observeAuth } from "../composables/authen";
import ManagementPage from "../routes/management";

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
    {
        title: 'Management',
        path: '/management',
        element: <ManagementPage />,
    },
]

export function Page(props: {element: React.ReactNode, title?: string}) {
    document.title = `Match Word | ${props.title || 'Not Found'}`;
    return <>{props.element}</>;
}

export default function Router() {
    const navigate = useNavigate();

    useMemo(async () => {
        let isObserveOnInitial = false;
        return observeAuth(async (user) => {
            if (!user) {
                if (!isObserveOnInitial) {
                    navigate('/login')
                    isObserveOnInitial = true;
                }
                return;
            }
            isObserveOnInitial = true;
        });
    }, [navigate]);

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
