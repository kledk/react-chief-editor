import React, { useState } from "react";
import { Editor as SlateEditor } from "slate";
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
  // Custom addon creation
  AddonProps,
  useRenderElement,
  InputWrapper,
  usePlugin,
  // Presentation
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
  ToolsWrapper,
  useOnKeyDown
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
  const { isActive, theme, ...otherProps } = props;
  return (
    <MdiIcon
      color={isActive ? theme?.colors?.primary : "#2b2b2b"}
      size={0.7}
      {...otherProps}
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

function ColumnsAddon(props: AddonProps) {
  usePlugin({});

  useOnKeyDown({
    pattern: "enter",
    handler: (e, editor) => {
      const { selection } = editor;
      if (selection) {
        const [node] = SlateEditor.nodes(editor, {
          at: selection,
          match: n => n.type === "columns"
        });
        if (node) {
          e.preventDefault();
          editor.insertText("\n");
        }
      }
    }
  });

  useRenderElement({
    typeMatch: "columns",
    renderElement: (props, editor) => {
      return (
        <div
          {...props.attributes}
          style={{ display: "flex", flexDirection: "row" }}
        >
          {props.children}
        </div>
      );
    }
  });

  useRenderElement({
    typeMatch: "column",
    renderElement: (props, editor) => {
      return (
        <div
          style={{ flex: 1, border: "1px dashed #ccc" }}
          {...props.attributes}
        >
          {React.Children.map(props.children, it => it)}
        </div>
      );
    }
  });

  return null;
}

const ContentStyle = styled.div`
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #4b4a4a;
  font-size: 18px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #202020;
  }
  a {
    color: rgb(234 66 205);
  }
`;

function App() {
  const [value, setValue] = useState<Node[]>(lorem);

  console.log(JSON.stringify(value));

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
          <ColumnsAddon />
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
                    {props => <Icon path={mdiFormatParagraph} {...props} />}
                  </ParagraphControl>
                  <HeadingControl heading="h1">
                    {props => <Icon path={mdiFormatHeader1} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h2">
                    {props => <Icon path={mdiFormatHeader2} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h3">
                    {props => <Icon path={mdiFormatHeader3} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h4">
                    {props => <Icon path={mdiFormatHeader4} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h5">
                    {props => <Icon path={mdiFormatHeader5} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h6">
                    {props => <Icon path={mdiFormatHeader6} {...props} />}
                  </HeadingControl>
                  <ListControl type="ordered-list">
                    {props => <Icon path={mdiFormatListNumbered} {...props} />}
                  </ListControl>
                  <ListControl type="unordered-list">
                    {props => <Icon path={mdiFormatListBulleted} {...props} />}
                  </ListControl>
                  <ImageControl>
                    {props => <Icon path={mdiImage} {...props} />}
                  </ImageControl>
                </ToolsWrapper>
              </StyledToolBox>
            </BlockInsert>
            <HoverTools>
              <StyledToolBox>
                <ToolsWrapper>
                  <BoldControl>
                    {props => <Icon path={mdiFormatBold} {...props} />}
                  </BoldControl>
                  <ItalicControl>
                    {props => <Icon path={mdiFormatItalic} {...props} />}
                  </ItalicControl>
                  <StrikethroughControl>
                    {props => <Icon path={mdiFormatStrikethrough} {...props} />}
                  </StrikethroughControl>
                  <UnderlineControl>
                    {props => <Icon path={mdiFormatUnderline} {...props} />}
                  </UnderlineControl>
                  <HeadingControl heading="h1">
                    {props => <Icon path={mdiFormatHeader1} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h2">
                    {props => <Icon path={mdiFormatHeader2} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h3">
                    {props => <Icon path={mdiFormatHeader3} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h4">
                    {props => <Icon path={mdiFormatHeader4} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h5">
                    {props => <Icon path={mdiFormatHeader5} {...props} />}
                  </HeadingControl>
                  <HeadingControl heading="h6">
                    {props => <Icon path={mdiFormatHeader6} {...props} />}
                  </HeadingControl>
                  <LinkControl>
                    {props => <Icon path={mdiLink} {...props} />}
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
                    {props => <Icon path={mdiFormatColorText} {...props} />}
                  </TextColorControl>
                </ToolsWrapper>
              </StyledToolBox>
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
