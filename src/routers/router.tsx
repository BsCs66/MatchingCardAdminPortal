import { Route, NonIndexRouteObject, Routes, useNavigate } from "react-router-dom";
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
    useMemo(async () => {
      let isObserveOnInitial = false;
      observeAuth(async (user) => {
        console.log('user', user)
        if (!user) {
          console.log(1)
          if (!isObserveOnInitial) {
            console.log(2)
            navigate('/login')
            isObserveOnInitial = true;
          }
          return;
        }
        isObserveOnInitial = true;
      });
    }, []);

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
