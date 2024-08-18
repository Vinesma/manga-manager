import { forwardRef } from 'react';
import { PrimaryButton, SecondaryButton, DangerButton, UnstyledButton } from './Button.style';

const variants = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
    danger: DangerButton,
    unstyled: UnstyledButton,
};

type Size = 'sm' | 'md' | 'lg';

type IconProps =
    | { startIcon: React.ReactElement; endIcon?: never }
    | { endIcon: React.ReactElement; startIcon?: never }
    | { endIcon?: undefined; startIcon?: undefined };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
    size?: Size;
    isLoading?: boolean;
} & IconProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            type = 'button',
            variant = 'primary',
            size = 'md',
            isLoading = false,
            startIcon,
            endIcon,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const StyledButton = variants[variant];

        return (
            <StyledButton ref={ref} type={type} className={className} size={size} {...props}>
                {/* {isLoading && <Spinner/>} */}
                {!isLoading && startIcon}
                <span>{children}</span>
                {!isLoading && endIcon}
            </StyledButton>
        );
    }
);

Button.displayName = 'Button';
