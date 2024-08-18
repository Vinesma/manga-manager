import { Spinner as StyledSpinner } from './Spinner.style';

type Size = 'sm' | 'md' | 'lg';

export type SpinnerProps = {
    size?: Size;
    variant?: string;
    className?: string;
};

export const Spinner = ({ size, variant, className }: SpinnerProps) => {
    return <StyledSpinner className={className}></StyledSpinner>;
};
