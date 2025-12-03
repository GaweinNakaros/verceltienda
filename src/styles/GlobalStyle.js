import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --color-primary: ${({ theme }) => theme.colors.primary};
    --color-accent: ${({ theme }) => theme.colors.accent};
  }
  body {
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f8f9fa;
    color: #212529;
    margin: 0;
  }
  a { text-decoration: none; }
  img { display: block; max-width: 100%; }
`;
