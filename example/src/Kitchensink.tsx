import React, { useState, useEffect } from "react";
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
  InputWrapper,
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
  ChiefPresentation,
  usePlugin,
  useOnKeyDown,
  getNodeFromSelection
} from "react-chief-editor";
import {
  Node,
  Element,
  Range,
  Path,
  Editor as SlateEditor,
  Transforms
} from "slate";
import { css } from "styled-components";
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
import redia from "./redia.json";
import { ColumnsAddon } from "./ColumnsAddon";
import { ContentStyle } from "./ContentStyle";
import { useSlate } from "slate-react";

function TestAddon() {
  return null;
}

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

function App() {
  // const [value, setValue] = useState<Node[]>(lorem);
  const [value, setValue] = useState<Node[]>(redia);
  // const [value, setValue] = useState<Node[]>([
  //   {
  //     type: "paragraph",
  //     children: [{ text: "" }]
  //   }
  // ]);

  // console.log(JSON.stringify(value));

  useEffect(() => {
    const data = window.localStorage.getItem("data");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setValue(parsed);
      } catch (error) {}
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("data", JSON.stringify(value));
  }, [value]);

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
          <TestAddon />
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
                      "#1e2139",
                      "#ff5c00",
                      "#cc3e4a",
                      "#ffc854",
                      "#31b27b",
                      "#2d5c7c",
                      "#237777",
                      "#376c6c",
                      "#63a5a5",
                      "#9d5961"
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
      <div style={{ flex: 1 }}>
        <ContentStyle>
          <ChiefPresentation
            value={value}
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
    </div>
  );
}

export default App;
