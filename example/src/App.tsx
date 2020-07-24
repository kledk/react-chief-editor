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
  LinkAddon,
  ListsAddon,
  BlockTabAddon,
  ParagraphAddon,
  TextColorAddon,
  LabelsAddon,
  // Block toolbar addon
  BlockInsert,
  headingBlockControls,
  BlockInsertControls,
  // Custom addon creation
  AddonProps,
  useRenderElement,
  InputWrapper,
  usePlugin,
  HoverToolProvider,
  imageBlockControls,
  HoverToolControls,
  italicControl,
  strikethroughControl,
  underlineControl,
  headingContextControls,
  linkControl,
  // Presentation
  ChiefPresentation
} from "react-chief-editor";
import { Node, Element } from "slate";
import styled, { css } from "styled-components";

const editorLabels = {
  "marks.bold": "Fed",
  "marks.italic": "Kursiv",
  "marks.strikethrough": "Gennemstreg",
  "marks.underline": "Understreg",
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
  background-color: #151515;
  color: rgba(28, 98, 116);
  font-size: 18px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: rgba(153, 109, 33);
  }
  a {
    color: rgba(153, 109, 33);
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
          text: "\n"
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

  const addons = (
    <>
      <LabelsAddon labels={editorLabels}></LabelsAddon>
      <ParagraphAddon></ParagraphAddon>
      <BoldAddon></BoldAddon>
      <ItalicAddon></ItalicAddon>
      <UnderlineAddon></UnderlineAddon>
      <StrikethroughAddon></StrikethroughAddon>
      <HeadingsAddon></HeadingsAddon>
      <ImageAddon></ImageAddon>
      <ResetToParagraphAddon></ResetToParagraphAddon>
      <PreventNewlineAddon></PreventNewlineAddon>
      <PreventNewlineAddon></PreventNewlineAddon>
      <LinkAddon></LinkAddon>
      <ListsAddon></ListsAddon>
      <BlockTabAddon></BlockTabAddon>
      <TextColorAddon></TextColorAddon>
      {/* <ExampleVideoAddon labels={{ name: "ExampleVideo" }}></ExampleVideoAddon> */}
    </>
  );

  console.log(value);

  return (
    <div style={{ padding: "1em" }}>
      <ContentStyle>
        <Chief
          value={value}
          onChange={value => setValue(value)}
          theme={{
            overrides: {
              ui: css`
                /* font-family: monospace; */
              `
            }
          }}
        >
          {addons}
          <div
            style={{
              marginLeft: 20
            }}
          >
            <BlockInsert>
              <BlockInsertControls
                controls={[
                  ...headingBlockControls,
                  ...imageBlockControls,
                  ListsAddon.Control
                ]}
              />
            </BlockInsert>
            <HoverToolProvider
              hoverTool={
                <HoverToolControls
                  controls={[
                    BoldAddon.Control,
                    italicControl,
                    strikethroughControl,
                    underlineControl,
                    ...headingContextControls,
                    linkControl
                  ]}
                />
              }
            >
              <Editor
                spellCheck={false}
                style={{ margin: 10, overflow: "auto", minHeight: 500 }}
              ></Editor>
            </HoverToolProvider>
          </div>
        </Chief>
      </ContentStyle>
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
            ImageAddon.Presenter
          ]}
        ></ChiefPresentation>
      </ContentStyle>
    </div>
  );
}

export default App;
