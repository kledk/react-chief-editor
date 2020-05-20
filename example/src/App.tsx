import React, { useState } from "react";
import {
  Editor,
  Chief,
  BoldAddon,
  ImageAddon,
  useCreateAddon,
  ToolbarBtn,
  Addon,
  ItalicAddon,
  UnderlineAddon,
  StrikethroughAddon,
  HeadingsAddon,
  ResetToParagraphAddon,
  PreventNewlineAddon,
  LinkAddon,
  useRenderElement,
  InputWrapper,
  Input,
  usePlugin,
  ListsAddon,
  BlockTabAddon,
  ParagraphAddon,
  headingBlockControls,
  BlockInsert,
  BlockInsertControls,
  HoverToolProvider,
  imageBlockControls,
  HoverToolControls,
  boldControl,
  italicControl,
  strikethroughControl,
  underlineControl,
  headingContextControls,
  linkControl
} from "chief-editor";
import { Node, Element } from "slate";
import { css } from "styled-components";

function ExampleVideoAddon(props: Addon) {
  // const editor = useSlate();
  const { addon } = useCreateAddon(
    {
      name: "custom_void_element",
      labels: {
        name: "Custom void element"
      },
      hoverMenu: {
        order: 0,
        category: "video",
        typeMatch: /custom_void_element/,
        renderButton: (editor, addon) => (
          <ToolbarBtn>{addon?.labels?.name}</ToolbarBtn>
        )
      }
    },
    props
  );

  usePlugin({
    isVoid: isVoid => element =>
      Element.isElement(element) && element.type === "custom_void_element"
        ? true
        : isVoid(element)
  });

  useRenderElement({
    typeMatch: /custom_void_element/,
    renderElement: (props, editor) => {
      console.log(props);
      return (
        <div {...props.attributes}>
          <InputWrapper>
            <Input />
          </InputWrapper>
          {props.children}
        </div>
      );
    }
  });

  return null;
}

function App() {
  const [value, setValue] = useState<Node[]>([
    {
      type: "heading-1",
      children: [{ text: "Dark" }]
    },
    {
      type: "paragraph",
      children: [
        {
          text:
            "Dark er en tysksproget web-tv-serie skabt af Baran bo Odar og Jantje Friese for Netflix. Serien havde premiere på Netflix 1. december 2017. Den første sæson – på ti afsnit – blev hovedsagelig godt modtaget, med positive og negative sammenligninger med Stranger Things, en anden overnaturlig thrillerserie fra Netflix"
        }
      ]
    },
    {
      type: "heading-1",
      children: [{ text: "Images" }]
    },
    {
      type: "image",
      url:
        "https://occ-0-1068-1723.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABSJBCX9UxJkkZH_NLhm0nynLxHTqy99ETHJuidWOohECj4qKD3kqC8kr4gk2anceRXPMLULS3hruYHK56hpZCSsWD1GqNO4GaWrot7bwzPHJqxfT.jpg?r=2af",
      children: [
        {
          text: "asd"
        }
      ]
    },
    {
      type: "heading-1",
      children: [{ text: "Lists" }]
    },
    {
      type: "heading-2",
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
      type: "heading-2",
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
      <ParagraphAddon></ParagraphAddon>
      <BoldAddon></BoldAddon>
      <ItalicAddon></ItalicAddon>
      <UnderlineAddon></UnderlineAddon>
      <StrikethroughAddon></StrikethroughAddon>
      <HeadingsAddon></HeadingsAddon>
      <ImageAddon></ImageAddon>
      <ResetToParagraphAddon></ResetToParagraphAddon>
      <PreventNewlineAddon></PreventNewlineAddon>
      <LinkAddon></LinkAddon>
      <ListsAddon></ListsAddon>
      <BlockTabAddon></BlockTabAddon>
      {/* <ExampleVideoAddon labels={{ name: "ExampleVideo" }}></ExampleVideoAddon> */}
    </>
  );

  return (
    <div style={{ padding: "1em" }}>
      <Chief
        value={value}
        onChange={value => setValue(value)}
        theme={{
          overrides: {
            Editor: css`
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
              ol,
              ul {
                margin: 0;
                padding-inline-start: 25px;
              }
              ol ol ol ol,
              ol {
                list-style: decimal outside none;
              }
              ol ol ol ol ol,
              ol ol {
                list-style: lower-latin outside none;
              }
              ol ol ol ol ol ol,
              ol ol ol {
                list-style: lower-roman outside none;
              }
              ul ul ul ul,
              ul {
                list-style: square outside none;
              }

              ul ul ul ul ul,
              ul ul {
                list-style: circle outside none;
              }

              ul ul ul ul ul ul,
              ul ul ul {
                list-style: disc outside none;
              }
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
              controls={[...headingBlockControls, ...imageBlockControls]}
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

      {/* <textarea
        style={{ width: "100%", height: 400 }}
        value={JSON.stringify(value, null, 2)}
        readOnly
      ></textarea> */}
    </div>
  );
}

export default App;
