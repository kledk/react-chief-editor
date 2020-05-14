// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Editor,
  CoreAddons,
  Chief,
  BoldAddon,
  useCreateAddon,
  ToolbarBtn,
  Addon
} from "redia-aeditor";
import { Node, Element } from "slate";
import { css } from "styled-components";

function ExampleVideoAddon(props: Addon) {
  const ExampleVideo = useCreateAddon(
    {
      labels: {
        name: "Video"
      },
      withPlugin: editor => {
        const { isVoid } = editor;
        editor.isVoid = element => {
          return Element.isElement(element) && element.type === "customimage"
            ? true
            : isVoid(element);
        };
        return editor;
      },
      element: {
        typeMatch: /customimage/,
        renderElement: (props, editor) => {
          return (
            <div {...props.attributes}>
              <img src={props.element.url}></img>
              {props.children}
            </div>
          );
        }
      },
      hoverMenu: {
        order: 0,
        category: "video",
        typeMatch: /customimage/,
        renderButton: (editor, addon) => (
          <ToolbarBtn>{addon.labels.name}</ToolbarBtn>
        )
      }
    },
    props
  );
  return <ExampleVideo></ExampleVideo>;
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
        "https://stepoutbuffalo.com/wp-content/uploads/2018/07/kid-rock-and-brantley-gilbert-e1530892362363.jpg"
    },
    {
      type: "customimage",
      children: [{ text: "asd" }],
      url:
        "https://stepoutbuffalo.com/wp-content/uploads/2018/07/kid-rock-and-brantley-gilbert-e1530892362363.jpg"
    }
  ]);

  // useEffect(() => console.log(value), [value]);

  const [preferDark, setPreferDark] = useState(false);

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
      <Chief addons={[...CoreAddons]}>
        <BoldAddon labels={{ name: "Fed" }}></BoldAddon>
        <ExampleVideoAddon
          labels={{ name: "ExampleVideo" }}
        ></ExampleVideoAddon>
        <Editor
          value={value}
          onChange={value => setValue(value)}
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
