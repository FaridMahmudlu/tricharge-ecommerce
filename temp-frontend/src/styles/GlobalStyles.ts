import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #ffffff;
    color: #1a202c;
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 16px;
    color: #1a202c;
  }

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 18px;
  }

  p {
    margin-bottom: 16px;
    color: #4a5568;
  }

  a {
    color: #2c5282;
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #4a5568;
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    transition: all 0.2s ease-in-out;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: #1a202c;
    background-color: #f8f9fa;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease-in-out;

    &:focus {
      outline: none;
      border-color: #2c5282;
      box-shadow: 0 0 0 2px rgba(44, 82, 130, 0.25);
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f8f9fa;
  }

  ::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;

    &:hover {
      background: #4a5568;
    }
  }

  /* Focus styles */
  button:focus {
    outline: none;
  }

  button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(44, 82, 130, 0.25);
  }

  /* Remove default focus outline for mouse users */
  button:focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
  }

  /* Skip link for accessibility */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #2c5282;
    color: white;
    padding: 8px;
    z-index: 100;
    transition: top 0.2s ease-in-out;

    &:focus {
      top: 0;
    }
  }
`; 