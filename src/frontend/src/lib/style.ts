import { DefaultTheme, createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Roboto', 'open sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    }

    ol, ul {
        list-style: none;
    }

    li > ol,
    li > ul {
        margin-left: 1rem;
    }

    ol > li:not(:first-child),
    ul > li:not(:first-child) {
        margin-top: 0.6rem;
    }

    li {
        padding: 0.4rem 0.6rem;
        font-weight: bold;
    }
`;

export const theme: DefaultTheme = {
    spacer: {
        xs: '0.4rem',
        sm: '0.6rem',
        md: '1rem',
        lg: '1.8rem',
        xl: '2.6rem',
    },
    color: {
        main: {
            dark: '#FCAA2B',
            light: '#FCDC2A',
        },
        secondary: {
            dark: '#A89122',
            light: '#87A922',
        },
        bg: {
            dark: '#1E3328',
            light: '#0D3320',
        },
        white: {
            light: '#FFF',
            dark: '#2F2F2F',
        },
        black: {
            light: '#2F2F2F',
            dark: '#7F7F7F',
            lighter: '#1D1D1D',
            darker: '#9F9F9F',
            veryLight: '#88888',
            veryDark: '#000',
        },
    },
};
