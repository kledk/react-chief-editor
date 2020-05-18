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
  Input
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
      onPlugin: {
        isVoid: isVoid => element =>
          Element.isElement(element) && element.type === "custom_void_element"
            ? true
            : isVoid(element)
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

  useRenderElement(
    {
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
    },
    props
  );

  return null;
}

function App() {
  const [value, setValue] = useState<Node[]>([
    {
      type: "heading-1",
      children: [{ text: "Header1" }]
    },
    {
      type: "paragraph",
      children: [{ text: "en to tre fire fem seks syv" }]
    },
    {
      type: "image",
      children: [{ text: "" }],
      url:
        "https://newsbreak.dk/wp-content/uploads/2019/10/20191002-135123-L_web-610x377.jpg"
    }
  ]);

  // useEffect(() => console.log(value), [value]);

  const [preferDark, setPreferDark] = useState(false);

  const addons = (
    <>
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
      {/* <ExampleVideoAddon labels={{ name: "ExampleVideo" }}></ExampleVideoAddon> */}
    </>
  );

  return (
    <div style={{ padding: "1em" }}>
      <div>
        <span>
          <input
            type="checkbox"
            onChange={e => setPreferDark(Boolean(e.target.checked))}
          ></input>{" "}
          Prefer dark (use browser preference for dark mode)
        </span>
      </div>
      <Chief value={value} onChange={value => setValue(value)}>
        {addons}
        <Editor
          theme={{
            preferDarkOption: preferDark,
            darkTheme: {
              background: "black",
              foreground: "white"
            },
            overrides: {
              Editor: css`
                font-size: 14px;
              `
            }
          }}
          spellCheck={false}
          style={{ margin: 10, overflow: "auto" }}
        ></Editor>
      </Chief>

      <textarea
        style={{ width: "100%", height: 400 }}
        value={JSON.stringify(value, null, 2)}
        readOnly
      ></textarea>
    </div>
  );
}

export default App;
