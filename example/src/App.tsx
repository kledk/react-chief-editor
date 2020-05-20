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
  ParagraphAddon
} from "redia-aeditor";
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
      children: [{ text: "Header1" }]
    },
    {
      type: "image",
      url:
        "https://www.platekompaniet.no/globalassets/imported-images/cd/2000334734.jpg?preset=ProductPage",
      children: [
        {
          text: "asd"
        }
      ]
    },
    {
      type: "ordered-list",
      children: [
        { type: "list-item", children: [{ text: "kasper" }] },
        { type: "list-item", children: [{ text: "laura" }] }
      ]
    },
    {
      type: "unordered-list",
      children: [
        { type: "list-item", children: [{ text: "kasper" }] },
        { type: "list-item", children: [{ text: "laura" }] }
      ]
    }
  ]);

  // useEffect(() => console.log(value), [value]);

  const [preferDark, setPreferDark] = useState(false);

  const addons = (
    <>
      <ParagraphAddon></ParagraphAddon>
      <BoldAddon labels={{ name: "Fed" }}></BoldAddon>
      <ItalicAddon></ItalicAddon>
      <UnderlineAddon></UnderlineAddon>
      <StrikethroughAddon></StrikethroughAddon>
      <HeadingsAddon></HeadingsAddon>
      <ImageAddon
        onUploadRequest={async files => {
          return new Promise((res, rej) => {
            setTimeout(
              () =>
                res(
                  "https://newsbreak.dk/wp-content/uploads/2019/10/20191002-135123-L_web-610x377.jpg"
                ),
              1000
            );
          });
        }}
      ></ImageAddon>
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
      <Chief value={value} onChange={value => setValue(value)}>
        {addons}
        <Editor
          theme={{
            overrides: {
              Editor: css`
                font-size: 14px;
                ol,
                ul {
                  margin: 0;
                  padding-inline-start: 15px;
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
          spellCheck={false}
          style={{ margin: 10, overflow: "auto", minHeight: 500 }}
        ></Editor>
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
