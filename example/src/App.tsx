// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Aeditor, CoreAddons } from "redia-aeditor";
import { Node } from "slate";

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
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1200px-Lion_waiting_in_Namibia.jpg"
    },
    {
      type: "paragraph",
      children: [{ text: "en to tre fire fem seks syv" }]
    }
  ]);

  useEffect(() => console.log(value), [value]);

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
      <Aeditor
        addons={[...CoreAddons]}
        value={value}
        onChange={value => setValue(value)}
        theme={{
          preferDarkOption: preferDark,
          darkTheme: {
            background: "black",
            foreground: "white"
          },
          editor: { fontSize: 14 }
        }}
        spellCheck={false}
        style={{ margin: 10, overflow: "auto" }}
      ></Aeditor>
      <textarea
        style={{ width: "100%", height: 400 }}
        value={JSON.stringify(value, null, 2)}
        readOnly
      ></textarea>
    </div>
  );
}

export default App;
