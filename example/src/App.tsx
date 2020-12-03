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
  LinkControl
} from "react-chief-editor";
import { Node, Element } from "slate";
import styled, { css } from "styled-components";

const editorLabels = {
  "marks.bold": "Fed",
  "marks.italic": "Kursiv",
  "marks.strikethrough": "Gennemstreg",
  "marks.underline": "Understreg",
  "marks.color": "Farve",
  "elements.link": "Link",
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
  const [value, setValue] = useState<Node[]>([
    {
      type: "h1",
      children: [{ text: "Dark" }]
    },
    {
      type: "paragraph",
      children: [
        {
          text:
            "Dark er en tysksproget web-tv-serie skabt af Baran bo Odar og Jantje Friese for Netflix. Serien havde premiere på Netflix 1. december 2017. Den første sæson – på ti afsnit – blev hovedsagelig godt modtaget, med positive og negative sammenligninger med Stranger Things, en anden overnaturlig thrillerserie fra Netflix"
        },
        {
          text: "red",
          color: "red"
        }
      ]
    },
    {
      type: "h1",
      children: [{ text: "Images" }]
    },
    {
      type: "image",
      width: 700,
      height: 420,
      align: "left",
      url:
        "https://occ-0-1068-1723.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABSJBCX9UxJkkZH_NLhm0nynLxHTqy99ETHJuidWOohECj4qKD3kqC8kr4gk2anceRXPMLULS3hruYHK56hpZCSsWD1GqNO4GaWrot7bwzPHJqxfT.jpg?r=2af",
      children: [
        {
          text: "asd"
        }
      ]
    },
    {
      type: "h1",
      children: [{ text: "Lists" }]
    },
    {
      type: "h2",
      children: [{ text: "Ordered" }]
    },
    {
      type: "ordered-list",
      children: [
        { type: "list-item", children: [{ text: "Item 1" }] },
        { type: "list-item", children: [{ text: "item 2" }] }
      ]
    },
    {
      type: "h2",
      children: [{ text: "Unordered" }]
    },
    {
      type: "unordered-list",
      children: [
        { type: "list-item", children: [{ text: "Item " }] },
        { type: "list-item", children: [{ text: "item" }] }
      ]
    }
  ]);

  console.log(value);

  return (
    <div style={{ padding: "1em" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
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
                  marginLeft: 20
                }}
              >
                <BlockInsert>
                  <HeadingControl heading="h1" />
                  <HeadingControl heading="h2" />
                  <HeadingControl heading="h3" />
                  <HeadingControl heading="h4" />
                  <HeadingControl heading="h5" />
                  <HeadingControl heading="h6" />
                  <ListControl type="ordered-list">OL</ListControl>
                  <ListControl type="unordered-list">UL</ListControl>
                  <ImageControl />
                </BlockInsert>
                <HoverTools>
                  <BoldControl />
                  <ItalicControl />
                  <StrikethroughControl />
                  <UnderlineControl />
                  <HeadingControl heading="h1" />
                  <HeadingControl heading="h2" />
                  <HeadingControl heading="h3" />
                  <HeadingControl heading="h4" />
                  <HeadingControl heading="h5" />
                  <HeadingControl heading="h6" />
                  <LinkControl />
                  <TextColorControl
                    colors={[
                      "red",
                      "green",
                      "yellow",
                      "blue",
                      "purple",
                      "cyan",
                      "white",
                      "black",
                      "orange"
                    ]}
                  />
                </HoverTools>
                <Editor
                  spellCheck={false}
                  style={{ overflow: "auto", minHeight: 500 }}
                ></Editor>
              </div>
            </Chief>
          </ContentStyle>
        </div>
        {/* <div style={{ flex: 1 }}>
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
                linkPresenter,
                ListsAddon.Presenter,
                ImageAddon.Presenter,
                textColorPresenter
              ]}
            ></ChiefPresentation>
          </ContentStyle>
        </div> */}
      </div>
    </div>
  );
}

export default App;
