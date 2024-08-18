import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from '~/lib/style';

const ErrorFallback = () => {
    <div>
        <h2>Something went wrong...</h2>
        <br />
        <button onClick={() => window.location.assign(window.location.origin)}>Refresh</button>
    </div>;
};

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Suspense fallback={<div>spinner</div>}>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <Router>{children}</Router>
            </ThemeProvider>
        </Suspense>
    );
};
