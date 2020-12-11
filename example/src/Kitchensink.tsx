import React, { useState } from "react";
import {
  Editor,
  Chief,
  // Addons
  HeadingsAddon,
  BoldAddon,
  ItalicAddon,
  UnderlineAddon,
  StrikethroughAddon,
  ImageAddon,
  ResetToParagraphAddon,
  PreventNewlineAddon,
  ListsAddon,
  BlockTabAddon,
  ParagraphAddon,
  LabelsAddon,
  // Block toolbar addon
  BlockInsert,
  BlockInsertControls,
  // Custom addon creation
  AddonProps,
  useRenderElement,
  InputWrapper,
  usePlugin,
  // Presentation
  ChiefPresentation,
  BoldControl,
  HeadingControl,
  ItalicControl,
  StrikethroughControl,
  UnderlineControl,
  HoverTools,
  ImageControl,
  ListControl,
  TextColorAddon,
  TextColorControl,
  LinkAddon,
  LinkControl,
  ParagraphControl,
  RenderControlProps,
  StyledToolBox,
  ToolsWrapper
} from "react-chief-editor";
import { Node, Element } from "slate";
import styled, { css } from "styled-components";
import MdiIcon from "@mdi/react";
import {
  mdiFormatParagraph,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiFormatHeader5,
  mdiFormatHeader6,
  mdiFormatListNumbered,
  mdiFormatListBulleted,
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatStrikethrough,
  mdiFormatUnderline,
  mdiImage,
  mdiLink,
  mdiFormatColorText
} from "@mdi/js";
import lorem from "./lorem.json";

function Icon(
  props: React.ComponentProps<typeof MdiIcon> & Partial<RenderControlProps>
) {
  console.log(props);
  return (
    <MdiIcon
      color={props.isActive ? props.theme?.colors?.primary : "#2b2b2b"}
      size={0.7}
      {...props}
    ></MdiIcon>
  );
}

const editorLabels = {
  "marks.bold": "Fed",
  "marks.italic": "Kursiv",
  "marks.strikethrough": "Gennemstreg",
  "marks.underline": "Understreg",
  "marks.textcolor": "Tekstfarve",
  "elements.image": "Billede",
  "elements.link": "Link",
  "elements.ordered-list": "Nummereret list",
  "elements.unordered-list": "Punkt list",
  "elements.link.placeholder": "Indsæt eller skriv link",
  "elements.link.btn.link": "Tilføj",
  "elements.link.btn.unlink": "Fjern",
  "elements.paragraph.hint": "Klik for at redigere",
  "elements.paragraph.placeholder": "Tekst",
  "elements.heading.h1.placeholder": "Overskrift 1",
  "elements.heading.h2.placeholder": "Overskrift 2",
  "elements.heading.h3.placeholder": "Overskrift 3",
  "elements.heading.h4.placeholder": "Overskrift 4",
  "elements.heading.h5.placeholder": "Overskrift 5",
  "elements.heading.h6.placeholder": "Overskrift 6"
};

function ExampleCustomAddon(props: AddonProps) {
  usePlugin({
    isVoid: isVoid => element =>
      Element.isElement(element) && element.type === "custom_void_element"
        ? true
        : isVoid(element)
  });

  useRenderElement({
    typeMatch: /custom_void_element/,
    renderElement: (props, editor) => {
      return (
        <div {...props.attributes}>
          <InputWrapper>
            <input type="text" />
          </InputWrapper>
          {props.children}
        </div>
      );
    }
  });

  return null;
}

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

