import 'styled-components';

type HexColor = `#${string}`;

interface Color {
    light: HexColor;
    dark: HexColor;
}

interface NeutralColor extends Color {
    lighter: HexColor;
    veryLight: HexColor;
    darker: HexColor;
    veryDark: HexColor;
}

declare module 'styled-components' {
    export interface DefaultTheme {
        spacer: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };

        color: {
            main: Color;
            secondary: Color;
            bg: Color;
            white: Color;
            black: NeutralColor;
        };
    }
}
