import styled from 'styled-components';

export const Container = styled.div`
    display: grid;
    grid-template-columns: 210px 1fr;
    grid-template-rows: 100px 1fr;

    height: 100vh;
    max-height: 100vh;

    background-color: ${({ theme }) => theme.color.bg.light};
`;

export const Header = styled.header`
    grid-column: 1 / -1;
    grid-row-start: 1;

    background-color: ${({ theme }) => theme.color.bg.dark};
`;

export const SideNav = styled.nav`
    padding: ${({ theme }) => theme.spacer.md};
    grid-column-start: 1;
    grid-row-start: 2;

    background-color: ${({ theme }) => theme.color.bg.dark};
    color: ${({ theme }) => theme.color.white.light};
`;

export const PageContent = styled.div`
    grid-column-start: 2;
    grid-row-start: 2;
    overflow-y: auto;
`;
