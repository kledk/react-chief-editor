// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Aeditor } from "redia-aeditor";
import { Node } from "slate";

function App() {
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "en to tre fire fem seks syv" }]
    }
  ]);

  useEffect(() => console.log(value), [value]);

  return (
    <div style={{ padding: "1em" }}>
      <Aeditor
        value={value}
        onChange={value => setValue(value)}
        theme={{
          fontSize: 14
        }}
      ></Aeditor>
    </div>
  );
}

export default App;