function App() {
  const [value, setValue] = useState<Node[]>(lorem);

  console.log(value);

  return (
    <div style={{ flex: 1 }}>
      <ContentStyle>
        <Chief
          value={value}
          onChange={value => setValue(value)}
          theme={{
            overrides: {
              // StyledToolbarBtn: css`
              //   background-color: transparent;
              //   color: white;
              //   padding: 10px;
              //   &:hover {
              //     background-color: ${props =>
              //       // @ts-ignore
              //       props.disabled ? undefined : "#2d2d2d"};
              //   }
              // `,
              // StyledToolBox: css`
              //   border-radius: 20px;
              //   background-color: black;
              // `,
              // ui: css`
              //   /* font-family: monospace; */
              // `
            }
          }}
        >
          <LabelsAddon labels={editorLabels} />
          <ParagraphAddon />
          <BoldAddon />
          <ItalicAddon />
          <UnderlineAddon />
          <StrikethroughAddon />
          <HeadingsAddon />
          <ImageAddon />
          <ResetToParagraphAddon />
          <PreventNewlineAddon />
          <PreventNewlineAddon />
          <LinkAddon />
          <ListsAddon />
          <BlockTabAddon />
          <TextColorAddon />
          <div
            style={{
              marginLeft: 40
            }}
          >
            <BlockInsert>
              <StyledToolBox>
                <ToolsWrapper>
                  <ParagraphControl>
                    <Icon path={mdiFormatParagraph} />
                  </ParagraphControl>
                  <HeadingControl heading="h1">
                    <Icon path={mdiFormatHeader1} />
                  </HeadingControl>
                  <HeadingControl heading="h2">
                    <Icon path={mdiFormatHeader2} />
                  </HeadingControl>
                  <HeadingControl heading="h3">
                    <Icon path={mdiFormatHeader3} />
                  </HeadingControl>
                  <HeadingControl heading="h4">
                    <Icon path={mdiFormatHeader4} />
                  </HeadingControl>
                  <HeadingControl heading="h5">
                    <Icon path={mdiFormatHeader5} />
                  </HeadingControl>
                  <HeadingControl heading="h6">
                    <Icon path={mdiFormatHeader6} />
                  </HeadingControl>
                  <ListControl type="ordered-list">
                    <Icon path={mdiFormatListNumbered} />
                  </ListControl>
                  <ListControl type="unordered-list">
                    <Icon path={mdiFormatListBulleted} />
                  </ListControl>
                  <ImageControl>
                    <Icon path={mdiImage} />
                  </ImageControl>
                </ToolsWrapper>
              </StyledToolBox>
            </BlockInsert>
            <HoverTools>
              <BoldControl>
                {props => <Icon path={mdiFormatBold} {...props} />}
              </BoldControl>
              <ItalicControl>
                <Icon path={mdiFormatItalic} />
              </ItalicControl>
              <StrikethroughControl>
                <Icon path={mdiFormatStrikethrough} />
              </StrikethroughControl>
              <UnderlineControl>
                <Icon path={mdiFormatUnderline} />
              </UnderlineControl>
              <HeadingControl heading="h1">
                <Icon path={mdiFormatHeader1} />
              </HeadingControl>
              <HeadingControl heading="h2">
                <Icon path={mdiFormatHeader2} />
              </HeadingControl>
              <HeadingControl heading="h3">
                <Icon path={mdiFormatHeader3} />
              </HeadingControl>
              <HeadingControl heading="h4">
                <Icon path={mdiFormatHeader4} />
              </HeadingControl>
              <HeadingControl heading="h5">
                <Icon path={mdiFormatHeader5} />
              </HeadingControl>
              <HeadingControl heading="h6">
                <Icon path={mdiFormatHeader6} />
              </HeadingControl>
              <LinkControl>
                <Icon path={mdiLink} />
              </LinkControl>
              <TextColorControl
                colors={[
                  "#d11141",
                  "#00b159",
                  "#00aedb",
                  "#f37735",
                  "#ffc425",
                  "#edc951",
                  "#eb6841",
                  "#cc2a36",
                  "#4f372d",
                  "#00a0b0"
                ]}
              >
                <Icon path={mdiFormatColorText} />
              </TextColorControl>
            </HoverTools>
            <Editor
              spellCheck={false}
              style={{ overflow: "auto", minHeight: 500 }}
            ></Editor>
          </div>
        </Chief>
      </ContentStyle>
    </div>
  );
}

export default App;
