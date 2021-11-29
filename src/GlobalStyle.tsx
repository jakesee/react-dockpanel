import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    :root {
        --fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

        --fontMassive: 2.5rem;
        --fontHuge: 1.5rem;
        --fontLarge: 1.2rem;
        --fontRegular: 1.0rem;
        --fontSmall: 0.86rem;
        --fontTiny: 0.71rem;

        --fontColor: #272822;
    }

    * {
        font-family: var(--fontFamily);
        color: var(--fontColor);
        font-size: 12px;
        box-sizing: border-box;
    }

    html, body {
        padding: 0;
        margin: 0;
    }

    div {
        font-size: var(--fontRegular);
    }
`
