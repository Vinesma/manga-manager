import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { MainLayout } from '~/components/Layout/MainLayout';

export const App = () => {
    return (
        <MainLayout>
            <Suspense
                fallback={
                    <div>
                        <p>loading</p>
                    </div>
                }
            >
                <Outlet />
            </Suspense>
        </MainLayout>
    );
};
