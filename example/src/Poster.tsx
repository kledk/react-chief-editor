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
  EnforceLayoutAddon,
  PosterBlockAddon,
} from "../../src/index";
import { Descendant } from "slate";
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
  mdiFormatColorText,
} from "@mdi/js";
import redia from "./redia.json";
import { ContentStyle } from "./ContentStyle";
import { css } from "styled-components";

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
  "elements.heading.h6.placeholder": "Overskrift 6",
};

function App() {
  // const [value, setValue] = useState<Node[]>(lorem);
  // const [value, setValue] = useState<Descendant[]>([
  // {
  //   type: "poster-block",
  //   backgroundColor: "rgb(255, 200, 84)",
  //   flex: 0.7,
  //   children: [{ text: "" }],
  // },
  // {
  //   type: "poster-block",
  //   backgroundColor: "rgb(79, 9, 119)",
  //   flex: 0.3,
  //   children: [
  //     { type: "h1", children: [{ text: "fdssdf" }] },
  //     { type: "paragraph", children: [{ text: "fdsfsd" }] },
  //     { type: "paragraph", children: [{ text: "fdsdsf" }] },
  //   ],
  // },
  // {
  //   type: "h1",
  //   children: [{ text: "" }],
  // },
  // {
  //   type: "h1",
  //   children: [{ text: "" }],
  // },
  // {
  //   type: "paragraph",
  //   children: [{ text: "" }],
  // },
  // {
  //   type: "poster-block",
  //   backgroundColor: "blue",
  //   flex: 1,
  //   children: [{ type: "h1", children: [{ text: "Hej" }] }],
  // },
  // ]);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  // ""(JSON.stringify(value));

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
  const [preview, setPreview] = useState(false);
  const [zoom, setZoom] = useState(1);
  const width = 700;
  const height = width * 1.3;
  return (
    <div>
      <div style={{ display: preview ? "none" : undefined }}>
        <select
          value={zoom}
          onChange={(e) => setZoom(Number(e.currentTarget.value))}
        >
          <option value="0.5">50%</option>
          <option value="0.75">75%</option>
          <option value="0.9">90%</option>
          <option value="1">100%</option>
        </select>
        <button onClick={() => setPreview(true)}>Preview</button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width,
            height,
            zoom: zoom,
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              overflow: "hidden",
              border: "1px solid #eee",
              padding: 10,
            }}
          >
            <ContentStyle width={width}>
              <Chief
                value={value}
                onChange={(value) => setValue(value)}
                theme={{
                  overrides: {
                    Editor: css`
                      display: flex;
                      flex: 1;
                      margin: 0;
                      font-family: "Source Sans Pro", sans-serif;
                      -webkit-font-smoothing: antialiased;
                      -moz-osx-font-smoothing: grayscale;

                      code {
                        font-family: source-code-pro, Menlo, Monaco, Consolas,
                          "Courier New", monospace;
                      }
                    `,
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
                  },
                }}
              >
                <EnforceLayoutAddon
                  layout={[
                    // {
                    //   type: "poster-block",
                    // },
                    // {
                    //   type: "poster-block",
                    // },
                    {
                      element: {
                        type: "poster-block",
                        void: true,
                        flex: 0.45,
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1612979168796-bcae1575b8c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80')",
                      },
                      path: [0],
                    },
                    {
                      element: {
                        type: "poster-block",
                        void: true,
                        flex: 0.1,
                        backgroundColor: "#1e2139",
                      },
                      path: [1],
                    },
                    {
                      element: {
                        type: "poster-block",
                        flex: 0.45,
                        backgroundColor: "#237777",
                      },
                      path: [2],
                    },
                    {
                      element: {
                        type: "h1",
                      },
                      path: [2, 0],
                    },
                    {
                      element: {
                        type: "paragraph",
                      },
                      path: [2, 1],
                    },
                  ]}
                />
                <PosterBlockAddon />
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
                <BlockTabAddon />
                <TextColorAddon />

                <HoverTools>
                  <StyledToolBox>
                    <ToolsWrapper>
                      <BoldControl>
                        {(props) => <Icon path={mdiFormatBold} {...props} />}
                      </BoldControl>
                      <ItalicControl>
                        {(props) => <Icon path={mdiFormatItalic} {...props} />}
                      </ItalicControl>
                      <StrikethroughControl>
                        {(props) => (
                          <Icon path={mdiFormatStrikethrough} {...props} />
                        )}
                      </StrikethroughControl>
                      <UnderlineControl>
                        {(props) => (
                          <Icon path={mdiFormatUnderline} {...props} />
                        )}
                      </UnderlineControl>
                      <HeadingControl heading="h1">
                        {(props) => <Icon path={mdiFormatHeader1} {...props} />}
                      </HeadingControl>
                      <HeadingControl heading="h2">
                        {(props) => <Icon path={mdiFormatHeader2} {...props} />}
                      </HeadingControl>
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
                          "#9d5961",
                        ]}
                      >
                        {(props) => (
                          <Icon path={mdiFormatColorText} {...props} />
                        )}
                      </TextColorControl>
                    </ToolsWrapper>
                  </StyledToolBox>
                </HoverTools>
                <Editor
                  spellCheck={false}
                  style={{
                    overflow: "auto",
                    minHeight: 500,
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                  }}
                ></Editor>
              </Chief>
            </ContentStyle>
          </div>
        </div>
      </div>

      {preview && (
        <>
          <button onClick={() => setPreview(false)}>Designer</button>
          {[
            [400, 520],
            [1200, 700],
            [700, 1200],
          ].map((dims) => {
            return (
              <div
                style={{
                  margin: 20,
                  width: dims[0],
                  height: dims[1],
                  overflow: "hidden",
                  border: "30px solid #1d1d1d",
                  borderRadius: 10,
                  display: "flex",
                  boxShadow:
                    "0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)",
                }}
              >
                <ContentStyle width={dims[0]}>
                  <ChiefPresentation
                    value={value}
                    presenters={[
                      ParagraphAddon.Presenter,
                      BoldAddon.Presenter,
                      ItalicAddon.Presenter,
                      StrikethroughAddon.Presenter,
                      UnderlineAddon.Presenter,
                      HeadingsAddon.Presenter,
                      ListsAddon.Presenter,
                      ImageAddon.Presenter,
                      TextColorAddon.Presenter,
                      PosterBlockAddon.Presenter,
                    ]}
                  ></ChiefPresentation>
                </ContentStyle>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default App;
