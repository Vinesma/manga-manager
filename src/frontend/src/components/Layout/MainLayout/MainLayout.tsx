import { Button } from '~/components/Elements/Button';
import { Container, Header, PageContent, SideNav } from './MainLayout.style';

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Container>
            <Header />
            <SideNav>
                <ul>
                    <li>
                        Books
                        <ul>
                            <li>
                                <Button variant="unstyled">Add New</Button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </SideNav>
            <PageContent>{children}</PageContent>
        </Container>
    );
};
