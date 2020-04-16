// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Aeditor } from "redia-aeditor";
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
    },
  ]);

  // useEffect(() => console.log(value), [value]);

  return (
    <div style={{ padding: "1em" }}>
      <Aeditor
        value={value}
        onChange={value => setValue(value)}
        theme={{
          fontSize: 14
        }}
        spellCheck={false}
        style={{ margin: 10, overflow: "auto" }}
      ></Aeditor>
    </div>
  );
}

export default App;
