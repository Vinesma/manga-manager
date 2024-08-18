import { styled } from 'styled-components';

export const PrimaryButton = styled.button<{ size: 'sm' | 'md' | 'lg' }>`
    padding-top: ${(props) =>
        props.size === 'lg' ? props.theme.spacer.md : props.theme.spacer.sm};
    padding-bottom: ${(props) =>
        props.size === 'lg' ? props.theme.spacer.md : props.theme.spacer.sm};
    padding-left: ${(props) => props.theme.spacer[props.size]};
    padding-right: ${(props) => props.theme.spacer[props.size]};

    background-color: ${(props) => props.theme.color.main.dark};
    color: ${(props) => props.theme.color.white.light};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.4s ease;

    &:hover {
        background-color: ${(props) => props.theme.color.main.light};
    }
`;

export const SecondaryButton = styled(PrimaryButton)`
    background-color: ${(props) => props.theme.color.secondary.dark};

    &:hover {
        background-color: ${(props) => props.theme.color.main.light};
    }
`;

export const DangerButton = styled(PrimaryButton)`
    background-color: red;
`;

export const UnstyledButton = styled.button`
    cursor: pointer;
    font-size: inherit;
    font-weight: inherit;
    border: none;

    background-color: transparent;
    color: inherit;
`;
