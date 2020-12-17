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
import { ContentStyle } from "./ContentStyle";
import lorem from "./lorem.json";
import redia from "./redia.json";

function Presentation() {
  return (
    <div style={{ flex: 1 }}>
      <ContentStyle>
        <ChiefPresentation
          value={redia}
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
