import { useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';

export const AppRoutes = () => {
    const commonRoutes = [{ path: '/login', element: <p></p> }];

    const routes = protectedRoutes;

    const element = useRoutes([...routes, ...commonRoutes]);

    return <>{element}</>;
};
