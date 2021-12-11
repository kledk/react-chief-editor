import styled, { css } from "styled-components";

const devicePixelRatio = window.devicePixelRatio;

export const ContentStyle = styled.div<{
  width?: number | string;
}>`
  display: flex;
  flex: 1;
  flex-direction: column;
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  /* font-size: calc((25vw - 4.5rem) / 7); */

  font-size: ${({ width }) => {
    const ratio = devicePixelRatio * 20;
    return typeof width === "string"
      ? `calc(${width}/${ratio})`
      : `${width / ratio}px`;
  }};
  h1,
  h2,
  p {
    padding: 20px;
  }
  h1 {
    color: #ffffff;
    font-size: 3em;
  }
  h2 {
    color: #ffffff;
    font-size: 1.8em;
  }
  h3 {
    color: #202020;
    font-size: 1.7em;
  }
  h4 {
    color: #202020;
    font-size: 1.6em;
  }
  h5 {
    color: #202020;
    font-size: 1.5em;
  }
  h6 {
    color: #202020;
    font-size: 1.4em;
  }
  a {
    color: rgb(234 66 205);
  }
`;
