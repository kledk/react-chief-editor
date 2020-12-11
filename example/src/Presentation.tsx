import React from "react";
import {
  HeadingsAddon,
  BoldAddon,
  ItalicAddon,
  UnderlineAddon,
  StrikethroughAddon,
  ImageAddon,
  ListsAddon,
  ParagraphAddon,
  ChiefPresentation,
  TextColorAddon,
  LinkAddon
} from "react-chief-editor";
import styled from "styled-components";
import lorem from "./lorem.json";

const ContentStyle = styled.div`
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  font-size: 18px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: white;
  }
  a {
    color: rgb(234 66 205);
  }
`;

function Presentation() {
  return (
    <div style={{ flex: 1 }}>
      <ContentStyle>
        <ChiefPresentation
          value={lorem}
          presenters={[
            ParagraphAddon.Presenter,
            BoldAddon.Presenter,
            ItalicAddon.Presenter,
            StrikethroughAddon.Presenter,
            UnderlineAddon.Presenter,
            HeadingsAddon.Presenter,
            LinkAddon.Presenter,
            ListsAddon.Presenter,
            ImageAddon.Presenter,
            TextColorAddon.Presenter
          ]}
        ></ChiefPresentation>
      </ContentStyle>
    </div>
  );
}

export default Presentation;
